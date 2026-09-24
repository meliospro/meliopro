import React, { useState } from 'react';
import { Driver, LocationPoint } from '../../types';
import { Plus, Minus, Compass, Bike, AlertCircle } from 'lucide-react';
import { KAOLACK_BOUNDS, isWithinKaolackVille } from '../../data/mockData';

interface KaolackMapProps {
  pickup?: LocationPoint | null;
  destination?: LocationPoint | null;
  drivers?: Driver[];
  selectedDriver?: Driver | null;
  routeProgress?: number; // 0 to 100
  showTraffic?: boolean;
  onMapClick?: (coords: { lat: number; lng: number; name: string }) => void;
  interactive?: boolean;
  heightClass?: string;
  zoomLevel?: number;
}

export const KaolackMap: React.FC<KaolackMapProps> = ({
  pickup,
  destination,
  drivers = [],
  selectedDriver,
  routeProgress = 0,
  onMapClick,
  interactive = true,
  heightClass = 'h-full min-h-[300px]',
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  // Map coordinate conversion to SVG viewport for Kaolack Ville
  const minLat = KAOLACK_BOUNDS.minLat; // 14.110
  const maxLat = KAOLACK_BOUNDS.maxLat; // 14.190
  const minLng = KAOLACK_BOUNDS.minLng; // -16.120
  const maxLng = KAOLACK_BOUNDS.maxLng; // -16.030

  const toSvgX = (lng: number) => {
    return Math.max(20, Math.min(780, ((lng - minLng) / (maxLng - minLng)) * 800));
  };

  const toSvgY = (lat: number) => {
    // Latitude is inverted in SVG Y coordinates
    return Math.max(20, Math.min(580, ((maxLat - lat) / (maxLat - minLat)) * 600));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !interactive) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!onMapClick) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = (e.clientX - rect.left - pan.x) / zoom;
    const clickY = (e.clientY - rect.top - pan.y) / zoom;

    // Convert SVG back to lat/lng
    const lng = minLng + (clickX / 800) * (maxLng - minLng);
    const lat = maxLat - (clickY / 600) * (maxLat - minLat);

    if (!isWithinKaolackVille(lat, lng)) {
      setWarningMessage("⚠️ Zone hors limites : Les courses sont restreintes au périmètre urbain de Kaolack Ville.");
      setTimeout(() => setWarningMessage(null), 3500);
      return;
    }

    onMapClick({
      lat,
      lng,
      name: `Point sélectionné à Kaolack (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
    });
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Coordinates for pickup & destination
  const pickupPos = pickup ? { x: toSvgX(pickup.lng), y: toSvgY(pickup.lat) } : { x: 420, y: 310 };
  const destPos = destination ? { x: toSvgX(destination.lng), y: toSvgY(destination.lat) } : null;

  // Mid point curve calculation
  const getCurvePath = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
    const midX = (p1.x + p2.x) / 2 + (p2.y - p1.y) * 0.15;
    const midY = (p1.y + p2.y) / 2 - (p2.x - p1.x) * 0.15;
    return `M ${p1.x} ${p1.y} Q ${midX} ${midY} ${p2.x} ${p2.y}`;
  };

  // Car position along route if in progress
  const getCarOnRoute = () => {
    if (!destPos) return null;
    const ratio = Math.min(Math.max(routeProgress / 100, 0), 1);
    const currX = pickupPos.x + (destPos.x - pickupPos.x) * ratio;
    const currY = pickupPos.y + (destPos.y - pickupPos.y) * ratio;
    return { x: currX, y: currY };
  };

  const carPos = getCarOnRoute();

  return (
    <div
      className={`relative w-full ${heightClass} overflow-hidden bg-[#f1f3e8] select-none cursor-grab active:cursor-grabbing`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Out of bounds notification */}
      {warningMessage && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-40 bg-neutral-900/95 backdrop-blur-md text-amber-300 text-xs px-3.5 py-1.5 rounded-full shadow-xl border border-amber-500/40 flex items-center gap-1.5 animate-bounce pointer-events-none">
          <AlertCircle size={14} className="text-amber-400 flex-shrink-0" />
          <span className="font-semibold">{warningMessage}</span>
        </div>
      )}

      {/* SVG Vector Map of Kaolack Ville */}
      <svg
        className="w-full h-full transition-transform duration-75"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        onClick={handleSvgClick}
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
        }}
      >
        <defs>
          <linearGradient id="saloumGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
          <linearGradient id="zoneGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#fde68a" stopOpacity="0.1" />
          </linearGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Urban Terrain Base */}
        <rect width="800" height="600" fill="#f8fafc" />

        {/* Saloum River & Estuary (Bras du Saloum) along the South & West */}
        <path
          d="M -20 380 
             C 120 360, 200 420, 280 440
             C 360 460, 440 450, 520 490
             C 600 530, 680 520, 820 540
             L 820 620
             L -20 620 Z"
          fill="url(#saloumGrad)"
        />

        {/* Tanns and wetlands along the Saloum banks */}
        <path
          d="M 60 365 C 160 380, 260 430, 350 435 C 280 470, 150 440, 60 410 Z"
          fill="#cbd5e1"
          opacity="0.6"
        />

        {/* Kaolack Urban Area Contour / Perimeter Highlight */}
        <rect
          x="40"
          y="40"
          width="720"
          height="450"
          rx="32"
          fill="url(#zoneGrad)"
          stroke="#f59e0b"
          strokeWidth="2"
          strokeDasharray="6 4"
        />

        {/* Green oasis / vegetation zones (Berges du Saloum, Médina Baye green spaces) */}
        <path
          d="M 520 120 C 580 100, 640 140, 610 180 C 560 210, 500 170, 520 120 Z"
          fill="#dcfce7"
          opacity="0.8"
        />
        <path
          d="M 180 260 C 240 250, 290 280, 270 330 C 220 350, 160 310, 180 260 Z"
          fill="#dcfce7"
          opacity="0.8"
        />

        {/* Major Arteries of Kaolack */}
        {/* RN1 entering from Fatick (North-West) through Kasnack towards Tamba / Kahone (East) */}
        <path
          d="M 20 160 L 260 220 L 440 300 L 780 340"
          stroke="#ffffff"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 20 160 L 260 220 L 440 300 L 780 340"
          stroke="#f59e0b"
          strokeWidth="3"
          strokeDasharray="8 6"
          fill="none"
        />

        {/* Avenue Cheikh Ibrahima Niass (Linking Marché Central, Léona & Médina Baye) */}
        <path
          d="M 400 370 L 430 290 L 540 180 L 610 140"
          stroke="#ffffff"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 400 370 L 430 290 L 540 180 L 610 140"
          stroke="#10b981"
          strokeWidth="2.5"
          fill="none"
        />

        {/* Boulevard Valdiodio Ndiaye (North-South arterial through Ndorong) */}
        <path
          d="M 330 90 L 330 260 L 350 420"
          stroke="#ffffff"
          strokeWidth="9"
          fill="none"
          strokeLinecap="round"
        />

        {/* RN4 heading South over Saloum towards Nioro / Gambie */}
        <path
          d="M 440 300 L 480 430 L 510 570"
          stroke="#ffffff"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
        />

        {/* Route de Gossas branching North-East from Kasnack */}
        <path
          d="M 260 220 L 380 70"
          stroke="#ffffff"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />

        {/* Secondary city streets & grids */}
        <line x1="160" y1="180" x2="220" y2="340" stroke="#ffffff" strokeWidth="4" />
        <line x1="260" y1="220" x2="350" y2="420" stroke="#ffffff" strokeWidth="5" />
        <line x1="430" y1="290" x2="240" y2="380" stroke="#ffffff" strokeWidth="5" />
        <line x1="480" y1="230" x2="620" y2="280" stroke="#ffffff" strokeWidth="4" />
        <line x1="330" y1="160" x2="540" y2="180" stroke="#ffffff" strokeWidth="5" />
        <line x1="200" y1="310" x2="480" y2="350" stroke="#ffffff" strokeWidth="4" />

        {/* District Labels of Kaolack Ville */}
        <g fill="#1e293b" fontWeight="bold">
          <text x="560" y="130" fill="#047857" fontSize="13">Médina Baye 🕌</text>
          <text x="440" y="240" fill="#0f172a" fontSize="12">Léona Niassène</text>
          <text x="360" y="325" fill="#b45309" fontSize="13">Marché Central 🛍</text>
          <text x="210" y="200" fill="#1e293b" fontSize="13">Carrefour Kasnack 🚦</text>
          <text x="280" y="390" fill="#334155" fontSize="12">Rond-point Ndorong</text>
          <text x="110" y="290" fill="#64748b" fontSize="11">Sara Nimzatt</text>
          <text x="210" y="380" fill="#64748b" fontSize="11">Bongré</text>
          <text x="180" y="440" fill="#64748b" fontSize="11">Dialègne</text>
          <text x="470" y="380" fill="#64748b" fontSize="11">Ndiolofène (Garage)</text>
          <text x="560" y="310" fill="#dc2626" fontSize="11">Hôpital Régional 🏥</text>
          <text x="260" y="100" fill="#2563eb" fontSize="11">Campus USSEIN 🎓</text>
          <text x="640" y="190" fill="#64748b" fontSize="10">Ngane Saër</text>
          <text x="340" y="520" fill="#1d4ed8" fontSize="13" fontStyle="italic">Fleuve Saloum ~</text>
        </g>

        {/* Active Route Path if Destination chosen */}
        {destPos && (
          <>
            <path
              d={getCurvePath(pickupPos, destPos)}
              stroke="#000000"
              strokeWidth="7"
              strokeLinecap="round"
              fill="none"
              opacity="0.3"
            />
            <path
              d={getCurvePath(pickupPos, destPos)}
              stroke="#F5B800"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
          </>
        )}

        {/* Nearby Drivers in Kaolack */}
        {drivers.map((drv) => {
          const dx = toSvgX(drv.location.lng);
          const dy = toSvgY(drv.location.lat);
          const isSelected = selectedDriver?.id === drv.id;

          return (
            <g
              key={drv.id}
              transform={`translate(${dx}, ${dy})`}
              className="cursor-pointer transition-transform duration-500 hover:scale-125"
            >
              {/* Taxi vehicle badge */}
              <circle
                r={isSelected ? 16 : 13}
                fill={drv.isOnline ? (isSelected ? '#F5B800' : '#111827') : '#94a3b8'}
                stroke="#ffffff"
                strokeWidth="2.5"
                filter="url(#shadow)"
              />
              <path
                d="M -5 -3 L 5 -3 L 6 3 L -6 3 Z"
                fill={isSelected ? '#111827' : '#F5B800'}
              />
              <circle cx="-3" cy="4" r="1.5" fill="#ffffff" />
              <circle cx="3" cy="4" r="1.5" fill="#ffffff" />

              {/* Status pulse if online */}
              {drv.isOnline && (
                <circle
                  r={isSelected ? 22 : 18}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="1.5"
                  opacity="0.6"
                  className="animate-ping"
                />
              )}
            </g>
          );
        })}

        {/* Car on Route during ongoing ride */}
        {carPos && (
          <g transform={`translate(${carPos.x}, ${carPos.y})`} filter="url(#shadow)">
            <circle r="18" fill="#111827" stroke="#F5B800" strokeWidth="3" />
            <path d="M -7 -4 L 7 -4 L 8 4 L -8 4 Z" fill="#F5B800" />
            <circle cx="-4" cy="5" r="2" fill="#ffffff" />
            <circle cx="4" cy="5" r="2" fill="#ffffff" />
          </g>
        )}

        {/* Pickup Pin */}
        {pickupPos && (
          <g transform={`translate(${pickupPos.x}, ${pickupPos.y})`} filter="url(#shadow)">
            <circle r="20" fill="#F5B800" opacity="0.3" className="animate-pulse" />
            <circle r="9" fill="#F5B800" stroke="#111827" strokeWidth="2.5" />
            <circle r="3.5" fill="#111827" />
            {pickup && (
              <rect
                x="-50"
                y="-36"
                width="100"
                height="22"
                rx="6"
                fill="#111827"
                stroke="#F5B800"
                strokeWidth="1.5"
              />
            )}
            {pickup && (
              <text
                x="0"
                y="-22"
                fill="#ffffff"
                fontSize="9"
                fontWeight="700"
                textAnchor="middle"
              >
                Départ Kaolack
              </text>
            )}
          </g>
        )}

        {/* Destination Pin */}
        {destPos && (
          <g transform={`translate(${destPos.x}, ${destPos.y})`} filter="url(#shadow)">
            <path
              d="M 0 0 L -8 -22 A 8 8 0 1 1 8 -22 Z"
              fill="#111827"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <circle cx="0" cy="-22" r="3.5" fill="#F5B800" />
            {destination && (
              <rect
                x="-50"
                y="-54"
                width="100"
                height="20"
                rx="5"
                fill="#ffffff"
                stroke="#111827"
                strokeWidth="1"
              />
            )}
            {destination && (
              <text
                x="0"
                y="-40"
                fill="#111827"
                fontSize="9"
                fontWeight="700"
                textAnchor="middle"
              >
                Arrivée Kaolack
              </text>
            )}
          </g>
        )}
      </svg>

      {/* Floating Map Controls */}
      <div className="absolute right-3 top-3 flex flex-col gap-2 z-10">
        <button
          onClick={() => setZoom((z) => Math.min(z + 0.25, 2.5))}
          className="p-2.5 bg-white text-neutral-800 rounded-xl shadow-md border border-neutral-200 hover:bg-neutral-50 transition active:scale-95"
          title="Zoomer"
        >
          <Plus size={18} />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(z - 0.25, 0.75))}
          className="p-2.5 bg-white text-neutral-800 rounded-xl shadow-md border border-neutral-200 hover:bg-neutral-50 transition active:scale-95"
          title="Dézoomer"
        >
          <Minus size={18} />
        </button>
        <button
          onClick={resetView}
          className="p-2.5 bg-white text-neutral-800 rounded-xl shadow-md border border-neutral-200 hover:bg-neutral-50 transition active:scale-95"
          title="Recentrer Kaolack"
        >
          <Compass size={18} />
        </button>
      </div>

      {/* City Badge & Zone Restriction indicator */}
      <div className="absolute left-3 top-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-neutral-200 flex items-center gap-1.5 text-xs font-semibold text-neutral-800 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-bold text-neutral-900">Kaolack Ville</span>
        <span className="text-neutral-300">|</span>
        <span className="bg-amber-100 text-amber-900 text-[10px] px-1.5 py-0.5 rounded font-bold">
          Zone exclusive
        </span>
        <span className="text-neutral-300">|</span>
        <Bike size={13} className="text-amber-500" />
        <span className="text-neutral-600 font-medium">
          {drivers.filter((d) => d.isOnline).length} motards
        </span>
      </div>

      {/* Zone notice banner at bottom of map */}
      <div className="absolute bottom-2 left-3 right-3 pointer-events-none flex justify-center">
        <div className="bg-neutral-900/80 backdrop-blur-md text-white text-[10px] font-semibold px-3 py-1 rounded-full border border-neutral-700/60 shadow flex items-center gap-1.5">
          <AlertCircle size={12} className="text-amber-400" />
          <span>Trajets limités exclusivement au périmètre urbain de Kaolack Ville</span>
        </div>
      </div>
    </div>
  );
};

// Alias pour compatibilité descendante
export const DakarMap = KaolackMap;
