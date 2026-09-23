import React, { useState } from 'react';
import { useTaxi } from '../../context/TaxiContext';
import { Tag, Sparkles, Check, ArrowLeft, Percent, Gift } from 'lucide-react';

interface ClientPromosProps {
  onBack: () => void;
}

export const ClientPromos: React.FC<ClientPromosProps> = ({ onBack }) => {
  const { promos, appliedPromo, applyPromo, removePromo } = useTaxi();
  const [inputCode, setInputCode] = useState('');
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const handleApply = (codeToApply: string) => {
    const res = applyPromo(codeToApply);
    if (res.success) {
      setMessage({ text: res.message, error: false });
      setInputCode('');
    } else {
      setMessage({ text: res.message, error: true });
    }
  };

  return (
    <div className="flex-1 bg-neutral-50 flex flex-col p-4 select-none overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
        <button
          onClick={onBack}
          className="p-1.5 -ml-1 text-neutral-600 hover:text-neutral-900 rounded-full hover:bg-neutral-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-base font-bold font-display text-neutral-900">
          Codes Promotions & Réductions
        </h2>
        <div className="w-8" />
      </div>

      {/* Code Promo Input */}
      <div className="my-4 bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
        <label className="text-[11px] font-bold text-neutral-700 block mb-1.5">
          Ajouter un code promotionnel
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag size={16} className="absolute left-3 top-3 text-neutral-400" />
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="ex: SAMATAXI20"
              className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold uppercase focus:outline-none focus:border-amber-400 focus:bg-white"
            />
          </div>
          <button
            onClick={() => handleApply(inputCode)}
            className="px-4 py-2 bg-[#F5B800] hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl transition"
          >
            APPLIQUER
          </button>
        </div>

        {message && (
          <p className={`text-xs mt-2 font-medium ${message.error ? 'text-red-500' : 'text-emerald-600'}`}>
            {message.text}
          </p>
        )}
      </div>

      {/* Active Applied Promo Banner */}
      {appliedPromo && (
        <div className="mb-4 bg-emerald-500 text-white p-3.5 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Check size={18} />
            </div>
            <div>
              <span className="text-xs font-black block">Code actif : {appliedPromo.code}</span>
              <span className="text-[10px] text-emerald-100">{appliedPromo.description}</span>
            </div>
          </div>
          <button
            onClick={removePromo}
            className="text-[11px] font-bold bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-lg transition"
          >
            Retirer
          </button>
        </div>
      )}

      {/* Available promos list */}
      <div className="space-y-3">
        <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider flex items-center gap-1">
          <Sparkles size={12} className="text-amber-500" />
          <span>Offres disponibles au Sénégal</span>
        </div>

        {promos.map((promo) => {
          const isCurrent = appliedPromo?.id === promo.id;
          return (
            <div
              key={promo.id}
              className={`p-4 rounded-2xl border transition bg-white ${
                isCurrent ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-neutral-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                    %{promo.discountPercentage}
                  </div>
                  <div>
                    <h3 className="text-xs font-extrabold text-neutral-900 tracking-wide font-mono">
                      {promo.code}
                    </h3>
                    <p className="text-[11px] text-neutral-600 mt-0.5">{promo.description}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleApply(promo.code)}
                  disabled={isCurrent}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    isCurrent
                      ? 'bg-neutral-100 text-neutral-400 cursor-default'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                  }`}
                >
                  {isCurrent ? 'Actif' : 'UTILISER'}
                </button>
              </div>

              <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between text-[10px] text-neutral-400">
                <span>Remise max : {promo.maxDiscountFCFA.toLocaleString('fr-FR')} FCFA</span>
                <span>Expire le {promo.expiryDate}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
