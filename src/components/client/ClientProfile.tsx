import React, { useState } from 'react';
import { useTaxi } from '../../context/TaxiContext';
import { DriverRegistrationModal } from '../driver/DriverRegistrationModal';
import { PWAInstallButton } from '../common/PWAInstallButton';
import {
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Bell,
  HelpCircle,
  Globe,
  LogOut,
  ChevronRight,
  Shield,
  FileQuestion,
  Plus,
  Send,
  X,
  CheckCircle,
  Database,
  Sparkles,
  Lock,
  Bike,
  ShieldAlert,
  Smartphone,
} from 'lucide-react';

interface ClientProfileProps {
  onBack: () => void;
  onOpenHistory: () => void;
  onOpenPromos: () => void;
}

export const ClientProfile: React.FC<ClientProfileProps> = ({
  onBack,
  onOpenHistory,
  onOpenPromos,
}) => {
  const {
    tickets,
    createTicket,
    notifications,
    currentUser,
    loginWithGoogle,
    loginAsGuest,
    logout,
    firestoreConnected,
    setRole,
  } = useTaxi();
  const [language, setLanguage] = useState<'FR' | 'EN' | 'WO'>('FR');
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showDriverRegModal, setShowDriverRegModal] = useState(false);
  const [ticketCategory, setTicketCategory] = useState<'lost_item' | 'payment' | 'driver_behavior' | 'trip_issue'>('lost_item');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketCreatedSuccess, setTicketCreatedSuccess] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [showPaymentMethodsModal, setShowPaymentMethodsModal] = useState(false);

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    try {
      await loginWithGoogle();
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketDescription) return;

    createTicket({
      userId: 'client-ousmane',
      userName: 'Ousmane Fall',
      userType: 'client',
      category: ticketCategory,
      subject: ticketSubject,
      description: ticketDescription,
      status: 'open',
    });

    setTicketCreatedSuccess(true);
    setTimeout(() => {
      setTicketCreatedSuccess(false);
      setShowSupportModal(false);
      setTicketSubject('');
      setTicketDescription('');
    }, 1500);
  };

  return (
    <div className="flex-1 bg-neutral-50 flex flex-col p-4 select-none overflow-y-auto no-scrollbar">
      {/* Profile Header & Firebase Auth */}
      {currentUser ? (
        <div className="bg-white p-4 rounded-3xl border border-neutral-200 shadow-xs flex items-center gap-3.5 mb-4">
          <div className="relative">
            {currentUser.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName || 'Profil'}
                className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-amber-400 text-neutral-900 font-extrabold text-lg flex items-center justify-center border-2 border-white shadow-sm">
                {(currentUser.displayName || 'Client').slice(0, 2).toUpperCase()}
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 bg-neutral-900 text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              ★ 5.0
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-bold font-display text-neutral-900 truncate">
                {currentUser.displayName || 'Utilisateur SamaTaxi'}
              </h2>
            </div>
            <div className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5 truncate">
              <Mail size={11} className="flex-shrink-0" />
              <span className="truncate">{currentUser.email}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 font-semibold text-[10px] rounded-md border border-emerald-200">
                <CheckCircle size={10} />
                <span>Google Auth vérifié</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 font-semibold text-[10px] rounded-md border border-blue-200">
                <Database size={10} />
                <span>Firestore Sync</span>
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-4 rounded-3xl border border-amber-200 shadow-xs mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Lock size={20} />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-neutral-900 font-display">
                Connexion Google Firebase
              </h3>
              <p className="text-[11px] text-neutral-500 leading-tight">
                Connectez-vous pour synchroniser vos courses sur Cloud Firestore.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleGoogleLogin}
              disabled={authLoading}
              className="w-full py-2.5 px-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition"
            >
              {/* Google G logo */}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{authLoading ? 'Connexion...' : 'Se connecter avec Google (Firebase Auth)'}</span>
            </button>

            <button
              onClick={() => loginAsGuest()}
              className="w-full py-2 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-semibold text-xs text-center transition"
            >
              Continuer en mode invité (Anonyme Firebase)
            </button>
          </div>
        </div>
      )}

      {/* Connected APIs & Infrastructure Card */}
      <div className="bg-white p-3.5 rounded-3xl border border-neutral-200 shadow-xs mb-4">
        <h4 className="text-[11px] font-bold text-neutral-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Sparkles size={13} className="text-amber-500" />
          <span>APIs & Services Connectés</span>
        </h4>

        <div className="space-y-2">
          {/* Firebase */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-50 border border-neutral-100 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-[10px]">
                🔥
              </div>
              <div>
                <span className="font-bold text-neutral-900 block leading-tight">
                  Firebase Firestore & Auth
                </span>
                <span className="text-[10px] text-neutral-500 block">
                  Stockage persistant des courses & profil
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Connecté
            </span>
          </div>

          {/* Google Search Grounding */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-50 border border-neutral-100 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-[10px]">
                🌐
              </div>
              <div>
                <span className="font-bold text-neutral-900 block leading-tight">
                  Google Search Grounding
                </span>
                <span className="text-[10px] text-neutral-500 block">
                  gemini-3.5-flash avec googleSearch
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              Actif
            </span>
          </div>

          {/* Google Maps Grounding */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-50 border border-neutral-100 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-[10px]">
                📍
              </div>
              <div>
                <span className="font-bold text-neutral-900 block leading-tight">
                  Google Maps Grounding
                </span>
                <span className="text-[10px] text-neutral-500 block">
                  gemini-3.5-flash avec googleMaps
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Actif
            </span>
          </div>
        </div>
      </div>

      {/* Language Selector */}
      <div className="bg-white p-3 rounded-2xl border border-neutral-200 shadow-xs mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-neutral-800">
          <Globe size={16} className="text-amber-500" />
          <span>Langue de l’application</span>
        </div>

        <div className="flex bg-neutral-100 p-1 rounded-xl gap-1">
          <button
            onClick={() => setLanguage('FR')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition ${
              language === 'FR' ? 'bg-[#F5B800] text-neutral-950 shadow-sm' : 'text-neutral-600'
            }`}
          >
            🇫🇷 FR
          </button>
          <button
            onClick={() => setLanguage('WO')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition ${
              language === 'WO' ? 'bg-[#F5B800] text-neutral-950 shadow-sm' : 'text-neutral-600'
            }`}
          >
            🇸🇳 Wolof
          </button>
          <button
            onClick={() => setLanguage('EN')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition ${
              language === 'EN' ? 'bg-[#F5B800] text-neutral-950 shadow-sm' : 'text-neutral-600'
            }`}
          >
            🇬🇧 EN
          </button>
        </div>
      </div>

      {/* Call To Action: Devenir Chauffeur Moto */}
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-900 to-amber-950 p-4 rounded-3xl border-2 border-amber-400/50 shadow-md mb-4 text-white">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-neutral-950 flex items-center justify-center font-black shadow-md flex-shrink-0">
              <Bike size={22} />
            </div>
            <div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-400 text-neutral-950 uppercase tracking-wide">
                Opportunité Motard
              </span>
              <h3 className="text-sm font-extrabold text-white mt-1">
                Devenir Chauffeur Moto SamaTaxi
              </h3>
              <p className="text-[11px] text-neutral-300 mt-0.5 leading-snug">
                Tarif officiel garanti : <strong>200 FCFA chaque 500 mètres</strong>.
              </p>
              <div className="flex items-center gap-1.5 mt-2 text-[10px] text-amber-300 font-bold bg-amber-400/10 px-2 py-1 rounded-lg border border-amber-400/20">
                <ShieldAlert size={12} />
                <span>Permis de conduire STRICTEMENT obligatoire</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowDriverRegModal(true)}
          className="mt-3.5 w-full py-2.5 bg-[#F5B800] hover:bg-amber-500 text-neutral-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-98 cursor-pointer"
        >
          <Bike size={15} />
          <span>S’inscrire comme Chauffeur Moto (Permis exigé)</span>
        </button>
      </div>

      {/* PWA & Google Play Store Info Card */}
      <div className="bg-white p-3.5 rounded-3xl border border-neutral-200 shadow-xs mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-neutral-900 text-amber-400 flex items-center justify-center font-black text-xs">
            <Smartphone size={16} />
          </div>
          <div>
            <span className="text-xs font-bold text-neutral-900 block">
              Application & Play Store
            </span>
            <span className="text-[10px] text-neutral-500 block">
              PWA conforme & Google Play TWA
            </span>
          </div>
        </div>
        <PWAInstallButton />
      </div>

      {/* Menu Options List */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs divide-y divide-neutral-100 overflow-hidden mb-4">
        <button
          onClick={onOpenHistory}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-neutral-50 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              🚕
            </div>
            <span className="text-xs font-bold text-neutral-800">Mes courses effectuées</span>
          </div>
          <ChevronRight size={16} className="text-neutral-400" />
        </button>

        <button
          onClick={onOpenPromos}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-neutral-50 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              🎁
            </div>
            <span className="text-xs font-bold text-neutral-800">Promotions & Parrainage</span>
          </div>
          <ChevronRight size={16} className="text-neutral-400" />
        </button>

        <button
          onClick={() => setShowSupportModal(true)}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-neutral-50 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <FileQuestion size={16} />
            </div>
            <div>
              <span className="text-xs font-bold text-neutral-800 block">
                Signaler un problème ou objet perdu
              </span>
              <span className="text-[10px] text-neutral-400">Tickets d’assistance SamaTaxi</span>
            </div>
          </div>
          <ChevronRight size={16} className="text-neutral-400" />
        </button>

        <button
          type="button"
          onClick={() => setShowPaymentMethodsModal(true)}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-neutral-50 transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CreditCard size={16} />
            </div>
            <div>
              <span className="text-xs font-bold text-neutral-800 block">Moyens de paiement & APIs</span>
              <span className="text-[10px] text-neutral-400">Wave, Orange Money, Carte Bancaire, Espèces</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-emerald-600">Actifs</span>
            <ChevronRight size={16} className="text-neutral-400" />
          </div>
        </button>

        <div className="p-3.5 flex items-center justify-between text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Shield size={16} />
            </div>
            <span className="text-xs font-bold text-neutral-800">Sécurité & Confidentialité</span>
          </div>
          <ChevronRight size={16} className="text-neutral-400" />
        </div>
      </div>

      {/* Existing Support Tickets */}
      {tickets.length > 0 && (
        <div className="mb-4">
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block mb-2">
            Vos tickets de réclamation en cours
          </span>
          <div className="space-y-2">
            {tickets.map((tkt) => (
              <div
                key={tkt.id}
                className="bg-white p-3 rounded-2xl border border-neutral-200 text-xs shadow-2xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-amber-600 text-[10px]">
                    {tkt.ticketNumber}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      tkt.status === 'resolved'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {tkt.status === 'resolved' ? 'Résolu' : 'En cours de traitement'}
                  </span>
                </div>
                <div className="font-bold text-neutral-800">{tkt.subject}</div>
                <div className="text-[10px] text-neutral-500 mt-0.5 line-clamp-1">
                  {tkt.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Logout button */}
      {currentUser ? (
        <button
          onClick={handleLogout}
          className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition border border-red-200"
        >
          <LogOut size={16} />
          <span>Déconnexion de Google Firebase</span>
        </button>
      ) : (
        <button
          onClick={onBack}
          className="w-full py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition"
        >
          <ChevronRight size={16} className="rotate-180" />
          <span>Retour à l’accueil SamaTaxi</span>
        </button>
      )}

      {/* Modal: Moyens de paiement & APIs */}
      {showPaymentMethodsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 w-full max-w-sm border border-neutral-200 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowPaymentMethodsModal(false)}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <CreditCard size={18} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-neutral-900 font-display">
                  Moyens de paiement intégrés
                </h3>
                <p className="text-[10px] text-neutral-500">
                  APIs de transaction sécurisées pour le Sénégal
                </p>
              </div>
            </div>

            <div className="space-y-2.5 my-3">
              {/* Wave */}
              <div className="p-3 rounded-2xl border border-blue-200 bg-blue-50/60 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#1da1f2] text-white flex items-center justify-center font-black text-xs flex-shrink-0">
                  W
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900">Wave Sénégal</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      API Prête
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-600 mt-0.5">
                    Génération QR Code dynamique & Deep-Link direct vers l'application Wave. 0% de frais.
                  </p>
                </div>
              </div>

              {/* Orange Money */}
              <div className="p-3 rounded-2xl border border-orange-200 bg-orange-50/60 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#ff7900] text-white flex items-center justify-center font-black text-xs flex-shrink-0">
                  OM
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900">Orange Money Sénégal</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      API Prête
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-600 mt-0.5">
                    Web Payment avec code USSD (#144#) et validation OTP automatique.
                  </p>
                </div>
              </div>

              {/* Carte Bancaire */}
              <div className="p-3 rounded-2xl border border-neutral-200 bg-neutral-50 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center flex-shrink-0">
                  <CreditCard size={15} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900">Cartes Bancaires</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      3D-Secure
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-600 mt-0.5">
                    Visa, Mastercard, GIM-UEMOA. Chiffrement de bout en bout SSL 256-bit.
                  </p>
                </div>
              </div>

              {/* Espèces */}
              <div className="p-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">💵</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900">Espèces (Cash)</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Actif
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-600 mt-0.5">
                    Paiement direct en main propre auprès du chauffeur lors de l'arrivée.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowPaymentMethodsModal(false)}
              className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition"
            >
              Compris
            </button>
          </div>
        </div>
      )}

      {/* Support Ticket Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-base text-neutral-900 font-display">
                Ouvrir une réclamation
              </h3>
              <button
                onClick={() => setShowSupportModal(false)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X size={18} />
              </button>
            </div>

            {ticketCreatedSuccess ? (
              <div className="py-8 text-center flex flex-col items-center">
                <CheckCircle size={40} className="text-emerald-500 mb-2" />
                <h4 className="font-bold text-sm text-neutral-900">Ticket enregistré !</h4>
                <p className="text-xs text-neutral-500 mt-1">
                  Notre équipe de support à Kaolack vous contactera dans les plus brefs délais.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitTicket} className="mt-3 flex flex-col gap-3">
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                    Motif du signalement
                  </label>
                  <select
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value as any)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-400"
                  >
                    <option value="lost_item">Objet oublié à bord</option>
                    <option value="trip_issue">Problème sur le trajet</option>
                    <option value="payment">Erreur de paiement (Wave/OM)</option>
                    <option value="driver_behavior">Comportement du chauffeur</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                    Objet du message
                  </label>
                  <input
                    type="text"
                    required
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="Ex: Téléphone oublié sur la banquette"
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                    Description détaillée
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={ticketDescription}
                    onChange={(e) => setTicketDescription(e.target.value)}
                    placeholder="Précisez les détails du trajet et les faits..."
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 w-full py-3 bg-[#F5B800] hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl shadow-sm transition"
                >
                  TRANSMETTRE LA RÉCLAMATION
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal Inscription Chauffeur Moto */}
      <DriverRegistrationModal
        isOpen={showDriverRegModal}
        onClose={() => setShowDriverRegModal(false)}
        onSuccessSwitchRole={() => {
          setShowDriverRegModal(false);
          setRole('driver');
        }}
      />
    </div>
  );
};
