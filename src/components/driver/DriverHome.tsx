import React, { useState, useEffect } from 'react';
import { useTaxi } from '../../context/TaxiContext';
import { DakarMap } from '../common/DakarMap';
import { DriverEarnings } from './DriverEarnings';
import { DriverProfile } from './DriverProfile';
import { AndroidAppModal } from '../common/AndroidAppModal';
import {
  Power,
  Navigation,
  CheckCircle,
  X,
  Phone,
  Clock,
  MapPin,
  TrendingUp,
  AlertCircle,
  Home,
  DollarSign,
  Car,
  Bike,
  User,
  Shield,
  ShieldCheck,
  Layers,
  Smartphone,
} from 'lucide-react';

export const DriverHome: React.FC = () => {
  const {
    activeDriver,
    toggleDriverOnline,
    incomingDriverRide,
    driverAcceptRide,
    driverRefuseIncomingRide,
    tripStatus,
    activeTrip,
    driverArriveAtPickup,
    driverStartTrip,
    driverCompleteTrip,
    trips,
    pricing,
  } = useTaxi();

  const [activeTab, setActiveTab] = useState<'home' | 'trips' | 'earnings' | 'profile'>('home');
  const [countdown, setCountdown] = useState(15);
  const [slideConfirm, setSlideConfirm] = useState(0);
  const [showAndroidModal, setShowAndroidModal] = useState(false);

  // Incoming ride countdown timer (15 seconds, Prompt #32)
  useEffect(() => {
    if (incomingDriverRide && countdown > 0) {
      const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
      return () => clearInterval(timer);
    } else if (countdown === 0 && incomingDriverRide) {
      driverRefuseIncomingRide();
      setCountdown(15);
    }
  }, [incomingDriverRide, countdown, driverRefuseIncomingRide]);

  // Reset countdown when ride arrives
  useEffect(() => {
    if (incomingDriverRide) {
      setCountdown(15);
    }
  }, [incomingDriverRide]);

  return (
    <div className="relative w-full h-full flex flex-col bg-neutral-100 overflow-hidden select-none">
      {/* Sub Tabs */}
      {activeTab === 'earnings' && <DriverEarnings onBack={() => setActiveTab('home')} />}
      {activeTab === 'profile' && <DriverProfile onBack={() => setActiveTab('home')} />}
      {activeTab === 'trips' && (
        <div className="flex-1 bg-neutral-50 p-4 overflow-y-auto no-scrollbar">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
            <h2 className="text-base font-bold font-display text-neutral-900">
              Historique des courses chauffeur
            </h2>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              {trips.length} terminées
            </span>
          </div>
          <div className="mt-3 space-y-2.5">
            {trips.map((t) => {
              const commission = Math.round((t.finalPrice * pricing.commissionPercentage) / 100);
              const driverNet = t.finalPrice - commission;
              return (
                <div key={t.id} className="p-3 bg-white rounded-2xl border border-neutral-200 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-neutral-900">{t.clientName}</span>
                    <span className="font-extrabold text-emerald-600">+{driverNet.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  <div className="text-[10px] text-neutral-500">
                    {t.pickup.name} → {t.destination.name}
                  </div>
                  <div className="mt-2 pt-2 border-t border-neutral-100 flex items-center justify-between text-[10px] text-neutral-400">
                    <span>Brut : {t.finalPrice} FCFA (Comm: -{commission} FCFA)</span>
                    <span className="text-neutral-500">{t.requestedAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Driver Screen */}
      {activeTab === 'home' && (
        <div className="relative flex-1 flex flex-col overflow-hidden">
          {/* Top Online / Offline Status Bar (Prompt #31) */}
          <div className="absolute top-2 left-3 right-3 z-20 flex flex-col gap-2">
            <div
              className={`p-3 rounded-2xl shadow-lg border backdrop-blur-md flex items-center justify-between transition-all ${
                activeDriver.isOnline
                  ? 'bg-neutral-900/95 text-white border-neutral-800'
                  : 'bg-white/95 text-neutral-800 border-neutral-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-3.5 h-3.5 rounded-full ${
                    activeDriver.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-400'
                  }`}
                />
                <div>
                  <div className="text-xs font-black uppercase tracking-wider">
                    {activeDriver.isOnline ? 'VOUS ÊTES EN LIGNE' : 'VOUS ÊTES HORS LIGNE'}
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    {activeDriver.isOnline
                      ? `Prêt en moto (${activeDriver.car.model}) • Permis vérifié ✔️`
                      : `Activez pour recevoir des courses • 200 FCFA/500m`}
                  </div>
                </div>
              </div>

              {/* Online/Offline Toggle Button & Android APK */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowAndroidModal(true)}
                  className="px-2.5 py-1.5 rounded-xl bg-neutral-800 text-emerald-400 hover:text-white transition flex items-center gap-1 text-[11px] font-bold border border-neutral-700 active:scale-95"
                  title="Fichier Android (.APK) pour téléphone motard"
                >
                  <Smartphone size={13} />
                  <span>APK</span>
                </button>

                <button
                  onClick={toggleDriverOnline}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-sm ${
                    activeDriver.isOnline
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
                      : 'bg-[#F5B800] text-neutral-950 hover:bg-amber-400'
                  }`}
                >
                  <Power size={13} />
                  <span>{activeDriver.isOnline ? 'Se déconnecter' : 'PASSER EN LIGNE'}</span>
                </button>
              </div>
            </div>

            {/* Daily KPI Badges (Prompt #31) */}
            {activeDriver.isOnline && tripStatus === 'IDLE' && (
              <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-neutral-200 p-2.5 shadow-md grid grid-cols-4 gap-1 text-center">
                <div>
                  <span className="text-[9px] text-neutral-400 block font-semibold">Courses</span>
                  <span className="text-xs font-black text-neutral-900">8</span>
                </div>
                <div>
                  <span className="text-[9px] text-neutral-400 block font-semibold">Revenus</span>
                  <span className="text-xs font-black text-amber-600">25 500 F</span>
                </div>
                <div>
                  <span className="text-[9px] text-neutral-400 block font-semibold">Distance</span>
                  <span className="text-xs font-black text-neutral-900">78 km</span>
                </div>
                <div>
                  <span className="text-[9px] text-neutral-400 block font-semibold">Connecté</span>
                  <span className="text-xs font-black text-neutral-900">4h 15</span>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Kaolack Map */}
          <div className="flex-1 w-full relative">
            <DakarMap
              pickup={activeTrip?.pickup || { id: 'default', name: 'Position Motard', address: 'Kaolack Ville', city: 'Kaolack', lat: 14.1540, lng: -16.0750 }}
              destination={activeTrip?.destination}
              selectedDriver={activeDriver}
              routeProgress={activeTrip?.routeProgress || 0}
              heightClass="h-full"
            />
          </div>

          {/* INCOMING RIDE REQUEST POPUP (Prompt #32) */}
          {incomingDriverRide && (
            <div className="absolute inset-x-3 bottom-16 z-40 bg-white rounded-3xl shadow-2xl border-2 border-amber-400 p-5 animate-in slide-in-from-bottom duration-300">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center font-bold">
                    🏍️
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-neutral-900 font-display">
                      Nouvelle course SamaTaxi !
                    </h3>
                    <span className="text-[10px] text-neutral-500 font-medium">
                      Passager : {incomingDriverRide.clientName} (★ {incomingDriverRide.clientRating})
                    </span>
                  </div>
                </div>

                {/* 15s Countdown Circular Timer */}
                <div className="w-9 h-9 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center font-mono font-black text-amber-800 text-xs">
                  {countdown}s
                </div>
              </div>

              {/* Price & ETA */}
              <div className="my-3 bg-amber-50 p-3 rounded-2xl border border-amber-200 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] text-neutral-500 block">Gain estimé chauffeur</span>
                  <span className="text-lg font-black text-neutral-900 font-display">
                    {Math.round(incomingDriverRide.estimatedPrice * 0.8).toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-neutral-500 block">Distance de prise en charge</span>
                  <span className="text-xs font-bold text-neutral-800">~1,8 km (4 min)</span>
                </div>
              </div>

              {/* Itinerary */}
              <div className="space-y-1.5 text-xs text-neutral-700">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                  <span className="truncate"><strong className="text-neutral-900">Départ :</strong> {incomingDriverRide.pickup.name}</span>
                </div>
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2 h-2 rounded-full bg-neutral-900 flex-shrink-0" />
                  <span className="truncate"><strong className="text-neutral-900">Destination :</strong> {incomingDriverRide.destination.name}</span>
                </div>
              </div>

              {/* Accept & Refuse Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <button
                  onClick={driverRefuseIncomingRide}
                  className="py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs rounded-xl transition"
                >
                  REFUSER
                </button>
                <button
                  onClick={driverAcceptRide}
                  className="py-3 bg-[#F5B800] hover:bg-amber-400 text-neutral-950 font-extrabold text-xs rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <span>ACCEPTER ({countdown}s)</span>
                  <CheckCircle size={15} />
                </button>
              </div>
            </div>
          )}

          {/* ACTIVE TRIP DRIVER CONTROLS (Prompt #33, #34, #35) */}
          {activeTrip && (tripStatus === 'DRIVER_ASSIGNED' || tripStatus === 'DRIVER_ARRIVING' || tripStatus === 'DRIVER_ARRIVED' || tripStatus === 'TRIP_STARTED') && (
            <div className="absolute inset-x-0 bottom-0 z-30 bg-white rounded-t-3xl shadow-2xl p-5 border-t border-neutral-200 animate-in slide-in-from-bottom duration-300">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-amber-400 text-neutral-950 font-bold flex items-center justify-center text-sm">
                    OF
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">{activeTrip.clientName}</h4>
                    <span className="text-[10px] text-neutral-500 font-medium">
                      ★ {activeTrip.clientRating} • {activeTrip.paymentMethod === 'WAVE' ? 'Paiement Wave' : activeTrip.paymentMethod === 'ORANGE_MONEY' ? 'Orange Money' : 'Paiement Cash'}
                    </span>
                  </div>
                </div>

                <a
                  href={`tel:${activeTrip.clientPhone}`}
                  className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-amber-100 text-neutral-800 flex items-center justify-center"
                >
                  <Phone size={16} />
                </a>
              </div>

              {/* State A: Navigation vers le client (Prompt #33) */}
              {(tripStatus === 'DRIVER_ASSIGNED' || tripStatus === 'DRIVER_ARRIVING') && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-neutral-500">Navigation vers le client :</span>
                    <span className="font-extrabold text-neutral-900">{activeTrip.pickup.name}</span>
                  </div>
                  <button
                    onClick={driverArriveAtPickup}
                    className="w-full py-3 bg-[#F5B800] hover:bg-amber-400 text-neutral-950 font-extrabold text-xs rounded-xl shadow-md transition active:scale-95"
                  >
                    JE SUIS ARRIVÉ AU POINT DE PRISE EN CHARGE
                  </button>
                </div>
              )}

              {/* State B: Client à récupérer (Prompt #34) */}
              {tripStatus === 'DRIVER_ARRIVED' && (
                <div className="mt-3">
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-xl text-xs font-bold text-center mb-3">
                    🔔 Vous êtes sur place. Attente de la montée du client.
                  </div>
                  <button
                    onClick={driverStartTrip}
                    className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-amber-400 font-extrabold text-xs rounded-xl shadow-md transition active:scale-95"
                  >
                    DÉMARRER LA COURSE AVEC LE CLIENT
                  </button>
                </div>
              )}

              {/* State C: Course en cours vers la destination (Prompt #35) */}
              {tripStatus === 'TRIP_STARTED' && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-neutral-500">Destination finale :</span>
                    <span className="font-bold text-neutral-900 truncate max-w-[180px]">
                      {activeTrip.destination.name}
                    </span>
                  </div>

                  {/* Progress meter */}
                  <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden mb-3">
                    <div
                      className="bg-amber-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${activeTrip.routeProgress || 20}%` }}
                    />
                  </div>

                  {/* Anti-accidental termination slide / button (Prompt #35) */}
                  <button
                    onClick={driverCompleteTrip}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition active:scale-95 flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={16} />
                    <span>ARRIVÉ À DESTINATION — TERMINER LA COURSE</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Driver Bottom Navigation Bar (Prompt #64) */}
      <div className="w-full h-14 bg-white border-t border-neutral-200 px-4 flex items-center justify-around z-30 select-none flex-shrink-0">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-0.5 transition ${
            activeTab === 'home' ? 'text-amber-500 font-bold' : 'text-neutral-400 hover:text-neutral-700'
          }`}
        >
          <Home size={18} />
          <span className="text-[10px]">Accueil</span>
        </button>

        <button
          onClick={() => setActiveTab('trips')}
          className={`flex flex-col items-center gap-0.5 transition ${
            activeTab === 'trips' ? 'text-amber-500 font-bold' : 'text-neutral-400 hover:text-neutral-700'
          }`}
        >
          <Bike size={18} />
          <span className="text-[10px]">Courses</span>
        </button>

        <button
          onClick={() => setActiveTab('earnings')}
          className={`flex flex-col items-center gap-0.5 transition ${
            activeTab === 'earnings' ? 'text-amber-500 font-bold' : 'text-neutral-400 hover:text-neutral-700'
          }`}
        >
          <DollarSign size={18} />
          <span className="text-[10px]">Revenus</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-0.5 transition ${
            activeTab === 'profile' ? 'text-amber-500 font-bold' : 'text-neutral-400 hover:text-neutral-700'
          }`}
        >
          <User size={18} />
          <span className="text-[10px]">Profil</span>
        </button>
      </div>

      {/* Android Application Modal */}
      <AndroidAppModal
        isOpen={showAndroidModal}
        onClose={() => setShowAndroidModal(false)}
      />
    </div>
  );
};
