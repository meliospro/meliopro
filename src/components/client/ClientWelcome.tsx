import React from 'react';
import { SamaLogo } from '../common/SamaLogo';
import { ShieldCheck, Zap, HeartHandshake, ArrowRight } from 'lucide-react';

interface ClientWelcomeProps {
  onStart: () => void;
  onLogin: () => void;
}

export const ClientWelcome: React.FC<ClientWelcomeProps> = ({ onStart, onLogin }) => {
  return (
    <div className="absolute inset-0 bg-white z-40 flex flex-col justify-between p-6 select-none overflow-y-auto no-scrollbar">
      {/* Top Header */}
      <div className="pt-3 flex justify-center">
        <SamaLogo size="md" showSlogan />
      </div>

      {/* Hero Illustration & Dakar Moto Theme */}
      <div className="my-6 flex flex-col items-center text-center">
        <div className="relative w-full max-w-[280px] h-48 bg-gradient-to-b from-amber-50 to-amber-100/60 rounded-3xl p-4 flex flex-col items-center justify-center border border-amber-200/50 shadow-inner overflow-hidden">
          {/* African Sun & Dakar Skyline Silhouette SVG */}
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-amber-300/40 blur-xl" />
          
          {/* Stylized Modern Moto-Taxi Visual */}
          <div className="relative z-10 w-full flex flex-col items-center">
            <div className="w-24 h-24 bg-amber-400 rounded-3xl shadow-lg border-2 border-neutral-900 relative flex items-center justify-center text-5xl">
              🏍️
              <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-neutral-900 text-amber-400 text-[9px] font-extrabold rounded-full uppercase tracking-wider shadow">
                200F / 500m
              </div>
            </div>

            {/* Road */}
            <div className="w-56 h-2 bg-neutral-800 rounded-full mt-4 relative flex items-center justify-center">
              <div className="w-8 h-0.5 bg-amber-400" />
            </div>
          </div>
        </div>

        <h1 className="mt-5 text-2xl font-bold font-display text-neutral-900 leading-tight">
          Bienvenue sur SamaTaxi Moto
        </h1>
        <p className="mt-2 text-xs text-neutral-600 max-w-xs leading-relaxed">
          Déplacez-vous en toute rapidité à Kaolack Ville à <span className="font-bold text-neutral-900">200 FCFA / 500m</span> avec casque de protection fourni et motard vérifié.
        </p>

        {/* Feature Highlights */}
        <div className="mt-5 grid grid-cols-3 gap-2 w-full max-w-xs text-left">
          <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
            <Zap size={16} className="text-amber-500 mb-1" />
            <div className="text-[11px] font-bold text-neutral-800">200F / 500m</div>
            <div className="text-[9px] text-neutral-500">Tarif fixe garanti</div>
          </div>
          <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
            <ShieldCheck size={16} className="text-emerald-500 mb-1" />
            <div className="text-[11px] font-bold text-neutral-800">Permis & Casque</div>
            <div className="text-[9px] text-neutral-500">100% Vérifié</div>
          </div>
          <div className="bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
            <HeartHandshake size={16} className="text-blue-500 mb-1" />
            <div className="text-[11px] font-bold text-neutral-800">Wave & OM</div>
            <div className="text-[9px] text-neutral-500">0% de frais</div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2.5 pb-2">
        <button
          onClick={onStart}
          className="w-full h-13 bg-[#F5B800] hover:bg-amber-400 text-neutral-950 font-bold text-sm rounded-2xl shadow-md transition active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <span>COMMENCER</span>
          <ArrowRight size={16} />
        </button>

        <button
          onClick={onLogin}
          className="w-full h-12 bg-white hover:bg-neutral-50 text-neutral-800 font-semibold text-xs rounded-2xl border border-neutral-200 transition active:scale-[0.98]"
        >
          J’ai déjà un compte
        </button>
      </div>
    </div>
  );
};
