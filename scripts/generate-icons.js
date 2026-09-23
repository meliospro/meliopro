import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function generate() {
  const svgPath = path.join(process.cwd(), 'public', 'icon.svg');
  const svgBuffer = fs.readFileSync(svgPath);

  console.log('Generating PWA icons...');
  await sharp(svgBuffer).resize(192, 192).png().toFile(path.join(process.cwd(), 'public', 'pwa-192x192.png'));
  await sharp(svgBuffer).resize(512, 512).png().toFile(path.join(process.cwd(), 'public', 'pwa-512x512.png'));
  await sharp(svgBuffer).resize(512, 512).png().toFile(path.join(process.cwd(), 'public', 'pwa-maskable-512x512.png'));
  await sharp(svgBuffer).resize(180, 180).png().toFile(path.join(process.cwd(), 'public', 'apple-touch-icon.png'));
  await sharp(svgBuffer).resize(48, 48).png().toFile(path.join(process.cwd(), 'public', 'favicon.ico'));

  console.log('Icons generated successfully!');
}

generate().catch(console.error);
