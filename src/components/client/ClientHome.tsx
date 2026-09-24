import React, { useState } from 'react';
import { useTaxi } from '../../context/TaxiContext';
import { VEHICLE_CATEGORIES, isWithinKaolackVille, KAOLACK_LOCATIONS } from '../../data/mockData';
import { PaymentMethod, VehicleCategory, LocationPoint } from '../../types';
import { DakarMap } from '../common/DakarMap';
import { SamaLogo } from '../common/SamaLogo';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { DriverRegistrationModal } from '../driver/DriverRegistrationModal';
import { SearchDestinationModal } from './SearchDestinationModal';
import { ActiveRideView } from './ActiveRideView';
import { RideCompletedModal } from './RideCompletedModal';
import { ClientHistory } from './ClientHistory';
import { ClientPromos } from './ClientPromos';
import { ClientProfile } from './ClientProfile';
import { HistoriqueTrajets } from './HistoriqueTrajets';
import { EstimateurTarif } from './EstimateurTarif';
import { GroundingAssistantModal } from './GroundingAssistantModal';
import { AndroidAppModal } from '../common/AndroidAppModal';
import {
  MapPin,
  Search,
  Users,
  Clock,
  ShieldCheck,
  Check,
  CreditCard,
  Banknote,
  Home,
  Tag,
  User,
  Car,
  Bell,
  Sparkles,
  ArrowRight,
  Bike,
  Smartphone,
} from 'lucide-react';

