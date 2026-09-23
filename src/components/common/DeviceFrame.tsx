import React, { useState } from 'react';
import { useTaxi } from '../../context/TaxiContext';
import { Wifi, BatteryMedium, Signal, Smartphone, Monitor, Car, User, ShieldCheck, X, Download } from 'lucide-react';
import { ApkDownloadModal } from './ApkDownloadModal';
import { GitHubExportModal } from './GitHubExportModal';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const { role, setRole, isAndroidFrame, setIsAndroidFrame, notifications, clearNotification } = useTaxi();
  const [showApkModal, setShowApkModal] = useState(false);
  const [showGitHubModal, setShowGitHubModal] = useState(false);
  const unreadNotif = notifications.find((n) => !n.read);

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-start text-neutral-100 selection:bg-amber-400 selection:text-neutral-900">
      {/* Top Demo Bar & Role Switcher */}
      <header className="w-full bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800 px-4 py-3 sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3 shadow-lg">
        {/* Brand preview info */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-neutral-900 overflow-hidden border border-neutral-700 flex items-center justify-center shadow-md">
            <img src="/logo.png" alt="SamaTaxi" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-white flex items-center gap-1.5 leading-none">
              <span>SamaTaxi Sénégal</span>
              <span className="text-[10px] bg-amber-400/20 text-amber-400 px-2 py-0.5 rounded-full font-semibold border border-amber-400/30">
                Officiel
              </span>
            </h1>
            <p className="text-[11px] text-neutral-400 mt-0.5 italic">
              « Votre trajet, notre priorité »
            </p>
          </div>
        </div>

        {/* Roles Segmented Control */}
        <div className="flex items-center bg-neutral-800 p-1 rounded-xl border border-neutral-700/60 shadow-inner">
          <button
            onClick={() => setRole('client')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              role === 'client'
                ? 'bg-amber-400 text-neutral-950 shadow-md scale-[1.02]'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-700/50'
            }`}
          >
            <User size={14} />
            <span>Passager (Client)</span>
          </button>

          <button
            onClick={() => setRole('driver')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              role === 'driver'
                ? 'bg-amber-400 text-neutral-950 shadow-md scale-[1.02]'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-700/50'
            }`}
          >
            <Car size={14} />
            <span>Chauffeur (Conducteur)</span>
          </button>

          <button
            onClick={() => setRole('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              role === 'admin'
                ? 'bg-amber-400 text-neutral-950 shadow-md scale-[1.02]'
                : 'text-neutral-300 hover:text-white hover:bg-neutral-700/50'
            }`}
          >
            <ShieldCheck size={14} />
            <span>Admin Web</span>
          </button>
        </div>

        {/* Actions Bar: Télécharger APK, GitHub & Viewport Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGitHubModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white text-xs font-bold border border-neutral-700 transition active:scale-95"
            title="Publier sur votre compte GitHub"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
            <span>GitHub</span>
          </button>

          <button
            onClick={() => setShowApkModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-neutral-950 text-xs font-bold shadow-md hover:shadow-amber-500/20 transition active:scale-95"
            title="Télécharger ou installer l'application en APK"
          >
            <Download size={14} />
            <span>Fichier APK / Installer</span>
          </button>

          {role !== 'admin' && (
            <button
              onClick={() => setIsAndroidFrame(!isAndroidFrame)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-medium border border-neutral-700 transition"
              title="Changer le mode d'affichage"
            >
              {isAndroidFrame ? <Monitor size={14} /> : <Smartphone size={14} />}
              <span className="hidden sm:inline">
                {isAndroidFrame ? 'Plein Écran' : 'Format Android'}
              </span>
            </button>
          )}
        </div>
      </header>

      {/* APK Modal */}
      <ApkDownloadModal isOpen={showApkModal} onClose={() => setShowApkModal(false)} />

      {/* GitHub Export Modal */}
      <GitHubExportModal isOpen={showGitHubModal} onClose={() => setShowGitHubModal(false)} />

      {/* Main Container */}
      <main className="w-full flex-1 flex flex-col items-center justify-center p-0 md:p-6 lg:p-8">
        {isAndroidFrame && role !== 'admin' ? (
          // Realistic Android Phone Frame Mockup
          <div className="relative w-full max-w-[412px] h-[870px] max-h-[92vh] bg-black rounded-[46px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_0_12px_#262626,0_0_0_14px_#404040] overflow-hidden flex flex-col border-[3px] border-neutral-700 select-none">
            {/* Camera Punchhole */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-40 border border-neutral-800 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
            </div>

            {/* Android Status Bar */}
            <div className="w-full h-9 bg-white text-neutral-900 px-7 flex items-center justify-between text-[12px] font-semibold tracking-tight z-30 select-none flex-shrink-0 border-b border-neutral-100">
              <span>12:45</span>
              <div className="flex items-center gap-1.5 text-neutral-700">
                <Signal size={12} />
                <span className="text-[10px] font-bold">4G+</span>
                <Wifi size={12} />
                <BatteryMedium size={14} />
              </div>
            </div>

            {/* In-app push notification banner popup */}
            {unreadNotif && (
              <div className="absolute top-10 left-3 right-3 z-50 bg-neutral-900/95 text-white p-3 rounded-2xl shadow-2xl border border-amber-400/40 backdrop-blur-md animate-in slide-in-from-top duration-300 flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span>{unreadNotif.title}</span>
                  </div>
                  <p className="text-[11px] text-neutral-200 mt-0.5 leading-snug">
                    {unreadNotif.message}
                  </p>
                </div>
                <button
                  onClick={() => clearNotification(unreadNotif.id)}
                  className="text-neutral-400 hover:text-white p-1"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* App Screen Content */}
            <div className="flex-1 relative overflow-hidden bg-neutral-50 flex flex-col text-neutral-900">
              {children}
            </div>

            {/* Android Gesture Bar */}
            <div className="w-full h-4 bg-white flex items-center justify-center flex-shrink-0 border-t border-neutral-100">
              <div className="w-32 h-1 bg-neutral-400 rounded-full" />
            </div>
          </div>
        ) : (
          // Full Screen View (Admin or toggled mobile)
          <div className="w-full max-w-7xl flex-1 bg-white text-neutral-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col min-h-[780px]">
            {children}
          </div>
        )}
      </main>
    </div>
  );
};
