import React, { useEffect } from 'react';
import { SamaLogo } from '../common/SamaLogo';

interface ClientSplashProps {
  onComplete: () => void;
}

export const ClientSplash: React.FC<ClientSplashProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      onClick={onComplete}
      className="absolute inset-0 bg-[#F5B800] z-50 flex flex-col items-center justify-between p-8 text-neutral-900 cursor-pointer select-none animate-in fade-in duration-300"
    >
      <div className="w-full flex justify-end">
        <span className="text-[11px] font-semibold text-neutral-800 bg-amber-400/80 px-2.5 py-1 rounded-full">
          Passer ›
        </span>
      </div>

      <div className="flex flex-col items-center text-center scale-105">
        <div className="w-32 h-32 rounded-3xl bg-neutral-900 shadow-2xl p-2 border-2 border-neutral-950 flex items-center justify-center overflow-hidden mb-4 animate-in zoom-in-95">
          <img
            src="/logo.png"
            alt="SamaTaxi"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
        <h2 className="text-2xl font-black font-display text-neutral-950 tracking-tight">
          SAMATAXI
        </h2>
        <p className="mt-1 text-sm font-semibold italic text-neutral-900">
          « Votre trajet, notre priorité »
        </p>
        <p className="mt-2 text-xs text-neutral-800 font-medium">
          Kaolack Ville • Transport Rapide • Casque & Permis Vérifié
        </p>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 rounded-full border-3 border-neutral-900 border-t-transparent animate-spin" />
        <span className="text-[11px] font-semibold tracking-wider text-neutral-800 uppercase">
          Chargement de la carte...
        </span>
      </div>
    </div>
  );
};
