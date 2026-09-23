import React, { useState } from 'react';
import { useTaxi } from '../../context/TaxiContext';
import { VEHICLE_CATEGORIES, KAOLACK_LOCATIONS } from '../../data/mockData';
import { LocationPoint, VehicleCategory } from '../../types';
import {
  Calculator,
  MapPin,
  TrendingDown,
  Navigation,
  Info,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Car,
  Clock,
  CheckCircle2,
  Tag,
  ArrowRight,
  Sliders,
} from 'lucide-react';

interface EstimateurTarifProps {
  onOpenSearch?: () => void;
  className?: string;
  compact?: boolean;
}

export const EstimateurTarif: React.FC<EstimateurTarifProps> = ({
  onOpenSearch,
  className = '',
  compact = false,
}) => {
  const {
    clientLocation,
    destination,
    setDestination,
    selectedCategory,
    setSelectedCategory,
    appliedPromo,
    pricing,
  } = useTaxi();

  const [showFormulaDetails, setShowFormulaDetails] = useState(false);
  const [trafficCondition, setTrafficCondition] = useState<'fluid' | 'moderate' | 'dense'>('fluid');

  // Distance calculation helper (geodesic distance in km within Kaolack Ville)
  const calculateDistance = (p1: LocationPoint, p2: LocationPoint) => {
    const latDiff = (p1.lat - p2.lat) * 111;
    const lngDiff = (p1.lng - p2.lng) * 111 * Math.cos((p1.lat * Math.PI) / 180);
    const dist = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
    return Math.max(parseFloat(dist.toFixed(1)), 0.5);
  };

  // Distance in km
  const distanceKm = destination ? calculateDistance(clientLocation, destination) : 2.1;

  // Duration with traffic multiplier
  const trafficMultiplier = trafficCondition === 'fluid' ? 1.0 : trafficCondition === 'moderate' ? 1.25 : 1.5;
  const durationMin = Math.round((distanceKm * 1.8 + 3) * trafficMultiplier);

  // Price calculation function for any category: strictly 200 FCFA every 500m
  const calculatePrice = (cat: VehicleCategory) => {
    const distanceMeters = distanceKm * 1000;
    const tranches500m = Math.max(1, Math.ceil(distanceMeters / 500));
    const baseFare = tranches500m * 200; // 200 FCFA chaque 500m

    let raw = baseFare;

    // Apply promo if active
    let discount = 0;
    if (appliedPromo) {
      discount = Math.min((raw * appliedPromo.discountPercentage) / 100, appliedPromo.maxDiscountFCFA);
      raw = Math.max(raw - discount, 200);
    }

    const roundedPrice = Math.round(raw);
    const lowRange = roundedPrice;
    const highRange = roundedPrice;

    return {
      price: roundedPrice,
      lowRange,
      highRange,
      baseFare,
      tranches500m,
      discount: Math.round(discount),
    };
  };

  const currentCalc = calculatePrice(selectedCategory);

  return (
    <div
      id="estimateur-tarif-card"
      className={`bg-white rounded-3xl border border-neutral-200/90 shadow-sm overflow-hidden select-none transition-all ${className}`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-400/15 via-amber-500/10 to-transparent p-3.5 border-b border-neutral-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#F5B800] text-neutral-950 flex items-center justify-center shadow-2xs flex-shrink-0">
            <Calculator size={16} />
          </div>
          <div>
            <h3 className="text-xs font-black text-neutral-900 font-display flex items-center gap-1.5">
              <span>Estimateur de Tarif</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 bg-neutral-900 text-amber-400 rounded-md">
                Kaolack GPS
              </span>
            </h3>
            <p className="text-[10px] text-neutral-500 font-medium">
              200 FCFA / 500m dans Kaolack Ville
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowFormulaDetails(!showFormulaDetails)}
          className="text-[10px] font-bold text-amber-700 bg-amber-100/70 hover:bg-amber-200/70 px-2.5 py-1 rounded-xl transition flex items-center gap-1"
        >
          <Info size={11} />
          <span>{showFormulaDetails ? 'Masquer détail' : 'Détail du prix'}</span>
          {showFormulaDetails ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>

      <div className="p-3.5 space-y-3">
        {/* Destination Status Banner */}
        {destination ? (
          <div className="bg-neutral-50 p-3 rounded-2xl border border-neutral-200/80 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
              <div className="min-w-0">
                <span className="text-[9px] uppercase font-bold text-neutral-400 tracking-wider block">
                  Trajet estimé (Kaolack)
                </span>
                <span className="text-xs font-bold text-neutral-900 truncate block">
                  {destination.name}
                </span>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <span className="text-xs font-extrabold text-neutral-900 block">
                {distanceKm} km
              </span>
              <span className="text-[10px] text-neutral-500">~{durationMin} min</span>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50/80 border border-amber-200/80 p-3 rounded-2xl flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-amber-600 flex-shrink-0" />
              <span className="text-xs font-bold text-amber-950">
                Touchez la carte de Kaolack ou choisissez un lieu
              </span>
            </div>
            <p className="text-[10px] text-amber-800 leading-snug">
              Sélectionnez un point dans Kaolack Ville pour calculer le tarif officiel instantanément.
            </p>

            {/* Quick destination simulator chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
              {KAOLACK_LOCATIONS.slice(0, 4).map((loc: LocationPoint) => (
                <button
                  key={loc.id}
                  onClick={() => setDestination(loc)}
                  className="px-2.5 py-1 bg-white hover:bg-amber-100 text-neutral-800 rounded-xl text-[10px] font-bold border border-amber-200/80 whitespace-nowrap shadow-2xs transition active:scale-95"
                >
                  📍 {loc.name.split(' — ')[0]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Big Estimated Price Display */}
        <div className="bg-neutral-900 text-white rounded-2xl p-3.5 relative overflow-hidden shadow-xs">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
                Tarif approximatif ({selectedCategory.name})
              </span>
              <div className="text-2xl font-black font-display text-amber-400 mt-0.5 flex items-baseline gap-1.5">
                <span>{currentCalc.price.toLocaleString('fr-FR')}</span>
                <span className="text-xs font-semibold text-white">FCFA</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[9px] text-neutral-400 block font-medium">Fourchette estimée</span>
              <span className="text-xs font-bold text-neutral-200">
                {currentCalc.lowRange.toLocaleString('fr-FR')} - {currentCalc.highRange.toLocaleString('fr-FR')} F
              </span>
            </div>
          </div>

          {/* Traffic condition selector & Promo notice */}
          <div className="mt-3 pt-2.5 border-t border-neutral-800 flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-1 text-neutral-300">
              <span className="text-neutral-400">Trafic :</span>
              <button
                onClick={() => setTrafficCondition(trafficCondition === 'fluid' ? 'moderate' : trafficCondition === 'moderate' ? 'dense' : 'fluid')}
                className={`px-2 py-0.5 rounded-md font-bold transition ${
                  trafficCondition === 'fluid'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : trafficCondition === 'moderate'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-red-500/20 text-red-400 border border-red-500/40'
                }`}
              >
                {trafficCondition === 'fluid' ? '🟢 Fluide' : trafficCondition === 'moderate' ? '🟡 Modéré' : '🔴 Dense'}
              </button>
            </div>

            {appliedPromo ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Tag size={11} />
                <span>Code {appliedPromo.code} (-{appliedPromo.discountPercentage}%)</span>
              </span>
            ) : (
              <span className="text-neutral-500">Estimation sans majoration</span>
            )}
          </div>
        </div>

        {/* Category Price Comparative Pills */}
        <div className="grid grid-cols-2 gap-1.5">
          {VEHICLE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory.id === cat.id;
            const catPrice = calculatePrice(cat).price;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className={`p-2 rounded-xl border text-left transition flex items-center justify-between ${
                  isSelected
                    ? 'border-amber-400 bg-amber-50/70 ring-1 ring-amber-400 text-neutral-900 shadow-2xs'
                    : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700'
                }`}
              >
                <div className="min-w-0 pr-1">
                  <span className="text-[11px] font-bold block truncate">{cat.name}</span>
                  <span className="text-[9px] text-neutral-400 block">{cat.etaMinutes} min • {cat.capacity} places</span>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-[11px] font-black font-display text-neutral-900 block">
                    {catPrice.toLocaleString('fr-FR')} F
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Expandable Breakdown of Formula Calculation */}
        {showFormulaDetails && (
          <div className="bg-neutral-50 p-3 rounded-2xl border border-neutral-200 text-xs space-y-2 animate-in fade-in-50 duration-200">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
              Règle officielle Moto : 200 FCFA chaque 500 mètres
            </span>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between text-neutral-600">
                <span>Distance estimée :</span>
                <span className="font-bold text-neutral-800">
                  {distanceKm} km ({Math.round(distanceKm * 1000)} mètres)
                </span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Nombre de tranches de 500m :</span>
                <span className="font-bold text-amber-700 bg-amber-100/60 px-1.5 py-0.5 rounded-md">
                  {currentCalc.tranches500m} tranche{currentCalc.tranches500m > 1 ? 's' : ''} de 500m
                </span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Calcul ({currentCalc.tranches500m} × 200 FCFA) :</span>
                <span className="font-bold text-neutral-800">
                  {currentCalc.baseFare.toLocaleString('fr-FR')} FCFA
                </span>
              </div>

              {currentCalc.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold pt-1 border-t border-neutral-200">
                  <span>Réduction promotionnelle :</span>
                  <span>-{currentCalc.discount.toLocaleString('fr-FR')} FCFA</span>
                </div>
              )}

              <div className="flex justify-between text-neutral-900 font-black text-xs pt-1.5 border-t border-neutral-300">
                <span>Total estimé course moto :</span>
                <span className="text-amber-600 font-display">
                  {currentCalc.price.toLocaleString('fr-FR')} FCFA
                </span>
              </div>
            </div>

            <p className="text-[9px] text-neutral-500 italic pt-1">
              * Casque de sécurité obligatoire fourni gratuitement par le motard.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
