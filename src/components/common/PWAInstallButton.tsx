import React, { useState } from 'react';
import { usePWAInstall } from './usePWAInstall';
import { Download, Smartphone, CheckCircle2, Play, X } from 'lucide-react';
import { ApkDownloadModal } from './ApkDownloadModal';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'compact' | 'full' | 'pill';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  className = '',
  variant = 'pill',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showApkModal, setShowApkModal] = useState(false);

  // If already running standalone, display a subtle verified badge
  if (isInstalled) {
    return (
      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold ${className}`}>
        <CheckCircle2 size={12} />
        <span>Application installée</span>
      </div>
    );
  }

  return (
    <>
      {/* If browser supports direct install prompt */}
      {isInstallable ? (
        <button
          onClick={install}
          className={`flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-neutral-950 font-bold px-3 py-1.5 rounded-full text-xs shadow-sm hover:shadow transition active:scale-95 ${className}`}
        >
          <Download size={14} />
          <span>Installer l’application APK</span>
        </button>
      ) : isIOS ? (
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 bg-neutral-900 text-white font-bold px-3 py-1.5 rounded-full text-xs hover:bg-neutral-800 transition active:scale-95 ${className}`}
        >
          <Smartphone size={14} />
          <span>Ajouter à l’écran d’accueil</span>
        </button>
      ) : (
        <button
          onClick={() => setShowApkModal(true)}
          className={`flex items-center gap-1.5 bg-neutral-900/90 backdrop-blur-xs text-amber-400 font-bold px-3 py-1.5 rounded-full text-[11px] hover:bg-neutral-900 border border-neutral-700 transition active:scale-95 ${className}`}
        >
          <Play size={12} fill="currentColor" />
          <span>Fichier APK / Play Store</span>
        </button>
      )}

      {/* APK & Play Store Modal */}
      <ApkDownloadModal isOpen={showApkModal} onClose={() => setShowApkModal(false)} />

      {/* Modal Guide iOS */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-xs rounded-3xl bg-white p-5 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                <span>📱</span>
                <span>Installer sur iPhone / iPad</span>
              </h3>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100"
              >
                <X size={16} />
              </button>
            </div>
            <p className="mt-3 text-xs text-neutral-600 leading-relaxed">
              Pour utiliser SamaTaxi comme une application native sans barre de navigation :
            </p>
            <ol className="mt-2.5 space-y-2 text-xs text-neutral-700 bg-neutral-50 p-3 rounded-2xl border border-neutral-200">
              <li className="flex items-start gap-2">
                <span className="font-bold text-amber-600">1.</span>
                <span>Appuyez sur le bouton <strong>Partager</strong> en bas de Safari (icône carré avec flèche).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-amber-600">2.</span>
                <span>Faites défiler vers le bas et touchez <strong>Sur l’écran d’accueil</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-amber-600">3.</span>
                <span>Cliquez sur <strong>Ajouter</strong> en haut à droite.</span>
              </li>
            </ol>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-4 w-full rounded-xl bg-neutral-900 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition"
            >
              C'est compris !
            </button>
          </div>
        </div>
      )}
    </>
  );
};
