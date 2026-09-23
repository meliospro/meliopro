import React, { useState } from 'react';
import { useTaxi } from '../../context/TaxiContext';
import {
  Phone,
  MessageSquare,
  ShieldAlert,
  Share2,
  X,
  Check,
  AlertTriangle,
  Send,
  Navigation2,
  Clock,
  MapPin,
  Bike,
} from 'lucide-react';

export const ActiveRideView: React.FC = () => {
  const {
    activeTrip,
    tripStatus,
    cancelRide,
    driverStartTrip,
    driverCompleteTrip,
  } = useTaxi();

  const [showSosModal, setShowSosModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'driver', text: 'Bonjour ! Je suis en route, j’arrive dans environ 4 minutes.', time: '12:46' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [copiedShare, setCopiedShare] = useState(false);

  if (!activeTrip) return null;

  const driver = activeTrip.driver;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { sender: 'client', text: chatInput.trim(), time: '12:47' },
    ]);
    setChatInput('');
    // Driver reply after 1s
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'driver', text: 'Bien reçu, je me gare devant le portail !', time: '12:47' },
      ]);
    }, 1200);
  };

  const shareText = `Je suis à bord d'une moto-taxi SamaTaxi avec ${driver?.name || 'Mamadou Ndiaye'} (${driver?.car.model} ${driver?.car.color}, plaque ${driver?.car.plate}). En route vers ${activeTrip.destination.name}. Suivez mon trajet en direct : https://samataxi.sn/track/${activeTrip.id}`;

  const handleCopyShare = () => {
    navigator.clipboard?.writeText(shareText);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-30 flex flex-col pointer-events-auto select-none">
      {/* 1. SEARCHING DRIVER STATE */}
      {tripStatus === 'SEARCHING_DRIVER' && (
        <div className="bg-white rounded-t-3xl shadow-2xl p-6 border-t border-neutral-200 animate-in slide-in-from-bottom duration-300">
          <div className="flex flex-col items-center text-center">
            {/* Radar Animation */}
            <div className="relative w-20 h-20 flex items-center justify-center my-2">
              <div className="absolute inset-0 rounded-full bg-amber-400/20 animate-ping" />
              <div className="absolute inset-2 rounded-full bg-amber-400/30 animate-pulse" />
              <div className="relative z-10 w-12 h-12 rounded-full bg-[#F5B800] text-neutral-900 flex items-center justify-center shadow-md">
                <Bike size={24} />
              </div>
            </div>

            <h3 className="font-bold text-lg font-display text-neutral-900 mt-2">
              Recherche d’un motard...
            </h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-xs">
              Nous contactons les conducteurs de moto Jakarta SamaTaxi les plus proches à Kaolack.
            </p>

            {/* Trip details pill */}
            <div className="mt-4 w-full bg-neutral-50 p-3 rounded-2xl border border-neutral-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-neutral-800">{activeTrip.category.name}</span>
                <span className="text-neutral-400">•</span>
                <span className="text-neutral-600">{activeTrip.distanceKm} km</span>
              </div>
              <div className="font-bold text-amber-600">
                {activeTrip.estimatedPrice.toLocaleString('fr-FR')} FCFA
              </div>
            </div>

            {/* Cancel Button */}
            <button
              onClick={cancelRide}
              className="mt-4 w-full py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs rounded-xl transition"
            >
              ANNULER LA DEMANDE
            </button>
          </div>
        </div>
      )}

      {/* 2. DRIVER ASSIGNED & ARRIVING STATE */}
      {(tripStatus === 'DRIVER_ASSIGNED' || tripStatus === 'DRIVER_ARRIVING' || tripStatus === 'DRIVER_ARRIVED') && (
        <div className="bg-white rounded-t-3xl shadow-2xl p-5 border-t border-neutral-200 animate-in slide-in-from-bottom duration-300">
          {/* Driver Arrived Notification Alert Banner */}
          {tripStatus === 'DRIVER_ARRIVED' && (
            <div className="mb-4 bg-emerald-500 text-white p-3 rounded-2xl flex items-center justify-between shadow-md animate-bounce">
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="text-base">🔔</span>
                <span>Votre motard est arrivé avec votre casque de protection !</span>
              </div>
            </div>
          )}

          {/* Status Header */}
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                {tripStatus === 'DRIVER_ARRIVED' ? 'Prêt pour le départ' : 'Votre motard arrive'}
              </span>
              <div className="text-sm font-extrabold text-neutral-900 flex items-center gap-1.5 mt-0.5">
                <Clock size={14} className="text-neutral-500" />
                <span>{tripStatus === 'DRIVER_ARRIVED' ? 'Sur place avec casque' : 'Arrivée dans ~3 min'}</span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-bold text-neutral-900">
                {activeTrip.estimatedPrice.toLocaleString('fr-FR')} FCFA
              </div>
              <div className="text-[10px] text-neutral-500">
                {activeTrip.paymentMethod === 'WAVE' ? 'Payé via Wave' : activeTrip.paymentMethod === 'ORANGE_MONEY' ? 'Orange Money' : 'En espèces'}
              </div>
            </div>
          </div>

          {/* Driver & Car Card */}
          <div className="my-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={driver?.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                  alt={driver?.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-sm"
                />
                <span className="absolute -bottom-1 -right-1 bg-amber-400 text-neutral-950 text-[10px] font-extrabold px-1 rounded-full flex items-center">
                  ★ {driver?.rating || 4.8}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-neutral-900">{driver?.name}</h4>
                <div className="text-[11px] text-neutral-600 mt-0.5 font-medium">
                  {driver?.car.brand} {driver?.car.model} • {driver?.car.color}
                </div>
                <div className="inline-block mt-0.5 px-2 py-0.5 bg-neutral-900 text-amber-400 font-mono font-bold text-[10px] rounded-md tracking-wider">
                  {driver?.car.plate}
                </div>
              </div>
            </div>

            {/* Action buttons: Call & Message */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowChatModal(true)}
                className="w-10 h-10 rounded-full bg-neutral-100 hover:bg-amber-100 text-neutral-800 hover:text-amber-800 flex items-center justify-center transition"
                title="Envoyer un message"
              >
                <MessageSquare size={18} />
              </button>
              <a
                href={`tel:${driver?.phone || '+221770000000'}`}
                className="w-10 h-10 rounded-full bg-[#F5B800] hover:bg-amber-400 text-neutral-950 flex items-center justify-center shadow-sm transition"
                title="Appeler le chauffeur"
              >
                <Phone size={18} />
              </a>
            </div>
          </div>

          {/* Quick Simulation Trigger for testing */}
          {tripStatus === 'DRIVER_ARRIVED' && (
            <button
              onClick={driverStartTrip}
              className="w-full mt-2 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-amber-400 font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
            >
              <span>Monter à bord & Démarrer la course</span>
              <Navigation2 size={14} />
            </button>
          )}

          {tripStatus !== 'DRIVER_ARRIVED' && (
            <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-500 pt-2 border-t border-neutral-100">
              <span className="flex items-center gap-1">
                <MapPin size={12} className="text-amber-500" />
                <span>{activeTrip.pickup.name}</span>
              </span>
              <button
                onClick={cancelRide}
                className="text-red-500 font-semibold hover:underline"
              >
                Annuler
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. TRIP STARTED (ON THE WAY) STATE */}
      {tripStatus === 'TRIP_STARTED' && (
        <div className="bg-white rounded-t-3xl shadow-2xl p-5 border-t border-neutral-200 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-extrabold text-neutral-900 uppercase tracking-wide">
                Course en cours
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-xs text-neutral-900">
              <Clock size={13} className="text-amber-500" />
              <span>{Math.max(activeTrip.durationMin - Math.round((activeTrip.routeProgress || 0) * 0.2), 2)} min restantes</span>
            </div>
          </div>

          {/* Destination & Meter */}
          <div className="my-3">
            <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
              Destination
            </div>
            <div className="text-sm font-bold text-neutral-900 mt-0.5 truncate">
              {activeTrip.destination.name}
            </div>

            {/* Route Progress Bar */}
            <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden mt-3">
              <div
                className="bg-amber-400 h-full transition-all duration-500 rounded-full"
                style={{ width: `${activeTrip.routeProgress || 15}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-neutral-500 mt-1 font-medium">
              <span>Prise en charge</span>
              <span>Progression : {activeTrip.routeProgress || 15}%</span>
              <span>Arrivée</span>
            </div>
          </div>

          {/* Action Tools: Urgence SOS & Partager mon trajet */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              onClick={() => setShowShareModal(true)}
              className="py-2.5 px-3 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-xl text-neutral-800 text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <Share2 size={14} className="text-amber-600" />
              <span>Partager trajet</span>
            </button>

            <button
              onClick={() => setShowSosModal(true)}
              className="py-2.5 px-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl text-red-600 text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <ShieldAlert size={14} className="text-red-600" />
              <span>🆘 Urgence</span>
            </button>
          </div>

          {/* Quick Simulation button for developer / evaluator */}
          <button
            onClick={driverCompleteTrip}
            className="w-full mt-3 py-2 bg-neutral-900 hover:bg-neutral-800 text-amber-400 font-bold text-[11px] rounded-lg transition"
          >
            Arrivé à destination (Terminer la course)
          </button>
        </div>
      )}

      {/* CHAT MODAL */}
      {showChatModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[460px]">
            {/* Header */}
            <div className="bg-neutral-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={driver?.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'}
                  alt={driver?.name}
                  className="w-8 h-8 rounded-full object-cover border border-amber-400"
                />
                <div>
                  <h4 className="text-xs font-bold">{driver?.name}</h4>
                  <div className="text-[10px] text-amber-400">En route • {driver?.car.plate}</div>
                </div>
              </div>
              <button
                onClick={() => setShowChatModal(false)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-3 overflow-y-auto no-scrollbar space-y-2 bg-neutral-50 text-xs">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === 'client' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[75%] p-2.5 rounded-2xl ${
                      msg.sender === 'client'
                        ? 'bg-amber-400 text-neutral-950 font-medium rounded-br-none'
                        : 'bg-white text-neutral-900 border border-neutral-200 shadow-sm rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-neutral-400 mt-0.5 px-1">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-2 border-t border-neutral-200 bg-white flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Votre message au chauffeur..."
                className="flex-1 bg-neutral-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:bg-white border border-transparent focus:border-amber-400"
              />
              <button
                type="submit"
                className="w-9 h-9 rounded-xl bg-amber-400 hover:bg-amber-500 text-neutral-950 flex items-center justify-center flex-shrink-0"
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SHARE TRIP MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
              <Share2 size={24} />
            </div>
            <h3 className="font-bold text-base text-neutral-900 font-display">
              Partager mon trajet
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Partagez votre position en direct, le nom du chauffeur et la plaque à vos proches via WhatsApp ou SMS.
            </p>

            <div className="my-4 p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-[11px] text-left text-neutral-700 max-h-24 overflow-y-auto">
              {shareText}
            </div>

            <div className="flex flex-col gap-2">
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
              >
                <span>Partager sur WhatsApp</span>
              </a>

              <button
                onClick={handleCopyShare}
                className="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
              >
                {copiedShare ? <Check size={14} className="text-emerald-600" /> : null}
                <span>{copiedShare ? 'Lien copié dans le presse-papier !' : 'Copier le lien de suivi'}</span>
              </button>

              <button
                onClick={() => setShowShareModal(false)}
                className="w-full py-2 text-xs text-neutral-500 font-medium hover:text-neutral-800"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SOS EMERGENCY MODAL */}
      {showSosModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3 animate-pulse">
              <AlertTriangle size={28} />
            </div>
            <h3 className="font-bold text-lg text-neutral-900 font-display">
              Centre de Sécurité & Urgence
            </h3>
            <p className="text-xs text-neutral-600 mt-1">
              Que souhaitez-vous faire ? Votre position GPS à Kaolack est sécurisée.
            </p>

            <div className="my-4 flex flex-col gap-2 text-left">
              <a
                href="tel:17"
                className="p-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl flex items-center justify-between text-red-700 text-xs font-bold"
              >
                <span>Appeler la Police / Gendarmerie (17)</span>
                <Phone size={15} />
              </a>

              <a
                href="tel:18"
                className="p-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl flex items-center justify-between text-red-700 text-xs font-bold"
              >
                <span>Appeler les Sapeurs-Pompiers (18)</span>
                <Phone size={15} />
              </a>

              <button
                onClick={() => {
                  setShowSosModal(false);
                  setShowShareModal(true);
                }}
                className="p-3 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-xl flex items-center justify-between text-neutral-800 text-xs font-bold"
              >
                <span>Partager ma position d’urgence</span>
                <Share2 size={15} />
              </button>
            </div>

            <button
              onClick={() => setShowSosModal(false)}
              className="w-full py-2.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-semibold text-xs rounded-xl"
            >
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
