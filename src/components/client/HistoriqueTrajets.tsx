import React, { useState } from 'react';
import { useTaxi } from '../../context/TaxiContext';
import { Trip, LocationPoint } from '../../types';
import {
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ChevronRight,
  Receipt,
  Car,
  CreditCard,
  Banknote,
  Star,
  Calendar,
  X,
} from 'lucide-react';

interface HistoriqueTrajetsProps {
  maxItems?: number;
  onSelectDestination?: (destination: LocationPoint) => void;
  onViewAll?: () => void;
  showHeader?: boolean;
  className?: string;
}

export const HistoriqueTrajets: React.FC<HistoriqueTrajetsProps> = ({
  maxItems = 3,
  onSelectDestination,
  onViewAll,
  showHeader = true,
  className = '',
}) => {
  const { trips, setDestination } = useTaxi();
  const [selectedTripDetails, setSelectedTripDetails] = useState<Trip | null>(null);

  const displayedTrips = maxItems ? trips.slice(0, maxItems) : trips;

  const handleRepeatTrip = (trip: Trip, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelectDestination) {
      onSelectDestination(trip.destination);
    } else {
      setDestination(trip.destination);
    }
  };

  const getStatusBadge = (status: Trip['status']) => {
    switch (status) {
      case 'PAID':
      case 'TRIP_COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={11} />
            <span>Payé / Terminé</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
            <AlertCircle size={11} />
            <span>Annulé</span>
          </span>
        );
      case 'TRIP_STARTED':
      case 'DRIVER_ARRIVING':
      case 'DRIVER_ASSIGNED':
      case 'DRIVER_ARRIVED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
            <Clock size={11} />
            <span>En cours</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-600 border border-neutral-200">
            <span>{status}</span>
          </span>
        );
    }
  };

  const getPaymentLabel = (method: Trip['paymentMethod']) => {
    switch (method) {
      case 'WAVE':
        return { label: 'Wave', color: 'text-blue-600 bg-blue-50 border-blue-200' };
      case 'ORANGE_MONEY':
        return { label: 'Orange Money', color: 'text-orange-600 bg-orange-50 border-orange-200' };
      case 'CASH':
        return { label: 'Espèces', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
      default:
        return { label: 'Carte', color: 'text-neutral-700 bg-neutral-100 border-neutral-200' };
    }
  };

  if (!displayedTrips || displayedTrips.length === 0) {
    return (
      <div className={`bg-neutral-50 rounded-2xl p-4 border border-neutral-200 text-center ${className}`}>
        <Clock size={24} className="mx-auto text-neutral-400 mb-1.5" />
        <p className="text-xs font-bold text-neutral-700">Aucun trajet récent</p>
        <p className="text-[10px] text-neutral-400 mt-0.5">
          Vos trajets effectués s’afficheront ici avec date, prix et statut.
        </p>
      </div>
    );
  }

  return (
    <div id="historique-trajets-container" className={`flex flex-col gap-2.5 ${className}`}>
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-amber-500" />
            <span className="text-xs font-bold text-neutral-900 font-display">
              Derniers trajets effectués
            </span>
          </div>

          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-[11px] font-bold text-amber-600 hover:text-amber-700 hover:underline flex items-center gap-0.5"
            >
              <span>Voir tout ({trips.length})</span>
              <ChevronRight size={12} />
            </button>
          )}
        </div>
      )}

      {/* Trips list */}
      <div className="space-y-2">
        {displayedTrips.map((trip) => {
          const payment = getPaymentLabel(trip.paymentMethod);
          return (
            <div
              key={trip.id}
              onClick={() => setSelectedTripDetails(trip)}
              className="p-3 bg-white hover:bg-neutral-50 rounded-2xl border border-neutral-200/90 shadow-2xs transition cursor-pointer flex flex-col gap-2 group"
            >
              {/* Row 1: Status & Date & Price */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {getStatusBadge(trip.status)}
                  <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                    <Calendar size={10} />
                    <span>{trip.requestedAt}</span>
                  </span>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-black font-display text-neutral-900 tracking-tight">
                    {trip.finalPrice.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              </div>

              {/* Row 2: Route (Pickup -> Destination) */}
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                  <span className="text-neutral-500 truncate text-[11px]">
                    <strong className="text-neutral-700 font-semibold">Départ :</strong> {trip.pickup.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-neutral-900 flex-shrink-0" />
                  <span className="text-neutral-900 font-bold truncate text-[11px]">
                    <strong className="text-neutral-900 font-bold">Arrivée :</strong> {trip.destination.name}
                  </span>
                </div>
              </div>

              {/* Row 3: Meta tags & Repeat Action */}
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-1.5 py-0.5 bg-neutral-100 text-neutral-600 rounded-md font-semibold">
                    {trip.category.name}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded-md font-bold border ${payment.color}`}>
                    {payment.label}
                  </span>
                  {trip.rating && (
                    <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                      <Star size={10} className="fill-amber-400 text-amber-400" />
                      <span>{trip.rating}.0</span>
                    </span>
                  )}
                </div>

                <button
                  onClick={(e) => handleRepeatTrip(trip, e)}
                  title="Reprendre ce trajet"
                  className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold rounded-xl border border-amber-200 transition active:scale-95 group-hover:border-amber-300"
                >
                  <RotateCcw size={11} className="text-amber-700" />
                  <span>Reprendre</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trip Details Modal */}
      {selectedTripDetails && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Receipt size={18} className="text-amber-500" />
                <h3 className="font-bold text-sm text-neutral-900 font-display">
                  Détails du trajet {selectedTripDetails.id}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTripDetails(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-3 space-y-3 text-xs">
              <div className="flex items-center justify-between bg-neutral-50 p-3 rounded-2xl border border-neutral-100">
                <div>
                  <span className="text-[10px] text-neutral-400 block font-semibold">Montant payé</span>
                  <span className="text-base font-black font-display text-neutral-900">
                    {selectedTripDetails.finalPrice.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-400 block font-semibold">Statut</span>
                  {getStatusBadge(selectedTripDetails.status)}
                </div>
              </div>

              <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-1 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-neutral-400 block font-bold uppercase">Point de départ</span>
                    <span className="font-bold text-neutral-900">{selectedTripDetails.pickup.name}</span>
                    <span className="text-[10px] text-neutral-500 block">{selectedTripDetails.pickup.address}</span>
                  </div>
                </div>

                <div className="w-0.5 h-3 bg-neutral-200 ml-1" />

                <div className="flex items-start gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 mt-1 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-neutral-400 block font-bold uppercase">Destination</span>
                    <span className="font-bold text-neutral-900">{selectedTripDetails.destination.name}</span>
                    <span className="text-[10px] text-neutral-500 block">{selectedTripDetails.destination.address}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-100">
                  <span className="text-[10px] text-neutral-400 block">Distance & Durée</span>
                  <span className="font-bold text-neutral-800">
                    {selectedTripDetails.distanceKm} km • {selectedTripDetails.durationMin} min
                  </span>
                </div>

                <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-100">
                  <span className="text-[10px] text-neutral-400 block">Paiement</span>
                  <span className="font-bold text-neutral-800">
                    {selectedTripDetails.paymentMethod === 'WAVE'
                      ? 'Wave (0% frais)'
                      : selectedTripDetails.paymentMethod === 'ORANGE_MONEY'
                      ? 'Orange Money'
                      : 'Espèces'}
                  </span>
                </div>
              </div>

              {selectedTripDetails.driver && (
                <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100 flex items-center gap-3">
                  <img
                    src={selectedTripDetails.driver.photoUrl}
                    alt={selectedTripDetails.driver.name}
                    className="w-10 h-10 rounded-full object-cover border border-amber-400"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-neutral-900 block truncate">
                      {selectedTripDetails.driver.name}
                    </span>
                    <span className="text-[10px] text-neutral-500 block truncate">
                      {selectedTripDetails.driver.car.model} • {selectedTripDetails.driver.car.plate}
                    </span>
                  </div>
                  {selectedTripDetails.rating && (
                    <div className="text-right">
                      <span className="text-xs font-bold text-amber-500">★ {selectedTripDetails.rating}.0</span>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={(e) => {
                  handleRepeatTrip(selectedTripDetails, e);
                  setSelectedTripDetails(null);
                }}
                className="w-full py-3 bg-[#F5B800] hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
              >
                <RotateCcw size={14} />
                <span>REPRENDRE CE TRAJET VERS {selectedTripDetails.destination.name.toUpperCase()}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
