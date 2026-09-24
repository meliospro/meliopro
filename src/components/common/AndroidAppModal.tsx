import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Download,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  FolderArchive,
  Layers,
  Sparkles,
  X,
  Copy,
  Check,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface AndroidAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidAppModal: React.FC<AndroidAppModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'apk' | 'files' | 'guide'>('apk');
  const [copiedCode, setCopiedCode] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    // Check if running as standalone PWA
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone);

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!isOpen) return null;

  const handleInstallPWA = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
    } else {
      // Fallback: trigger APK download directly
      handleDownloadAPK();
    }
  };

  const handleDownloadAPK = () => {
    setDownloading(true);
    const link = document.createElement('a');
    link.href = '/api/download/apk';
    link.download = 'SamaTaxi-Kaolack.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloading(false), 2000);
  };

  const handleDownloadZip = () => {
    const link = document.createElement('a');
    link.href = '/api/download/android-project';
    link.download = 'SamaTaxi-Kaolack-Android-Studio.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const manifestXmlSnippet = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Permissions requises pour SamaTaxi Kaolack -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.CALL_PHONE" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:label="SamaTaxi Kaolack"
        android:theme="@style/AppTheme"
        android:usesCleartextTraffic="true">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTask">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

  const copyManifest = () => {
    navigator.clipboard.writeText(manifestXmlSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-lg max-h-[92vh] overflow-hidden flex flex-col shadow-2xl text-white">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-amber-500/20 via-neutral-900 to-emerald-500/20 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-neutral-950 flex items-center justify-center font-black shadow-md">
              <Smartphone size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">Application Android</h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  FICHIERS PRÊTS
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                SamaTaxi Kaolack Ville • Package: <span className="text-amber-400 font-mono">com.samataxi.kaolack</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/60 p-1.5 gap-1.5">
          <button
            onClick={() => setActiveTab('apk')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'apk'
                ? 'bg-amber-400 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <Download size={14} />
            <span>Fichier APK (.apk)</span>
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'files'
                ? 'bg-amber-400 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <FolderArchive size={14} />
            <span>Fichiers Source Android</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'guide'
                ? 'bg-amber-400 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <Sparkles size={14} />
            <span>Guide d'installation</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4 text-xs">
          
          {/* TAB 1: DOWNLOAD APK */}
          {activeTab === 'apk' && (
            <div className="space-y-4">
              {/* Highlight Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-neutral-800/90 to-neutral-900 border border-neutral-700/70 relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      Paquet Android Téléchargeable
                    </span>
                    <h4 className="font-extrabold text-sm text-white">
                      SamaTaxi-Kaolack.apk
                    </h4>
                    <p className="text-[11px] text-neutral-300">
                      Version 1.0.0 • Taille: ~315 Ko • Android 6.0 à 15.0+
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                    <Smartphone size={26} />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-700/60 flex flex-wrap gap-2 text-[10px] text-neutral-300">
                  <span className="flex items-center gap-1 bg-neutral-900/80 px-2 py-1 rounded-md border border-neutral-700">
                    <ShieldCheck size={12} className="text-emerald-400" />
                    GPS & Géolocalisation active
                  </span>
                  <span className="flex items-center gap-1 bg-neutral-900/80 px-2 py-1 rounded-md border border-neutral-700">
                    <Zap size={12} className="text-amber-400" />
                    200 FCFA / 500m
                  </span>
                  <span className="flex items-center gap-1 bg-neutral-900/80 px-2 py-1 rounded-md border border-neutral-700">
                    <CheckCircle2 size={12} className="text-blue-400" />
                    Wave & Orange Money
                  </span>
                </div>

                {/* Direct Download Button */}
                <div className="mt-4">
                  <button
                    onClick={handleDownloadAPK}
                    disabled={downloading}
                    className="w-full py-3 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 active:scale-[0.98] transition cursor-pointer"
                  >
                    <Download size={16} />
                    <span>
                      {downloading ? 'Téléchargement en cours...' : 'Télécharger le fichier SamaTaxi-Kaolack.apk'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Alternative: 1-Click Android WebAPK */}
              <div className="p-4 rounded-2xl bg-neutral-800/50 border border-neutral-700/50 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-xs text-white flex items-center gap-1.5">
                    <Zap size={14} className="text-emerald-400" />
                    Installation Directe 1-Clic (WebAPK Android)
                  </h5>
                  {isInstalled && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                      Déjà installée
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Sur Google Chrome Android, vous pouvez installer l'application instantanément sans passer par les autorisations de fichiers externes.
                </p>
                <button
                  onClick={handleInstallPWA}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-md transition active:scale-[0.98] cursor-pointer"
                >
                  <Smartphone size={14} />
                  <span>Installer sur l'écran d'accueil Android</span>
                </button>
              </div>

              {/* Android System Security Tip */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 text-[11px] text-amber-200">
                <AlertTriangle size={15} className="text-amber-400 shrink-0 mt-0.5" />
                <p>
                  Si votre téléphone Android affiche un message <em>« Fichier potentiellement dangereux »</em> lors du téléchargement de l'APK, appuyez sur <strong>« Télécharger quand même »</strong> puis <strong>« Installer »</strong> (il s'agit du comportement standard d'Android pour tout fichier APK téléchargé hors Play Store).
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: ANDROID STUDIO & SOURCE FILES */}
          {activeTab === 'files' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">Fichiers du projet Android</h4>
                  <p className="text-[11px] text-neutral-400">
                    Dossier natif <code className="text-amber-400">/android/</code> configuré pour Android Studio.
                  </p>
                </div>
                <button
                  onClick={handleDownloadZip}
                  className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-bold text-xs flex items-center gap-1.5 border border-neutral-700 transition"
                  title="Télécharger l'archive ZIP du projet"
                >
                  <Download size={13} />
                  <span>Télécharger .ZIP</span>
                </button>
              </div>

              {/* List of Android files in project */}
              <div className="space-y-1.5 font-mono text-[11px]">
                {[
                  {
                    path: 'android/app/src/main/AndroidManifest.xml',
                    desc: 'Manifest Android avec permissions GPS & App Icon',
                    size: '2.1 Ko',
                  },
                  {
                    path: 'android/app/src/main/java/com/samataxi/kaolack/MainActivity.java',
                    desc: 'Activité Android principale avec WebView & GPS bridge',
                    size: '4.8 Ko',
                  },
                  {
                    path: 'android/app/build.gradle',
                    desc: 'Configuration Gradle du module App (SDK 34)',
                    size: '1.2 Ko',
                  },
                  {
                    path: 'android/build.gradle',
                    desc: 'Configuration Gradle racine du projet',
                    size: '0.4 Ko',
                  },
                  {
                    path: 'android/settings.gradle',
                    desc: 'Déclaration du module :app',
                    size: '0.1 Ko',
                  },
                  {
                    path: 'capacitor.config.json',
                    desc: 'Configuration du pont Capacitor vers Android',
                    size: '0.5 Ko',
                  },
                ].map((item) => (
                  <div
                    key={item.path}
                    className="p-2.5 rounded-xl bg-neutral-800/60 border border-neutral-700/60 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCode size={14} className="text-amber-400 shrink-0" />
                      <div className="truncate">
                        <span className="text-white font-semibold truncate block">
                          {item.path}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-sans block truncate">
                          {item.desc}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] text-neutral-400 shrink-0 font-sans">
                      {item.size}
                    </span>
                  </div>
                ))}
              </div>

              {/* Code Preview of AndroidManifest.xml */}
              <div className="rounded-2xl bg-neutral-950 border border-neutral-800 overflow-hidden">
                <div className="px-3 py-2 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-400">
                    <Layers size={12} className="text-amber-400" />
                    <span>AndroidManifest.xml</span>
                  </div>
                  <button
                    onClick={copyManifest}
                    className="text-[10px] text-neutral-300 hover:text-white flex items-center gap-1 font-sans"
                  >
                    {copiedCode ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    <span>{copiedCode ? 'Copié !' : 'Copier'}</span>
                  </button>
                </div>
                <pre className="p-3 text-[10px] font-mono text-neutral-300 overflow-x-auto leading-relaxed max-h-48">
                  {manifestXmlSnippet}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: INSTALLATION GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-3.5">
              <h4 className="font-bold text-sm text-white">Comment installer sur votre smartphone Android :</h4>

              <div className="space-y-2.5">
                {[
                  {
                    step: '1',
                    title: 'Télécharger le fichier APK',
                    desc: 'Cliquez sur le bouton jaune « Télécharger le fichier SamaTaxi-Kaolack.apk ». Le fichier est stocké dans vos Téléchargements.',
                  },
                  {
                    step: '2',
                    title: 'Ouvrir le fichier téléchargé',
                    desc: 'Faites glisser la barre de notification de votre smartphone ou ouvrez l\'application « Fichiers » > Téléchargements > appuyez sur SamaTaxi-Kaolack.apk.',
                  },
                  {
                    step: '3',
                    title: 'Autoriser la source (si demandé)',
                    desc: 'Si Android demande « Installer des applications inconnues », activez le bouton pour votre navigateur (Chrome / Fichiers).',
                  },
                  {
                    step: '4',
                    title: 'Lancer SamaTaxi Kaolack',
                    desc: 'Appuyez sur « Installer » puis « Ouvrir ». Accordez l\'autorisation de localisation pour géolocaliser vos trajets à 200 FCFA / 500m.',
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="p-3 rounded-xl bg-neutral-800/60 border border-neutral-700/60 flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-lg bg-amber-400 text-neutral-950 font-black text-xs flex items-center justify-center shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-white">{item.title}</h5>
                      <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Direct APK Download Quick Action */}
              <div className="pt-2">
                <button
                  onClick={handleDownloadAPK}
                  className="w-full py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black text-xs flex items-center justify-center gap-2 shadow-md transition"
                >
                  <Download size={14} />
                  <span>Démarrer le téléchargement de l'APK (315 Ko)</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-neutral-950/80 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Fichiers Android synchronisés
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
