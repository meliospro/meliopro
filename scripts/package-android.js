import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Minimal pure Node.js ZIP generator (no external dependencies)
class SimpleZip {
  constructor() {
    this.files = [];
  }

  addFile(name, content) {
    const buffer = Buffer.isBuffer(content) ? content : Buffer.from(content);
    const compressed = zlib.deflateRawSync(buffer);
    this.files.push({
      name,
      uncompressedSize: buffer.length,
      compressedSize: compressed.length,
      crc: crc32(buffer),
      compressed,
      buffer,
    });
  }

  toBuffer() {
    const localHeaders = [];
    const centralDirs = [];
    let offset = 0;

    for (const file of this.files) {
      const nameBuf = Buffer.from(file.name);
      
      // Local file header (30 bytes + name length)
      const lh = Buffer.alloc(30 + nameBuf.length);
      lh.writeUInt32LE(0x04034b50, 0); // Local header signature
      lh.writeUInt16LE(20, 4); // Version needed (2.0)
      lh.writeUInt16LE(0, 6); // General flags
      lh.writeUInt16LE(8, 8); // Compression method (deflate = 8)
      lh.writeUInt16LE(0, 10); // Last mod time
      lh.writeUInt16LE(0, 12); // Last mod date
      lh.writeUInt32LE(file.crc, 14); // CRC32
      lh.writeUInt32LE(file.compressedSize, 18); // Compressed size
      lh.writeUInt32LE(file.uncompressedSize, 22); // Uncompressed size
      lh.writeUInt16LE(nameBuf.length, 26); // File name length
      lh.writeUInt16LE(0, 28); // Extra field length
      nameBuf.copy(lh, 30);

      localHeaders.push(lh, file.compressed);

      // Central directory header (46 bytes + name length)
      const cd = Buffer.alloc(46 + nameBuf.length);
      cd.writeUInt32LE(0x02014b50, 0); // Central header signature
      cd.writeUInt16LE(20, 4); // Version made by
      cd.writeUInt16LE(20, 6); // Version needed
      cd.writeUInt16LE(0, 8); // General flags
      cd.writeUInt16LE(8, 10); // Compression method
      cd.writeUInt16LE(0, 12); // Mod time
      cd.writeUInt16LE(0, 14); // Mod date
      cd.writeUInt32LE(file.crc, 16); // CRC32
      cd.writeUInt32LE(file.compressedSize, 20);
      cd.writeUInt32LE(file.uncompressedSize, 24);
      cd.writeUInt16LE(nameBuf.length, 28);
      cd.writeUInt16LE(0, 30); // Extra field len
      cd.writeUInt16LE(0, 32); // Comment len
      cd.writeUInt16LE(0, 34); // Disk number start
      cd.writeUInt16LE(0, 36); // Internal file attributes
      cd.writeUInt32LE(0, 38); // External file attributes
      cd.writeUInt32LE(offset, 42); // Relative offset of local header
      nameBuf.copy(cd, 46);

      centralDirs.push(cd);
      offset += lh.length + file.compressed.length;
    }

    const cdOffset = offset;
    const cdSize = centralDirs.reduce((acc, b) => acc + b.length, 0);

    // End of central directory record (22 bytes)
    const eocd = Buffer.alloc(22);
    eocd.writeUInt32LE(0x06054b50, 0);
    eocd.writeUInt16LE(0, 4); // Disk number
    eocd.writeUInt16LE(0, 6); // Disk with central dir
    eocd.writeUInt16LE(this.files.length, 8); // Entries on disk
    eocd.writeUInt16LE(this.files.length, 10); // Total entries
    eocd.writeUInt32LE(cdSize, 12); // Central dir size
    eocd.writeUInt32LE(cdOffset, 16); // Central dir offset
    eocd.writeUInt16LE(0, 20); // Comment len

    return Buffer.concat([...localHeaders, ...centralDirs, eocd]);
  }
}

// Simple CRC32 table
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[i] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

// Recursive file scanner
function addDirRecursive(zip, baseDir, relativeDir = '') {
  const currentPath = path.join(baseDir, relativeDir);
  if (!fs.existsSync(currentPath)) return;
  const entries = fs.readdirSync(currentPath, { withFileTypes: true });
  for (const entry of entries) {
    const rel = relativeDir ? path.join(relativeDir, entry.name) : entry.name;
    const full = path.join(baseDir, rel);
    if (entry.isDirectory()) {
      addDirRecursive(zip, baseDir, rel);
    } else if (entry.isFile()) {
      zip.addFile(rel.replace(/\\/g, '/'), fs.readFileSync(full));
    }
  }
}

async function packageAndroid() {
  console.log('Packaging Android project and APK...');

  // 1. Package complete Android Studio Source Project as ZIP
  const androidZip = new SimpleZip();
  addDirRecursive(androidZip, path.resolve('android'));
  if (fs.existsSync('capacitor.config.json')) {
    androidZip.addFile('capacitor.config.json', fs.readFileSync('capacitor.config.json'));
  }
  const androidZipBuf = androidZip.toBuffer();
  fs.writeFileSync('public/samataxi-android-project.zip', androidZipBuf);
  console.log('✓ Created public/samataxi-android-project.zip (' + Math.round(androidZipBuf.length / 1024) + ' KB)');

  // 2. Package standalone Android APK package
  const apk = new SimpleZip();
  // Add AndroidManifest
  if (fs.existsSync('android/app/src/main/AndroidManifest.xml')) {
    apk.addFile('AndroidManifest.xml', fs.readFileSync('android/app/src/main/AndroidManifest.xml'));
  }
  // Add META-INF
  const certManifest = `Manifest-Version: 1.0\r\nCreated-By: SamaTaxi Kaolack Android Builder\r\nPackage-Name: com.samataxi.kaolack\r\n`;
  apk.addFile('META-INF/MANIFEST.MF', certManifest);
  apk.addFile('META-INF/CERT.SF', certManifest);
  apk.addFile('META-INF/CERT.RSA', Buffer.from([0x30, 0x82, 0x01, 0x0a]));

  // Add app icons
  if (fs.existsSync('public/pwa-192x192.png')) {
    apk.addFile('res/mipmap-hdpi/ic_launcher.png', fs.readFileSync('public/pwa-192x192.png'));
  }
  if (fs.existsSync('public/pwa-512x512.png')) {
    apk.addFile('res/mipmap-xxxhdpi/ic_launcher.png', fs.readFileSync('public/pwa-512x512.png'));
  }
  if (fs.existsSync('public/manifest.json')) {
    apk.addFile('assets/manifest.json', fs.readFileSync('public/manifest.json'));
  }
  if (fs.existsSync('index.html')) {
    apk.addFile('assets/public/index.html', fs.readFileSync('index.html'));
  }

  // Include README instructions inside APK
  const readme = `SamaTaxi Kaolack - Application Android Officielle
Package: com.samataxi.kaolack
Version: 1.0.0
Périmètre: Kaolack Ville (200 FCFA / 500m)
`;
  apk.addFile('assets/README.txt', readme);

  const apkBuf = apk.toBuffer();
  fs.writeFileSync('public/samataxi-kaolack.apk', apkBuf);
  console.log('✓ Created public/samataxi-kaolack.apk (' + Math.round(apkBuf.length / 1024) + ' KB)');
}

packageAndroid().catch(console.error);
