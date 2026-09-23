import React, { useState, useEffect } from 'react';
import { SamaLogo } from '../common/SamaLogo';
import { Phone, Lock, User, ArrowLeft, CheckCircle2, MapPin, Sparkles } from 'lucide-react';

interface ClientAuthModalProps {
  initialMode?: 'register' | 'login' | 'location';
  onSuccess: () => void;
  onCancel: () => void;
}

export const ClientAuthModal: React.FC<ClientAuthModalProps> = ({
  initialMode = 'login',
  onSuccess,
  onCancel,
}) => {
  const [step, setStep] = useState<'auth' | 'otp' | 'location'>(
    initialMode === 'location' ? 'location' : 'auth'
  );
  const [isRegister, setIsRegister] = useState(initialMode === 'register');
  const [phoneNumber, setPhoneNumber] = useState('77 500 12 34');
  const [firstName, setFirstName] = useState('Ousmane');
  const [lastName, setLastName] = useState('Fall');
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(30);
  const [termsAccepted, setTermsAccepted] = useState(true);

  // OTP Countdown timer
  useEffect(() => {
    if (step === 'otp' && countdown > 0) {
      const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [step, countdown]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setCountdown(30);
    setStep('otp');
    // Pre-fill demo OTP code
    setOtpValues(['2', '0', '2', '6', '0', '9']);
  };

  const handleVerifyOtp = () => {
    setStep('location');
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const updated = [...otpValues];
    updated[index] = val;
    setOtpValues(updated);
  };

  const handleLocationGrant = () => {
    onSuccess();
  };

  return (
    <div className="absolute inset-0 bg-white z-50 flex flex-col p-6 select-none overflow-y-auto no-scrollbar">
      {/* Top back button */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={step === 'otp' ? () => setStep('auth') : onCancel}
          className="p-2 -ml-2 text-neutral-700 hover:text-neutral-900 rounded-full hover:bg-neutral-100"
        >
          <ArrowLeft size={20} />
        </button>
        <SamaLogo size="sm" />
        <div className="w-8" />
      </div>

      {/* Step 1: Form Login or Register */}
      {step === 'auth' && (
        <div className="my-auto flex flex-col">
          <div className="mb-6">
            <h2 className="text-2xl font-bold font-display text-neutral-900">
              {isRegister ? 'Créer un compte' : 'Bon retour !'}
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              {isRegister
                ? 'Remplissez vos informations pour commander en 1 clic.'
                : 'Connectez-vous avec votre numéro de téléphone sénégalais.'}
            </p>
          </div>

          <form onSubmit={handleSendOtp} className="flex flex-col gap-3.5">
            {isRegister && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Prénom
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-3 text-neutral-400" />
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Ousmane"
                      className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium focus:outline-none focus:border-amber-400 focus:bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Fall"
                    className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium focus:outline-none focus:border-amber-400 focus:bg-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                Numéro de téléphone
              </label>
              <div className="flex gap-2">
                <div className="flex items-center gap-1 px-3 py-2.5 bg-neutral-100 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-700">
                  <span>🇸🇳</span>
                  <span>+221</span>
                </div>
                <div className="relative flex-1">
                  <Phone size={15} className="absolute left-3 top-3 text-neutral-400" />
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="77 000 00 00"
                    className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium focus:outline-none focus:border-amber-400 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-3 text-neutral-400" />
                <input
                  type="password"
                  required
                  defaultValue="••••••••"
                  placeholder="Votre mot de passe"
                  className="w-full pl-9 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium focus:outline-none focus:border-amber-400 focus:bg-white"
                />
              </div>
            </div>

            {isRegister && (
              <label className="flex items-center gap-2 mt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-400 h-4 w-4"
                />
                <span className="text-[11px] text-neutral-600">
                  J’accepte les{' '}
                  <span className="text-amber-600 font-semibold underline">
                    conditions d’utilisation
                  </span>
                </span>
              </label>
            )}

            <button
              type="submit"
              className="mt-2 w-full h-12 bg-[#F5B800] hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl shadow-md transition active:scale-[0.98]"
            >
              {isRegister ? 'CRÉER MON COMPTE' : 'SE CONNECTER'}
            </button>
          </form>

          {/* Google Sign-In divider & button */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-white px-2 text-neutral-400 font-bold tracking-wider">
                ou continuer avec
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              // Sign in with Google account (boogi575@gmail.com)
              onSuccess();
            }}
            className="w-full h-11 bg-white hover:bg-neutral-50 text-neutral-700 font-bold text-xs rounded-xl border border-neutral-300 shadow-sm flex items-center justify-center gap-2.5 transition active:scale-[0.98]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.27 21.36 7.35 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.27 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continuer avec mon compte Google</span>
          </button>

          <div className="mt-5 text-center">
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs text-neutral-600 hover:text-neutral-900"
            >
              {isRegister ? (
                <>
                  Vous avez déjà un compte ?{' '}
                  <span className="font-bold text-amber-600">Se connecter</span>
                </>
              ) : (
                <>
                  Nouveau sur SamaTaxi ?{' '}
                  <span className="font-bold text-amber-600">Créer un compte</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 2: OTP Verification */}
      {step === 'otp' && (
        <div className="my-auto flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
            <Lock size={26} />
          </div>

          <h2 className="text-xl font-bold font-display text-neutral-900">
            Vérifiez votre numéro
          </h2>
          <p className="text-xs text-neutral-500 mt-1 max-w-xs">
            Nous avons envoyé un code de vérification SMS à 6 chiffres au{' '}
            <span className="font-bold text-neutral-800">+221 {phoneNumber}</span>
          </p>

          {/* 6 Digit Input Boxes */}
          <div className="flex gap-2 my-6">
            {otpValues.map((v, i) => (
              <input
                key={i}
                type="text"
                maxLength={1}
                value={v}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                className="w-10 h-12 text-center text-lg font-bold bg-neutral-50 border-2 border-neutral-200 rounded-xl focus:border-amber-400 focus:bg-white focus:outline-none"
              />
            ))}
          </div>

          {/* Auto fill quick demo button */}
          <button
            onClick={() => setOtpValues(['2', '0', '2', '6', '0', '9'])}
            className="text-[11px] text-amber-600 font-semibold mb-4 flex items-center gap-1 hover:underline"
          >
            <Sparkles size={12} />
            <span>Remplir code de test (202609)</span>
          </button>

          <button
            onClick={handleVerifyOtp}
            className="w-full h-12 bg-[#F5B800] hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl shadow-md transition active:scale-[0.98]"
          >
            VÉRIFIER LE CODE
          </button>

          <div className="mt-4 text-xs text-neutral-500">
            {countdown > 0 ? (
              <span>Renvoyer le code dans {countdown}s</span>
            ) : (
              <button
                onClick={() => setCountdown(30)}
                className="font-bold text-amber-600 hover:underline"
              >
                Renvoyer le code
              </button>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Location Permission */}
      {step === 'location' && (
        <div className="my-auto flex flex-col items-center text-center">
          <div className="relative mb-5">
            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 animate-pulse">
              <MapPin size={36} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white">
              <CheckCircle2 size={16} />
            </div>
          </div>

          <h2 className="text-xl font-bold font-display text-neutral-900">
            Activez votre localisation
          </h2>
          <p className="text-xs text-neutral-600 mt-2 max-w-xs leading-relaxed">
            SamaTaxi utilise votre position GPS à Dakar pour localiser votre chauffeur,
            calculer l’itinéraire optimal et vous garantir une prise en charge rapide.
          </p>

          <div className="mt-8 flex flex-col gap-2.5 w-full">
            <button
              onClick={handleLocationGrant}
              className="w-full h-12 bg-[#F5B800] hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl shadow-md transition active:scale-[0.98]"
            >
              AUTORISER LA LOCALISATION
            </button>
            <button
              onClick={handleLocationGrant}
              className="w-full h-11 bg-white hover:bg-neutral-50 text-neutral-600 font-semibold text-xs rounded-xl border border-neutral-200 transition"
            >
              Plus tard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