export const ClientHome: React.FC = () => {
  const {
    clientLocation,
    setClientLocation,
    destination,
    setDestination,
    selectedCategory,
    setSelectedCategory,
    selectedPayment,
    setSelectedPayment,
    appliedPromo,
    requestRide,
    tripStatus,
    activeTrip,
    drivers,
    notifications,
    currentUser,
    addNotification,
  } = useTaxi();

  const [activeTab, setActiveTab] = useState<'home' | 'trips' | 'promos' | 'profile'>('home');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showGroundingModal, setShowGroundingModal] = useState(false);
  const [showPaymentPicker, setShowPaymentPicker] = useState(false);
  const [showDriverRegModal, setShowDriverRegModal] = useState(false);
  const [showAndroidModal, setShowAndroidModal] = useState(false);
  const [zoneAlert, setZoneAlert] = useState<string | null>(null);

  // Calculate Distance & Price helper (Kaolack Ville)
  const calculateDistanceKm = (p1: LocationPoint, p2: LocationPoint) => {
    const latDiff = (p1.lat - p2.lat) * 111;
    const lngDiff = (p1.lng - p2.lng) * 111 * Math.cos((p1.lat * Math.PI) / 180);
    const dist = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
    return Math.max(parseFloat(dist.toFixed(1)), 0.5);
  };

  const distanceKm = destination ? calculateDistanceKm(clientLocation, destination) : 2.2;
  const durationMin = Math.round(distanceKm * 2.0 + 3);

  // Strict pricing rule: 200 FCFA every 500 meters
  const calculateCategoryPrice = (cat: VehicleCategory) => {
    const distanceMeters = distanceKm * 1000;
    const tranches500m = Math.max(1, Math.ceil(distanceMeters / 500));
    let raw = tranches500m * 200;
    if (appliedPromo) {
      const discount = Math.min((raw * appliedPromo.discountPercentage) / 100, appliedPromo.maxDiscountFCFA);
      raw = Math.max(raw - discount, 200);
    }
    return Math.round(raw);
  };

  // Allow clicking on map to choose a destination point inside Kaolack Ville
  const handleMapClick = (coords: { lat: number; lng: number; name: string }) => {
    if (tripStatus !== 'IDLE') return;
    if (!isWithinKaolackVille(coords.lat, coords.lng)) {
      setZoneAlert("⚠️ Zone non desservie : Les trajets SamaTaxi sont limités exclusivement à Kaolack Ville.");
      setTimeout(() => setZoneAlert(null), 4000);
      addNotification(
        "Zone hors Kaolack Ville",
        "Les trajets SamaTaxi sont strictement limités au périmètre urbain de Kaolack Ville.",
        "safety"
      );
      return;
    }
    setZoneAlert(null);
    setDestination({
      id: `custom-dest-${Date.now()}`,
      name: coords.name,
      address: 'Coordonnées GPS dans Kaolack Ville',
      city: 'Kaolack',
      lat: coords.lat,
      lng: coords.lng,
    });
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-neutral-100 overflow-hidden select-none">
      {/* Dynamic Sub-Views */}
      {activeTab === 'trips' && <ClientHistory onBack={() => setActiveTab('home')} />}
      {activeTab === 'promos' && <ClientPromos onBack={() => setActiveTab('home')} />}
      {activeTab === 'profile' && (
        <ClientProfile
          onBack={() => setActiveTab('home')}
          onOpenHistory={() => setActiveTab('trips')}
          onOpenPromos={() => setActiveTab('promos')}
        />
      )}

      {/* Main Home Map View */}
      {activeTab === 'home' && (
        <div className="relative flex-1 flex flex-col overflow-hidden">
          {/* Top Bar Floating Header */}
          <div className="absolute top-2 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
            {/* User Profile Avatar */}
            <button
              onClick={() => setActiveTab('profile')}
              className="pointer-events-auto p-1 bg-white/90 backdrop-blur-md rounded-2xl shadow-md border border-neutral-200/80 flex items-center gap-2 pr-3 hover:bg-white transition active:scale-95"
            >
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'Utilisateur'}
                  className="w-8 h-8 rounded-xl object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-amber-400 font-extrabold text-neutral-950 text-xs flex items-center justify-center">
                  {currentUser?.displayName
                    ? currentUser.displayName.slice(0, 2).toUpperCase()
                    : 'OF'}
                </div>
              )}
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-neutral-900 leading-tight truncate max-w-[80px]">
                  {currentUser?.displayName ? currentUser.displayName.split(' ')[0] : 'Ousmane'}
                </div>
                <div className="text-[10px] text-amber-600 font-bold">
                  {currentUser ? '★ 5.0' : '★ 4.9'}
                </div>
              </div>
            </button>

            {/* SamaTaxi Mini Brand & Actions */}
            <div className="flex items-center gap-1.5 pointer-events-auto">
              <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-neutral-200/80 flex items-center gap-1">
                <Bike size={13} className="text-amber-500" />
                <span className="font-extrabold text-xs text-neutral-900">Sama</span>
                <span className="font-extrabold text-xs text-amber-500">Taxi</span>
              </div>

              <button
                onClick={() => setShowDriverRegModal(true)}
                className="bg-amber-400 hover:bg-amber-500 text-neutral-950 px-2.5 py-1.5 rounded-full text-[10px] font-black shadow-md flex items-center gap-1 transition active:scale-95 cursor-pointer"
                title="Devenir chauffeur moto (Permis obligatoire)"
              >
                <Bike size={12} />
                <span>Devenir Chauffeur</span>
              </button>

              <button
                onClick={() => setShowAndroidModal(true)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-2.5 py-1.5 rounded-full text-[10px] font-black shadow-md flex items-center gap-1 transition active:scale-95 cursor-pointer"
                title="Fichier Android (.APK) & Installation Smartphone"
              >
                <Smartphone size={12} />
                <span>Android (.APK)</span>
              </button>

              <PWAInstallButton />
            </div>

            {/* Notifications Indicator */}
            <button
              onClick={() => setActiveTab('profile')}
              className="pointer-events-auto w-9 h-9 rounded-2xl bg-white/90 backdrop-blur-md shadow-md border border-neutral-200/80 flex items-center justify-center text-neutral-700 hover:text-neutral-950 transition relative active:scale-95"
            >
              <Bell size={16} />
              {notifications.some((n) => !n.read) && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              )}
            </button>
          </div>

          {/* Zone Limit Toast */}
          {zoneAlert && (
            <div className="absolute top-16 left-3 right-3 z-30 bg-neutral-900/95 backdrop-blur-md text-amber-300 text-xs px-3.5 py-2 rounded-2xl shadow-xl border border-amber-500/40 flex items-center gap-2 animate-bounce pointer-events-none">
              <span className="font-semibold text-center w-full">{zoneAlert}</span>
            </div>
          )}

          {/* Interactive Kaolack Map (Vector) */}
          <div className="flex-1 w-full relative">
            <DakarMap
              pickup={clientLocation}
              destination={destination}
              drivers={drivers}
              selectedDriver={activeTrip?.driver}
              routeProgress={activeTrip?.routeProgress || 0}
              onMapClick={handleMapClick}
              heightClass="h-full"
            />

            {/* Floating map estimation indicator when destination is chosen on the map */}
            {destination && tripStatus === 'IDLE' && (
              <div className="absolute top-16 left-3 right-3 z-20 flex justify-center pointer-events-none animate-in fade-in duration-200">
                <div className="pointer-events-auto bg-neutral-900/95 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full shadow-lg border border-neutral-700/80 flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span className="font-bold text-amber-400 font-display">
                    Tarif estimé : {calculateCategoryPrice(selectedCategory).toLocaleString('fr-FR')} FCFA
                  </span>
                  <span className="text-[10px] text-neutral-300">({distanceKm} km • ~{durationMin} min)</span>
                </div>
              </div>
            )}

            {/* Floating AI Grounding Assistant Trigger on Map */}
            <div className="absolute bottom-3 right-3 z-20 pointer-events-none">
              <button
                onClick={() => setShowGroundingModal(true)}
                className="pointer-events-auto bg-neutral-900/95 hover:bg-neutral-900 text-white px-3 py-2 rounded-2xl shadow-xl border border-neutral-700/80 flex items-center gap-2 text-xs font-bold active:scale-95 transition"
              >
                <Sparkles size={14} className="text-amber-400" />
                <span>IA Trafic & Lieux</span>
              </button>
            </div>
          </div>

          {/* Bottom Interactive Panel (When no active trip or during ordering) */}
          {tripStatus === 'IDLE' && (
            <div className="relative z-20 bg-white rounded-t-3xl shadow-2xl p-4 border-t border-neutral-200 flex flex-col max-h-[58%] overflow-y-auto no-scrollbar animate-in slide-in-from-bottom duration-300">
              {/* Drag indicator handle */}
              <div className="w-12 h-1 bg-neutral-300 rounded-full mx-auto mb-3" />

              {/* Case 1: No destination chosen yet */}
              {!destination ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-base text-neutral-900 font-display">
                      Où allez-vous à Kaolack ?
                    </h3>
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      Kaolack Ville uniquement
                    </span>
                  </div>

                  {/* Destination search bar button */}
                  <button
                    onClick={() => setShowSearchModal(true)}
                    className="w-full bg-neutral-50 hover:bg-neutral-100 p-3.5 rounded-2xl border border-neutral-200 flex items-center gap-3 transition text-left group shadow-xs"
                  >
                    <div className="w-8 h-8 rounded-xl bg-amber-400 text-neutral-950 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
                      <Search size={16} />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-bold text-neutral-800 block">
                        Rechercher une destination à Kaolack
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        Médina Baye, Marché Central, Kasnack, Léona, Ndorong...
                      </span>
                    </div>
                  </button>

                  {/* Google Grounding AI Assistant CTA */}
                  <button
                    onClick={() => setShowGroundingModal(true)}
                    className="w-full p-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/80 hover:border-amber-400 flex items-center justify-between text-left transition group shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-400 text-neutral-950 flex items-center justify-center font-bold text-xs group-hover:scale-105 transition">
                        <Sparkles size={16} />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-neutral-900">
                            Assistant IA Kaolack
                          </span>
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-neutral-900 text-amber-400">
                            Google Grounding
                          </span>
                        </div>
                        <span className="text-[10px] text-neutral-600 block mt-0.5">
                          Info trafic en direct & recherche de lieux à Kaolack
                        </span>
                      </div>
                    </div>
                    <ArrowRight size={16} className="text-amber-600 group-hover:translate-x-0.5 transition" />
                  </button>

                  {/* Composant EstimateurTarif (Calcul en direct sur la carte) */}
                  <EstimateurTarif onOpenSearch={() => setShowSearchModal(true)} />

                  {/* Quick popular shortcuts Kaolack */}
                  <div className="grid grid-cols-2 gap-2 mt-0.5">
                    <button
                      onClick={() => setDestination(KAOLACK_LOCATIONS[0])}
                      className="p-2.5 bg-neutral-50 hover:bg-amber-50/50 rounded-xl border border-neutral-200 flex items-center gap-2 text-left"
                    >
                      <MapPin size={15} className="text-amber-500" />
                      <div>
                        <div className="text-[11px] font-bold text-neutral-800">Médina Baye</div>
                        <div className="text-[9px] text-neutral-500">Grande Mosquée</div>
                      </div>
                    </button>

                    <button
                      onClick={() => setDestination(KAOLACK_LOCATIONS[1])}
                      className="p-2.5 bg-neutral-50 hover:bg-amber-50/50 rounded-xl border border-neutral-200 flex items-center gap-2 text-left"
                    >
                      <MapPin size={15} className="text-amber-500" />
                      <div>
                        <div className="text-[11px] font-bold text-neutral-800">Marché Central</div>
                        <div className="text-[9px] text-neutral-500">Av. Cheikh Ibrahima</div>
                      </div>
                    </button>
                  </div>

                  {/* Composant HistoriqueTrajets (Derniers trajets avec statut, date et prix) */}
                  <div className="pt-2 border-t border-neutral-100 mt-1">
                    <HistoriqueTrajets
                      maxItems={3}
                      onSelectDestination={(loc) => setDestination(loc)}
                      onViewAll={() => setActiveTab('trips')}
                    />
                  </div>
                </div>
              ) : (
                /* Case 2: Destination chosen, show categories & order button */
                <div className="flex flex-col gap-3">
                  {/* Itinerary bar */}
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                    <div className="flex items-center gap-2 flex-1 min-w-0 pr-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 flex-shrink-0" />
                      <div className="truncate">
                        <span className="text-[10px] text-neutral-400 uppercase font-bold block">
                          Destination sélectionnée
                        </span>
                        <span className="text-xs font-bold text-neutral-900 truncate block">
                          {destination.name}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowSearchModal(true)}
                      className="text-[11px] font-bold text-amber-600 hover:underline flex-shrink-0"
                    >
                      Modifier
                    </button>
                  </div>

                  {/* Composant EstimateurTarif (Calcul détaillé pour la destination choisie) */}
                  <EstimateurTarif onOpenSearch={() => setShowSearchModal(true)} />

                  {/* Distance & Duration Badge */}
                  <div className="flex items-center gap-3 text-xs bg-neutral-50 p-2 rounded-xl border border-neutral-200/80">
                    <span className="font-extrabold text-neutral-900">{distanceKm} km</span>
                    <span className="text-neutral-300">•</span>
                    <span className="font-semibold text-neutral-700">~{durationMin} min</span>
                    <span className="text-neutral-300">•</span>
                    <span className="text-emerald-600 font-semibold text-[11px]">Trafic fluide</span>
                  </div>

                  {/* Vehicle Categories Grid / List */}
                  <div className="space-y-2 max-h-44 overflow-y-auto no-scrollbar">
                    {VEHICLE_CATEGORIES.map((cat) => {
                      const isSelected = selectedCategory.id === cat.id;
                      const price = calculateCategoryPrice(cat);

                      return (
                        <div
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat)}
                          className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'border-amber-400 bg-amber-50/60 ring-2 ring-amber-400/20 shadow-xs'
                              : 'border-neutral-200 bg-white hover:bg-neutral-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-lg flex-shrink-0">
                              {cat.id === 'sama-moto-confort' ? '🛵' : cat.id === 'sama-moto-express' ? '📦' : '🏍️'}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-extrabold text-neutral-900">
                                  {cat.name}
                                </span>
                                <span className="text-[10px] text-neutral-400 flex items-center gap-0.5">
                                  <Users size={11} /> {cat.capacity}
                                </span>
                              </div>
                              <span className="text-[10px] text-neutral-500 block">
                                Arrivée : {cat.etaMinutes} min • Tarif : 200 FCFA/500m
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-black font-display text-neutral-900 block">
                              {price.toLocaleString('fr-FR')} FCFA
                            </span>
                            {appliedPromo && (
                              <span className="text-[9px] text-emerald-600 font-bold block">
                                -{appliedPromo.discountPercentage}% inclus
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Payment Method Selector Pill */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => setShowPaymentPicker(!showPaymentPicker)}
                      className="flex items-center gap-2 text-xs font-bold text-neutral-800 bg-neutral-50 hover:bg-neutral-100 px-3 py-1.5 rounded-xl border border-neutral-200 transition"
                    >
                      {selectedPayment === 'WAVE' ? (
                        <>
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                          <span>Paiement : Wave (0% frais)</span>
                        </>
                      ) : selectedPayment === 'ORANGE_MONEY' ? (
                        <>
                          <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                          <span>Paiement : Orange Money</span>
                        </>
                      ) : selectedPayment === 'CASH' ? (
                        <>
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                          <span>Paiement : Espèces</span>
                        </>
                      ) : (
                        <>
                          <span className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
                          <span>Paiement : Carte bancaire</span>
                        </>
                      )}
                    </button>

                    {appliedPromo && (
                      <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1">
                        <Tag size={12} />
                        <span>{appliedPromo.code}</span>
                      </span>
                    )}
                  </div>

                  {/* Payment choices drawer */}
                  {showPaymentPicker && (
                    <div className="grid grid-cols-2 gap-1.5 p-2 bg-neutral-100 rounded-xl">
                      <button
                        onClick={() => {
                          setSelectedPayment('WAVE');
                          setShowPaymentPicker(false);
                        }}
                        className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                          selectedPayment === 'WAVE' ? 'bg-blue-500 text-white' : 'bg-white text-neutral-800'
                        }`}
                      >
                        <span>Wave</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPayment('ORANGE_MONEY');
                          setShowPaymentPicker(false);
                        }}
                        className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                          selectedPayment === 'ORANGE_MONEY' ? 'bg-orange-500 text-white' : 'bg-white text-neutral-800'
                        }`}
                      >
                        <span>Orange Money</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPayment('CASH');
                          setShowPaymentPicker(false);
                        }}
                        className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                          selectedPayment === 'CASH' ? 'bg-emerald-600 text-white' : 'bg-white text-neutral-800'
                        }`}
                      >
                        <span>Espèces</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPayment('CARD');
                          setShowPaymentPicker(false);
                        }}
                        className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 ${
                          selectedPayment === 'CARD' ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-800'
                        }`}
                      >
                        <span>Carte</span>
                      </button>
                    </div>
                  )}

                  {/* Pricing Disclaimer (Prompt #15) */}
                  <p className="text-[10px] text-neutral-500 text-center">
                    « Le prix indiqué est une estimation et peut varier selon les conditions du trajet. »
                  </p>

                  {/* Order Button (Yellow & Large, Prompt #15 & #62) */}
                  <button
                    onClick={requestRide}
                    className="w-full h-13 bg-[#F5B800] hover:bg-amber-400 text-neutral-950 font-bold text-sm rounded-2xl shadow-lg transition active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <span>COMMANDER {selectedCategory.name.toUpperCase()}</span>
                    <span>•</span>
                    <span>{calculateCategoryPrice(selectedCategory).toLocaleString('fr-FR')} FCFA</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Active Ride Bottom Panel (if searching, assigned, arriving or in progress) */}
          {tripStatus !== 'IDLE' && <ActiveRideView />}

          {/* Ride Completed & Rating Modal */}
          {(tripStatus === 'TRIP_COMPLETED' || tripStatus === 'PAID') && <RideCompletedModal />}
        </div>
      )}

      {/* Destination Picker Modal */}
      {showSearchModal && (
        <SearchDestinationModal
          currentPickup={clientLocation}
          onSelectDestination={(loc) => {
            setDestination(loc);
            setShowSearchModal(false);
          }}
          onClose={() => setShowSearchModal(false)}
        />
      )}

      {/* Google Search & Maps Grounding Assistant Modal */}
      <GroundingAssistantModal
        isOpen={showGroundingModal}
        onClose={() => setShowGroundingModal(false)}
        onSelectDestination={(loc: LocationPoint) => {
          setDestination(loc);
          setShowGroundingModal(false);
        }}
      />

      {/* Bottom Android Navigation Bar (Prompt #63) */}
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
          onClick={() => setActiveTab('promos')}
          className={`flex flex-col items-center gap-0.5 transition ${
            activeTab === 'promos' ? 'text-amber-500 font-bold' : 'text-neutral-400 hover:text-neutral-700'
          }`}
        >
          <Tag size={18} />
          <span className="text-[10px]">Promos</span>
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

      {/* Driver Registration Modal (Strictly requires Driver's License) */}
      <DriverRegistrationModal
        isOpen={showDriverRegModal}
        onClose={() => setShowDriverRegModal(false)}
      />

      {/* Android Application Modal (APK & Native Files) */}
      <AndroidAppModal
        isOpen={showAndroidModal}
        onClose={() => setShowAndroidModal(false)}
      />
    </div>
  );
};
