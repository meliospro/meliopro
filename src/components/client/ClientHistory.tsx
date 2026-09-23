import React, { useState } from 'react';
import { useTaxi } from '../../context/TaxiContext';
import { Trip } from '../../types';
import { Clock, MapPin, CheckCircle, Car, ArrowLeft, ChevronRight, FileText } from 'lucide-react';

interface ClientHistoryProps {
  onBack: () => void;
}

export const ClientHistory: React.FC<ClientHistoryProps> = ({ onBack }) => {
  const { trips } = useTaxi();
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  return (
    <div className="flex-1 bg-neutral-50 flex flex-col p-4 select-none overflow-y-auto no-scrollbar">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
        <button
          onClick={selectedTrip ? () => setSelectedTrip(null) : onBack}
          className="p-1.5 -ml-1 text-neutral-600 hover:text-neutral-900 rounded-full hover:bg-neutral-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-base font-bold font-display text-neutral-900">
          {selectedTrip ? 'Détails de la course' : 'Historique des courses'}
        </h2>
        <div className="w-8" />
      </div>

      {/* Selected Trip Receipt Detail View */}
      {selectedTrip ? (
        <div className="my-4 bg-white rounded-2xl border border-neutral-200 p-4 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">
                Reçu SamaTaxi #{selectedTrip.id}
              </span>
              <span className="text-xs text-neutral-500 font-medium">{selectedTrip.requestedAt}</span>
            </div>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full flex items-center gap-1">
              <CheckCircle size={12} />
              <span>Terminée</span>
            </span>
          </div>

          {/* Pricing Total */}
          <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 flex items-baseline justify-between">
            <span className="text-xs text-neutral-600 font-medium">Total payé</span>
            <span className="text-xl font-black font-display text-neutral-900">
              {selectedTrip.finalPrice.toLocaleString('fr-FR')} FCFA
            </span>
          </div>

          {/* Itinerary */}
          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <div className="w-3 h-3 rounded-full bg-amber-400 border border-neutral-900 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-bold block">Départ</span>
                <span className="text-xs font-semibold text-neutral-800">{selectedTrip.pickup.name}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-3 h-3 rounded-full bg-neutral-900 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-neutral-400 uppercase font-bold block">Destination</span>
                <span className="text-xs font-semibold text-neutral-800">{selectedTrip.destination.name}</span>
              </div>
            </div>
          </div>

          {/* Chauffeur info */}
          {selectedTrip.driver && (
            <div className="pt-3 border-t border-neutral-100 flex items-center gap-3">
              <img
                src={selectedTrip.driver.photoUrl}
                alt={selectedTrip.driver.name}
                className="w-10 h-10 rounded-full object-cover border border-amber-400"
              />
              <div className="flex-1">
                <div className="text-xs font-bold text-neutral-900">{selectedTrip.driver.name}</div>
                <div className="text-[10px] text-neutral-500">
                  {selectedTrip.driver.car.brand} {selectedTrip.driver.car.model} • {selectedTrip.driver.car.plate}
                </div>
              </div>
              {selectedTrip.rating && (
                <div className="text-xs font-bold text-amber-500">
                  {'★'.repeat(selectedTrip.rating)}
                </div>
              )}
            </div>
          )}

          {/* Review tags if present */}
          {selectedTrip.ratingTags && selectedTrip.ratingTags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2">
              {selectedTrip.ratingTags.map((t, idx) => (
                <span key={idx} className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-full text-[10px] font-medium">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Trips List */
        <div className="mt-3 space-y-2.5">
          {trips.length === 0 ? (
            <div className="text-center py-12 text-neutral-400">
              <Car size={36} className="mx-auto mb-2 opacity-40" />
              <p className="text-xs font-medium">Vous n’avez pas encore effectué de course.</p>
            </div>
          ) : (
            trips.map((trip) => (
              <button
                key={trip.id}
                onClick={() => setSelectedTrip(trip)}
                className="w-full bg-white hover:bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200 shadow-xs flex items-center justify-between text-left transition group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 group-hover:bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 transition">
                    <Car size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-neutral-900 truncate max-w-[180px]">
                      {trip.destination.name}
                    </div>
                    <div className="text-[10px] text-neutral-500 mt-0.5 flex items-center gap-1">
                      <Clock size={11} />
                      <span>{trip.requestedAt}</span>
                    </div>
                    <div className="text-[10px] text-neutral-600 mt-1 font-medium">
                      Chauffeur : {trip.driver?.name || 'Mamadou Ndiaye'}
                    </div>
                  </div>
                </div>

                <div className="text-right flex items-center gap-1.5">
                  <div>
                    <div className="text-xs font-extrabold text-neutral-900">
                      {trip.finalPrice.toLocaleString('fr-FR')} FCFA
                    </div>
                    <span className="text-[9px] font-semibold text-emerald-600 block">
                      ✓ Payé
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-neutral-400" />
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};
