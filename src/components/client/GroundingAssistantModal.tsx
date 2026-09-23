import React, { useState } from 'react';
import { useTaxi } from '../../context/TaxiContext';
import { querySearchGrounding, queryMapsGrounding, GroundingSource, GroundingPlace } from '../../services/aiGrounding';
import { LocationPoint } from '../../types';
import {
  Sparkles,
  Search,
  MapPin,
  ExternalLink,
  Loader2,
  X,
  Compass,
  Car,
  AlertTriangle,
  Globe,
  Navigation,
  CheckCircle,
} from 'lucide-react';

interface GroundingAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'search' | 'maps';
  onSelectDestination?: (loc: LocationPoint) => void;
}

export const GroundingAssistantModal: React.FC<GroundingAssistantModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'maps',
  onSelectDestination,
}) => {
  const { clientLocation, setDestination } = useTaxi();
  const [activeTab, setActiveTab] = useState<'search' | 'maps'>(defaultTab);

  // Search Grounding state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResultText, setSearchResultText] = useState<string | null>(null);
  const [searchSources, setSearchSources] = useState<GroundingSource[]>([]);

  // Maps Grounding state
  const [mapsQuery, setMapsQuery] = useState('');
  const [mapsLoading, setMapsLoading] = useState(false);
  const [mapsResultText, setMapsResultText] = useState<string | null>(null);
  const [mapsPlaces, setMapsPlaces] = useState<GroundingPlace[]>([]);
  const [selectedPlaceMessage, setSelectedPlaceMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRunSearch = async (textToQuery?: string) => {
    const q = textToQuery || searchQuery;
    if (!q.trim()) return;
    setSearchLoading(true);
    setSearchResultText(null);
    setSearchSources([]);
    try {
      const res = await querySearchGrounding(q, clientLocation.name);
      setSearchResultText(res.text);
      setSearchSources(res.sources || []);
    } catch (err: any) {
      setSearchResultText('Impossible de récupérer les informations en temps réel pour le moment.');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleRunMaps = async (textToQuery?: string) => {
    const q = textToQuery || mapsQuery;
    if (!q.trim()) return;
    setMapsLoading(true);
    setMapsResultText(null);
    setMapsPlaces([]);
    setSelectedPlaceMessage(null);
    try {
      const res = await queryMapsGrounding(q, clientLocation.lat, clientLocation.lng);
      setMapsResultText(res.text);
      setMapsPlaces(res.places || []);
    } catch (err: any) {
      setMapsResultText('Impossible de trouver ces lieux sur Google Maps.');
    } finally {
      setMapsLoading(false);
    }
  };

  const handleSelectPlaceAsDestination = (place: GroundingPlace) => {
    // Convert to a LocationPoint
    const newLoc: LocationPoint = {
      id: `place-${Date.now()}`,
      name: place.title,
      address: place.address || 'Point d’intérêt repéré via Google Maps',
      city: 'Kaolack',
      lat: clientLocation.lat + (Math.random() * 0.03 - 0.015),
      lng: clientLocation.lng + (Math.random() * 0.03 - 0.015),
    };

    setDestination(newLoc);
    onSelectDestination?.(newLoc);
    setSelectedPlaceMessage(`"${place.title}" sélectionné comme destination !`);
    setTimeout(() => {
      setSelectedPlaceMessage(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 text-white flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-400 text-neutral-950 flex items-center justify-center font-bold">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-sm font-display tracking-tight text-white">
                  Assistant Google Grounding
                </h3>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-400 text-neutral-950">
                  gemini-3.5-flash
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 font-medium">
                Données en temps réel Google Search & Google Maps
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Toggle: Google Maps vs Google Search */}
        <div className="grid grid-cols-2 p-2 bg-neutral-100 border-b border-neutral-200 gap-1.5">
          <button
            onClick={() => setActiveTab('maps')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'maps'
                ? 'bg-white text-neutral-950 shadow-sm border border-neutral-200/80'
                : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            <Compass size={14} className="text-amber-500" />
            <span>Google Maps (Lieux)</span>
          </button>

          <button
            onClick={() => setActiveTab('search')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeTab === 'search'
                ? 'bg-white text-neutral-950 shadow-sm border border-neutral-200/80'
                : 'text-neutral-600 hover:text-neutral-950'
            }`}
          >
            <Globe size={14} className="text-blue-500" />
            <span>Google Search (Trafic)</span>
          </button>
        </div>

        {/* Selected confirmation notification */}
        {selectedPlaceMessage && (
          <div className="bg-emerald-600 text-white text-xs font-bold p-2.5 flex items-center justify-center gap-2 animate-in fade-in">
            <CheckCircle size={15} />
            <span>{selectedPlaceMessage}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
          {activeTab === 'maps' ? (
            /* TAB 1: GOOGLE MAPS GROUNDING */
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-neutral-800 block mb-1">
                  Rechercher des lieux & adresses vérifiés à Kaolack
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                      type="text"
                      value={mapsQuery}
                      onChange={(e) => setMapsQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleRunMaps()}
                      placeholder="Ex: Marché Central, Grande Mosquée Médina Baye..."
                      className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                  <button
                    onClick={() => handleRunMaps()}
                    disabled={mapsLoading || !mapsQuery.trim()}
                    className="px-4 py-2.5 bg-[#F5B800] hover:bg-amber-400 disabled:opacity-50 text-neutral-950 font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-2xs"
                  >
                    {mapsLoading ? <Loader2 size={14} className="animate-spin" /> : <Navigation size={14} />}
                    <span>Trouver</span>
                  </button>
                </div>
              </div>

              {/* Quick Suggestion Chips */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Grande Mosquée Médina Baye',
                  'Marché Central Kaolack',
                  'Hôpital Régional El Hadji Ibrahima Niass',
                  'Gare Routière Ndorong',
                ].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => {
                      setMapsQuery(chip);
                      handleRunMaps(chip);
                    }}
                    className="text-[10px] font-semibold bg-neutral-100 hover:bg-amber-50 hover:text-amber-900 text-neutral-700 px-2.5 py-1 rounded-lg border border-neutral-200 transition"
                  >
                    📍 {chip}
                  </button>
                ))}
              </div>

              {/* Loading State */}
              {mapsLoading && (
                <div className="p-6 text-center space-y-2 bg-neutral-50 rounded-2xl border border-neutral-200">
                  <Loader2 size={24} className="mx-auto text-amber-500 animate-spin" />
                  <p className="text-xs font-bold text-neutral-700">
                    Interrogation des données Google Maps...
                  </p>
                  <p className="text-[10px] text-neutral-400">
                    Recherche géographique dans le périmètre urbain de Kaolack.
                  </p>
                </div>
              )}

              {/* Maps Results */}
              {mapsResultText && !mapsLoading && (
                <div className="space-y-3">
                  <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs text-neutral-800 whitespace-pre-line leading-relaxed">
                    {mapsResultText}
                  </div>

                  {/* List of Verified Google Maps Place Links */}
                  {mapsPlaces.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-[11px] font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin size={13} className="text-amber-500" />
                        <span>Lieux identifiés avec Google Maps Grounding</span>
                      </h4>

                      <div className="space-y-2">
                        {mapsPlaces.map((place, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-white hover:bg-neutral-50 border border-neutral-200 rounded-2xl shadow-2xs transition flex flex-col gap-2"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="text-xs font-bold text-neutral-900 block">
                                  {place.title}
                                </span>
                                {place.address && (
                                  <span className="text-[10px] text-neutral-500 block">
                                    {place.address}
                                  </span>
                                )}
                              </div>

                              <a
                                href={place.uri}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 px-2 py-1 bg-blue-50 rounded-lg border border-blue-100 flex-shrink-0"
                              >
                                <span>Voir Maps</span>
                                <ExternalLink size={10} />
                              </a>
                            </div>

                            <button
                              onClick={() => handleSelectPlaceAsDestination(place)}
                              className="w-full py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-xs rounded-xl border border-amber-200 transition flex items-center justify-center gap-1.5"
                            >
                              <Car size={13} className="text-amber-600" />
                              <span>Commander une course vers ce lieu</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* TAB 2: GOOGLE SEARCH GROUNDING */
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-neutral-800 block mb-1">
                  Info trafic, perturbations, météo & événements en direct
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleRunSearch()}
                      placeholder="Ex: Trafic Avenue Cheikh Ibrahima Niass, travaux RN1..."
                      className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <button
                    onClick={() => handleRunSearch()}
                    disabled={searchLoading || !searchQuery.trim()}
                    className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-2xs"
                  >
                    {searchLoading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
                    <span>Vérifier</span>
                  </button>
                </div>
              </div>

              {/* Quick Search Chips */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Trafic actuel Avenue Cheikh Ibrahima Niass',
                  'Circulation RN1 traversée de Kaolack',
                  'Marché Central Kaolack affluence',
                  'Météo et pluie aujourd’hui à Kaolack',
                ].map((chip) => (
                  <button
                    key={chip}
                    onClick={() => {
                      setSearchQuery(chip);
                      handleRunSearch(chip);
                    }}
                    className="text-[10px] font-semibold bg-neutral-100 hover:bg-blue-50 hover:text-blue-900 text-neutral-700 px-2.5 py-1 rounded-lg border border-neutral-200 transition"
                  >
                    ⚡ {chip}
                  </button>
                ))}
              </div>

              {/* Loading State */}
              {searchLoading && (
                <div className="p-6 text-center space-y-2 bg-neutral-50 rounded-2xl border border-neutral-200">
                  <Loader2 size={24} className="mx-auto text-blue-500 animate-spin" />
                  <p className="text-xs font-bold text-neutral-700">
                    Recherche en direct avec Google Search...
                  </p>
                  <p className="text-[10px] text-neutral-400">
                    Extraction des sources d'actualités et rapports de trafic.
                  </p>
                </div>
              )}

              {/* Search Grounding Results */}
              {searchResultText && !searchLoading && (
                <div className="space-y-3">
                  <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs text-neutral-800 whitespace-pre-line leading-relaxed">
                    {searchResultText}
                  </div>

                  {/* Sources list */}
                  {searchSources.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                        Sources vérifiées via Google Search Grounding
                      </span>
                      <div className="space-y-1">
                        {searchSources.map((source, i) => (
                          <a
                            key={i}
                            href={source.uri}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-between p-2 bg-white hover:bg-blue-50/50 rounded-xl border border-neutral-200 text-xs text-neutral-700 group transition"
                          >
                            <span className="truncate pr-2 font-medium group-hover:text-blue-600">
                              {source.title || source.uri}
                            </span>
                            <ExternalLink size={12} className="text-neutral-400 group-hover:text-blue-600 flex-shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
