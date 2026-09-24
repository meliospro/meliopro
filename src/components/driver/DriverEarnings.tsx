import React, { useState } from 'react';
import { useTaxi } from '../../context/TaxiContext';
import { ArrowLeft, TrendingUp, Calendar, DollarSign, Wallet, Download } from 'lucide-react';

interface DriverEarningsProps {
  onBack: () => void;
}

export const DriverEarnings: React.FC<DriverEarningsProps> = ({ onBack }) => {
  const { activeDriver, trips, pricing } = useTaxi();
  const [filter, setFilter] = useState<'day' | 'week' | 'month'>('day');
  const [payoutSent, setPayoutSent] = useState(false);

  // Completed trips where driver was active
  const driverTrips = trips.filter((t) => t.status === 'PAID');

  const earningsData = {
    day: { gross: 25500, trips: 7, hours: '5h 12m' },
    week: { gross: 142000, trips: 38, hours: '31h 45m' },
    month: { gross: 520000, trips: 146, hours: '124h 00m' },
  };

  const current = earningsData[filter];
  const commission = Math.round((current.gross * pricing.commissionPercentage) / 100);
  const netEarnings = current.gross - commission;

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
          Mes Revenus Chauffeur
        </h2>
        <div className="w-8" />
      </div>

      {/* Time Filter Pills */}
      <div className="flex bg-neutral-200/80 p-1 rounded-2xl my-3 gap-1">
        <button
          onClick={() => setFilter('day')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition ${
            filter === 'day' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600'
          }`}
        >
          Aujourd’hui
        </button>
        <button
          onClick={() => setFilter('week')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition ${
            filter === 'week' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600'
          }`}
        >
          Cette Semaine
        </button>
        <button
          onClick={() => setFilter('month')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition ${
            filter === 'month' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600'
          }`}
        >
          Ce Mois
        </button>
      </div>

      {/* Main Net Revenue Card */}
      <div className="bg-neutral-900 text-white rounded-3xl p-5 shadow-lg border border-neutral-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl" />

        <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
          Revenu Net Chauffeur
        </span>
        <div className="text-3xl font-black font-display text-amber-400 mt-1">
          {netEarnings.toLocaleString('fr-FR')}{' '}
          <span className="text-sm font-semibold text-white">FCFA</span>
        </div>

        {/* Breakdown bar */}
        <div className="mt-4 pt-3 border-t border-neutral-800 grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-[10px] text-neutral-400 block">Total brut des courses</span>
            <span className="font-bold text-white">{current.gross.toLocaleString('fr-FR')} FCFA</span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-400 block">Commission SamaTaxi ({pricing.commissionPercentage}%)</span>
            <span className="font-bold text-red-400">-{commission.toLocaleString('fr-FR')} FCFA</span>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 gap-2 my-3">
        <div className="bg-white p-3 rounded-2xl border border-neutral-200">
          <span className="text-[10px] text-neutral-500 font-semibold block">Courses complétées</span>
          <span className="text-lg font-black font-display text-neutral-900">{current.trips}</span>
        </div>
        <div className="bg-white p-3 rounded-2xl border border-neutral-200">
          <span className="text-[10px] text-neutral-500 font-semibold block">Temps en ligne</span>
          <span className="text-lg font-black font-display text-neutral-900">{current.hours}</span>
        </div>
      </div>

      {/* Simple Visual Earnings Chart */}
      <div className="bg-white p-4 rounded-3xl border border-neutral-200 mb-3">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-neutral-900">Activité des derniers jours</span>
          <span className="text-[10px] font-semibold text-emerald-600">+18% vs semaine passée</span>
        </div>

        <div className="h-28 flex items-end justify-between gap-2 pt-4 px-2">
          {[
            { day: 'Lun', val: 18000 },
            { day: 'Mar', val: 24000 },
            { day: 'Mer', val: 21000 },
            { day: 'Jeu', val: 29000 },
            { day: 'Ven', val: 34000 },
            { day: 'Sam', val: 38000 },
            { day: 'Dim', val: 25500 },
          ].map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
              <div
                className={`w-full rounded-t-lg transition-all ${
                  i === 6 ? 'bg-amber-400' : 'bg-neutral-200 hover:bg-neutral-300'
                }`}
                style={{ height: `${(bar.val / 40000) * 100}%` }}
              />
              <span className="text-[9px] font-bold text-neutral-500">{bar.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Wallet Payout Button */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Wallet size={18} className="text-amber-600" />
            <div>
              <div className="text-xs font-bold text-neutral-900">Solde disponible Wave</div>
              <div className="text-[10px] text-neutral-600 font-semibold">
                {activeDriver.walletBalance.toLocaleString('fr-FR')} FCFA
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setPayoutSent(true);
              setTimeout(() => setPayoutSent(false), 4000);
            }}
            disabled={payoutSent || activeDriver.walletBalance <= 0}
            className="px-3 py-1.5 bg-[#F5B800] hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
          >
            {payoutSent ? 'Envoyé ✔️' : 'Retirer'}
          </button>
        </div>
        {payoutSent && (
          <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 p-2 rounded-xl flex items-center gap-1.5">
            <span>✅ Virement Wave de {activeDriver.walletBalance.toLocaleString('fr-FR')} FCFA demandé vers {activeDriver.phone}.</span>
          </div>
        )}
      </div>
    </div>
  );
};
