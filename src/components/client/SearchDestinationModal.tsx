import React, { useState } from 'react';
import { LocationPoint } from '../../types';
import { KAOLACK_LOCATIONS } from '../../data/mockData';
import { Search, MapPin, Home, Briefcase, Clock, X, Map, AlertTriangle } from 'lucide-react';

interface SearchDestinationModalProps {
  currentPickup: LocationPoint;
  onSelectDestination: (dest: LocationPoint) => void;
  onClose: () => void;
}

export const SearchDestinationModal: React.FC<SearchDestinationModalProps> = ({
  currentPickup,
  onSelectDestination,
  onClose,
}) => {
  const [query, setQuery] = useState('');

  // Détection si l'utilisateur recherche une autre ville que Kaolack
  const externalCities = ['dakar', 'thiès', 'thies', 'touba', 'mbour', 'saint-louis', 'fatick', 'ziguinchor', 'diourbel', 'louga', 'kolda', 'tambacounda', 'aibd'];
  const isExternalSearch = externalCities.some((city) => query.toLowerCase().includes(city));

  const filteredLocations = KAOLACK_LOCATIONS.filter(
    (loc) =>
      loc.name.toLowerCase().includes(query.toLowerCase()) ||
      loc.address.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="absolute inset-0 bg-white z-50 flex flex-col p-4 select-none animate-in slide-in-from-bottom duration-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
        <div>
          <h3 className="font-bold text-base text-neutral-900 font-display">
            Choisir votre destination
          </h3>
          <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 inline-block mt-0.5">
            Périmètre strict : Kaolack Ville uniquement
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-full hover:bg-neutral-100"
        >
          <X size={20} />
        </button>
      </div>

      {/* Pickup & Destination Inputs Box */}
      <div className="my-3 bg-neutral-50 p-3 rounded-2xl border border-neutral-200 flex flex-col gap-2.5">
        {/* Pickup (fixed current location) */}
        <div className="flex items-center gap-3">
          <div className="w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-neutral-900 flex-shrink-0" />
          <div className="flex-1">
            <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider block">
              Point de départ (Kaolack)
            </span>
            <span className="text-xs font-semibold text-neutral-800 truncate block">
              {currentPickup.name}
            </span>
          </div>
        </div>

        <div className="w-full h-px bg-neutral-200 ml-6" />

        {/* Destination Search Input */}
        <div className="flex items-center gap-3">
          <div className="w-3.5 h-3.5 rounded-full bg-neutral-900 flex-shrink-0" />
          <div className="flex-1 relative">
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Destination à Kaolack (ex: Médina Baye, Marché...)"
              className="w-full bg-transparent text-xs font-bold text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
            />
          </div>
          {query && (
            <button onClick={() => setQuery('')} className="text-neutral-400 hover:text-neutral-600">
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Hors zone Kaolack warning if user searched another city */}
      {isExternalSearch && (
        <div className="mb-2 p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2 animate-in fade-in duration-200">
          <AlertTriangle size={16} className="text-rose-600 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Trajets limités à Kaolack Ville</span>
            <span className="text-[11px] text-rose-700">
              SamaTaxi opère exclusivement dans le périmètre urbain de la ville de Kaolack. Les trajets interurbains vers d’autres villes ne sont pas disponibles.
            </span>
          </div>
        </div>
      )}

      {/* Quick shortcuts: Maison, Travail, Choisir sur carte */}
      <div className="grid grid-cols-3 gap-2 my-1">
        <button
          onClick={() => onSelectDestination(KAOLACK_LOCATIONS[4])}
          className="p-2.5 bg-neutral-50 hover:bg-amber-50 rounded-xl border border-neutral-200 flex items-center gap-2 transition text-left"
        >
          <Home size={15} className="text-amber-500 flex-shrink-0" />
          <div>
            <div className="text-[11px] font-bold text-neutral-800 leading-tight">Maison</div>
            <div className="text-[9px] text-neutral-500">Ndorong</div>
          </div>
        </button>

        <button
          onClick={() => onSelectDestination(KAOLACK_LOCATIONS[1])}
          className="p-2.5 bg-neutral-50 hover:bg-amber-50 rounded-xl border border-neutral-200 flex items-center gap-2 transition text-left"
        >
          <Briefcase size={15} className="text-blue-500 flex-shrink-0" />
          <div>
            <div className="text-[11px] font-bold text-neutral-800 leading-tight">Travail</div>
            <div className="text-[9px] text-neutral-500">Marché Central</div>
          </div>
        </button>

        <button
          onClick={() => onSelectDestination(KAOLACK_LOCATIONS[0])}
          className="p-2.5 bg-neutral-50 hover:bg-amber-50 rounded-xl border border-neutral-200 flex items-center gap-2 transition text-left"
        >
          <Map size={15} className="text-emerald-500 flex-shrink-0" />
          <div>
            <div className="text-[11px] font-bold text-neutral-800 leading-tight">Médina</div>
            <div className="text-[9px] text-neutral-500">Place Barham</div>
          </div>
        </button>
      </div>

      {/* Locations List */}
      <div className="flex-1 overflow-y-auto no-scrollbar mt-2 divide-y divide-neutral-100">
        <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider py-1.5 flex items-center gap-1">
          <Clock size={12} />
          <span>Lieux & quartiers de Kaolack Ville</span>
        </div>

        {filteredLocations.map((loc) => (
          <button
            key={loc.id}
            onClick={() => onSelectDestination(loc)}
            className="w-full py-3 flex items-start gap-3 text-left hover:bg-amber-50/50 rounded-xl px-2 transition group"
          >
            <div className="w-8 h-8 rounded-full bg-neutral-100 group-hover:bg-amber-100 flex items-center justify-center text-neutral-600 group-hover:text-amber-600 flex-shrink-0 transition">
              {loc.icon === 'airport' ? (
                <span className="text-sm">✈</span>
              ) : loc.icon === 'beach' ? (
                <span className="text-sm">🏖</span>
              ) : loc.icon === 'shop' ? (
                <span className="text-sm">🛍</span>
              ) : loc.icon === 'landmark' ? (
                <span className="text-sm">🕌</span>
              ) : (
                <MapPin size={16} />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-neutral-800 group-hover:text-amber-700 truncate">
                {loc.name}
              </div>
              <div className="text-[10px] text-neutral-500 truncate mt-0.5">
                {loc.address}
              </div>
            </div>
          </button>
        ))}

        {filteredLocations.length === 0 && (
          <div className="py-8 text-center text-xs text-neutral-500 flex flex-col items-center gap-2">
            <MapPin size={24} className="text-neutral-300" />
            <div>
              <p className="font-semibold text-neutral-700">Aucun lieu trouvé à Kaolack pour « {query} »</p>
              <p className="text-[11px] text-neutral-400 mt-1">
                Rappel : SamaTaxi dessert uniquement les quartiers de Kaolack Ville.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
