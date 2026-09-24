import React, { useState } from 'react';
import { X, Download, Smartphone, CheckCircle, ExternalLink, Copy, Check, Terminal, Sparkles } from 'lucide-react';
import { usePWAInstall } from './usePWAInstall';

interface ApkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkDownloadModal: React.FC<ApkDownloadModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  if (!isOpen) return null;

  const appPublicUrl = window.location.origin;
  const pwabuilderUrl = `https://www.pwabuilder.com/?url=${encodeURIComponent(appPublicUrl)}`;
  const bubblewrapCmd = `npx @bubblewrap/cli init --manifest ${appPublicUrl}/manifest.json && npx @bubblewrap/cli build`;

  const handleCopyUrl = () => {
    navigator.clipboard?.writeText(appPublicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCmd = () => {
    navigator.clipboard?.writeText(bubblewrapCmd);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleDirectInstall = async () => {
    if (isInstallable) {
      await install();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-700 rounded-3xl p-6 text-white shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-700 overflow-hidden flex items-center justify-center shadow-lg shadow-amber-500/20">
              <img src="/logo.png" alt="SamaTaxi" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Télécharger SamaTaxi en APK</h2>
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                  Android
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5 italic">
                « Votre trajet, notre priorité »
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Options Container */}
        <div className="mt-5 space-y-4">
          {/* Method 0 : Téléchargement Direct du Fichier .APK */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950 via-neutral-900 to-neutral-900 border-2 border-emerald-500/50 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-400 text-neutral-950 font-black text-xs">
                  ★
                </span>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Smartphone size={16} className="text-emerald-400" />
                  <span>Fichier Android APK (.apk)</span>
                </h3>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-bold">
                Direct
              </span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed mb-3">
              Téléchargez directement le fichier d'installation <strong>SamaTaxi-Kaolack.apk</strong> sur votre smartphone Android.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a
                href="/api/download/apk"
                download="SamaTaxi-Kaolack.apk"
                className="py-2.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md"
              >
                <Download size={15} />
                <span>Télécharger l'APK (.apk)</span>
              </a>
              <a
                href="/api/download/android-project"
                download="SamaTaxi-Kaolack-Android-Studio.zip"
                className="py-2.5 px-3 bg-neutral-800 hover:bg-neutral-700 text-emerald-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-emerald-500/30 transition"
              >
                <Download size={14} />
                <span>Projet Android Studio (.zip)</span>
              </a>
            </div>
          </div>

          {/* Method 1 : Installation directe Android (WebAPK) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-400 text-neutral-950 font-black text-xs">
                  1
                </span>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Smartphone size={16} className="text-amber-400" />
                  <span>Installation Directe sur Android (Recommandé)</span>
                </h3>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-semibold">
                Sans téléchargement lourd
              </span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed mb-3">
              Android génère et installe automatiquement un <strong>WebAPK officiel</strong> avec icône sur l'écran d'accueil, notification push et fonctionnement hors-ligne.
            </p>
            {isInstallable ? (
              <button
                onClick={handleDirectInstall}
                className="w-full py-2.5 bg-[#F5B800] hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md"
              >
                <Download size={15} />
                <span>Installer maintenant sur cet appareil</span>
              </button>
            ) : (
              <div className="bg-neutral-950/70 p-2.5 rounded-xl border border-neutral-800 text-[11px] text-neutral-400 flex items-center gap-2">
                <CheckCircle size={14} className="text-emerald-400 shrink-0" />
                <span>Ouvrez ce lien dans <strong>Google Chrome sur votre téléphone Android</strong> et appuyez sur « Installer l'application » ou le menu ⋮ &gt; « Ajouter à l'écran d'accueil ».</span>
              </div>
            )}
          </div>

          {/* Method 2 : Télécharger le package APK / AAB via PWABuilder */}
          <div className="p-4 rounded-2xl bg-neutral-800/80 border border-neutral-700">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-neutral-700 text-white font-black text-xs">
                  2
                </span>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Download size={16} className="text-amber-400" />
                  <span>Générer le fichier .APK / .AAB (Google Play)</span>
                </h3>
              </div>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-md font-semibold">
                Fichier autonome
              </span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed mb-3">
              Utilisez l'outil certifié <strong>PWABuilder (Google & Microsoft)</strong> pour compiler instantanément le fichier <code>.apk</code> et <code>.aab</code> prêt à installer ou publier.
            </p>

            <div className="flex items-center gap-2 mb-3 bg-neutral-950 p-2 rounded-xl border border-neutral-800">
              <span className="text-[11px] text-neutral-400 truncate flex-1 font-mono">
                {appPublicUrl}
              </span>
              <button
                onClick={handleCopyUrl}
                className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-lg flex items-center gap-1 font-medium transition"
              >
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copied ? 'Copié' : 'Copier l\'URL'}</span>
              </button>
            </div>

            <a
              href={pwabuilderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-neutral-100 hover:bg-white text-neutral-900 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
            >
              <span>Ouvrir PWABuilder & Télécharger l'APK</span>
              <ExternalLink size={13} />
            </a>
          </div>

          {/* Method 3 : Mettre en ligne sur mon compte Google (Google Play Store) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-900/20 to-neutral-850 border border-blue-500/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white font-black text-xs">
                  3
                </span>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.36 7.35 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Publier sur Google Play (Compte Google)</span>
                </h3>
              </div>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-md font-semibold">
                Play Store
              </span>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed mb-3">
              Pour publier <strong>SamaTaxi</strong> sur le Google Play Store associé à votre compte Google (<strong>boogi575@gmail.com</strong>) :
            </p>

            <ol className="text-[11px] text-neutral-300 space-y-1.5 mb-3 bg-neutral-950/70 p-3 rounded-xl border border-neutral-800">
              <li className="flex items-start gap-1.5">
                <span className="font-bold text-amber-400">1.</span>
                <span>Téléchargez le package <strong>.aab (Android App Bundle)</strong> via le bouton PWABuilder ci-dessus.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold text-amber-400">2.</span>
                <span>Connectez-vous sur la <strong>Google Play Console</strong> avec votre compte Google.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="font-bold text-amber-400">3.</span>
                <span>Créez l'application <strong>« SamaTaxi »</strong> et déposez le fichier <code>.aab</code> pour validation par Google.</span>
              </li>
            </ol>

            <div className="grid grid-cols-2 gap-2">
              <a
                href="https://play.google.com/console"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition text-center"
              >
                <span>Google Play Console</span>
                <ExternalLink size={12} />
              </a>

              <a
                href="https://console.firebase.google.com/project/chromatic-chess-f53bd"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition text-center border border-neutral-700"
              >
                <span>Console Firebase Google</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Method 4 : Compiler l'APK avec Bubblewrap CLI */}
          <div className="p-4 rounded-2xl bg-neutral-800/50 border border-neutral-800">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-neutral-700 text-white font-black text-xs">
                4
              </span>
              <h3 className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
                <Terminal size={14} className="text-amber-400" />
                <span>Compiler l'APK en local (Développeurs)</span>
              </h3>
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed mb-2">
              Avec l'outil officiel Google <strong>Bubblewrap</strong> pour générer l'APK signé :
            </p>
            <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 flex items-center justify-between gap-2">
              <code className="text-[10px] text-amber-300 font-mono overflow-x-auto whitespace-nowrap">
                {bubblewrapCmd}
              </code>
              <button
                onClick={handleCopyCmd}
                className="p-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-300 transition shrink-0"
                title="Copier la commande"
              >
                {copiedCmd ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-1.5 text-neutral-300">
            <Sparkles size={13} className="text-amber-400" />
            <span>Casque fourni • 200 FCFA/500m</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
