import React, { useState, useEffect } from 'react';
import { PaymentMethod } from '../../types';
import { WaveQRCode } from './WaveQRCode';
import {
  createWaveSession,
  verifyWavePayment,
  requestOrangeMoneyOtp,
  verifyOrangeMoneyOtp,
  processCardPayment,
  recordFirestorePaymentTransaction,
  WaveSessionResponse,
  OrangeMoneyInitiateResponse,
  PaymentReceipt,
} from '../../services/paymentApi';
import {
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Loader2,
  ShieldCheck,
  Lock,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';

interface DigitalPaymentViewProps {
  tripId: string;
  amount: number;
  initialMethod?: PaymentMethod;
  clientPhone?: string;
  clientName?: string;
  onSuccess: (receipt: PaymentReceipt) => void;
  onCancel?: () => void;
}

export const DigitalPaymentView: React.FC<DigitalPaymentViewProps> = ({
  tripId,
  amount,
  initialMethod = 'WAVE',
  clientPhone = '+221 77 500 12 34',
  clientName = 'Client SamaTaxi',
  onSuccess,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(initialMethod);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Wave state
  const [waveSession, setWaveSession] = useState<WaveSessionResponse | null>(null);
  const [waveCountdown, setWaveCountdown] = useState(600);

  // Orange Money state
  const [omPhone, setOmPhone] = useState(clientPhone);
  const [omSession, setOmSession] = useState<OrangeMoneyInitiateResponse | null>(null);
  const [omOtp, setOmOtp] = useState('');

  // Card state
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardHolder, setCardHolder] = useState(clientName || 'OUSMANE FALL');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');

  // Success receipt
  const [completedReceipt, setCompletedReceipt] = useState<PaymentReceipt | null>(null);

  // Auto-initiate Wave session if Wave selected
  useEffect(() => {
    if (selectedMethod === 'WAVE' && !waveSession && !completedReceipt) {
      handleInitWave();
    }
  }, [selectedMethod]);

  // Wave countdown timer
  useEffect(() => {
    if (!waveSession || waveCountdown <= 0) return;
    const timer = setInterval(() => {
      setWaveCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [waveSession, waveCountdown]);

  // 1. Initialize Wave Checkout
  const handleInitWave = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const session = await createWaveSession(tripId, amount, clientPhone, clientName);
      setWaveSession(session);
      setWaveCountdown(session.expiresInSeconds || 600);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erreur lors de la génération de session Wave.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify Wave Payment
  const handleVerifyWave = async () => {
    if (!waveSession) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const receipt = await verifyWavePayment(waveSession.transactionId);
      setCompletedReceipt(receipt);
      await recordFirestorePaymentTransaction(receipt, tripId, { phone: clientPhone, name: clientName });
      setTimeout(() => onSuccess(receipt), 1000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Paiement non encore détecté. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Initiate Orange Money
  const handleRequestOrangeMoney = async () => {
    if (!omPhone.trim()) {
      setErrorMessage('Numéro de téléphone requis');
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await requestOrangeMoneyOtp(tripId, amount, omPhone);
      setOmSession(res);
      setOmOtp(res.demoOtp || '');
    } catch (err: any) {
      setErrorMessage(err.message || 'Erreur Orange Money.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Verify Orange Money OTP
  const handleVerifyOrangeMoney = async () => {
    if (!omSession || !omOtp.trim()) {
      setErrorMessage('Code OTP requis');
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    try {
      const receipt = await verifyOrangeMoneyOtp(omSession.transactionId, omOtp);
      setCompletedReceipt(receipt);
      await recordFirestorePaymentTransaction(receipt, tripId, { phone: omPhone, name: clientName });
      setTimeout(() => onSuccess(receipt), 1000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Code OTP Orange Money incorrect.');
    } finally {
      setLoading(false);
    }
  };

  // 5. Charge Card
  const handleChargeCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    try {
      const receipt = await processCardPayment(tripId, amount, {
        cardNumber,
        cardHolder,
        expiry: cardExpiry,
        cvv: cardCvv,
      });
      setCompletedReceipt(receipt);
      await recordFirestorePaymentTransaction(receipt, tripId, { phone: clientPhone, name: cardHolder });
      setTimeout(() => onSuccess(receipt), 1000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Échec de débit par carte bancaire.');
    } finally {
      setLoading(false);
    }
  };

  // 6. Cash Confirmation
  const handlePayCash = async () => {
    setLoading(true);
    const mockReceipt: PaymentReceipt = {
      success: true,
      transactionId: `CASH-${Date.now().toString(36).toUpperCase()}`,
      status: 'completed',
      paymentMethod: 'CASH',
      receiptNumber: `REC-CSH-${Date.now().toString().slice(-6)}`,
      amount,
      currency: 'XOF',
      timestamp: new Date().toISOString(),
    };
    setCompletedReceipt(mockReceipt);
    await recordFirestorePaymentTransaction(mockReceipt, tripId, { phone: clientPhone, name: clientName });
    setTimeout(() => {
      setLoading(false);
      onSuccess(mockReceipt);
    }, 600);
  };

  // Format Card Number
  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  // Detect Brand
  const cleanNum = cardNumber.replace(/\s+/g, '');
  const isMastercard = cleanNum.startsWith('5') || cleanNum.startsWith('2');
  const isVisa = cleanNum.startsWith('4');

  return (
    <div className="w-full flex flex-col space-y-4 text-left">
      {/* Method Selector Tabs */}
      <div>
        <label className="text-xs font-bold text-neutral-800 block mb-2">
          Sélectionnez votre moyen de paiement :
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Wave */}
          <button
            type="button"
            onClick={() => {
              setSelectedMethod('WAVE');
              setErrorMessage(null);
            }}
            className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1.5 transition ${
              selectedMethod === 'WAVE'
                ? 'border-[#1da1f2] bg-blue-50/70 shadow-sm ring-2 ring-blue-400/30'
                : 'border-neutral-200 bg-white hover:bg-neutral-50'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-[#1da1f2] text-white flex items-center justify-center font-black text-xs shadow-xs">
              W
            </div>
            <div className="text-center">
              <span className="text-[11px] font-bold text-neutral-900 block leading-tight">Wave</span>
              <span className="text-[9px] text-[#1da1f2] font-semibold">0% frais</span>
            </div>
          </button>

          {/* Orange Money */}
          <button
            type="button"
            onClick={() => {
              setSelectedMethod('ORANGE_MONEY');
              setErrorMessage(null);
            }}
            className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1.5 transition ${
              selectedMethod === 'ORANGE_MONEY'
                ? 'border-[#ff7900] bg-orange-50/70 shadow-sm ring-2 ring-orange-400/30'
                : 'border-neutral-200 bg-white hover:bg-neutral-50'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-[#ff7900] text-white flex items-center justify-center font-black text-xs shadow-xs">
              OM
            </div>
            <div className="text-center">
              <span className="text-[11px] font-bold text-neutral-900 block leading-tight">Orange Money</span>
              <span className="text-[9px] text-[#ff7900] font-semibold">Code / USSD</span>
            </div>
          </button>

          {/* Card */}
          <button
            type="button"
            onClick={() => {
              setSelectedMethod('CARD');
              setErrorMessage(null);
            }}
            className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1.5 transition ${
              selectedMethod === 'CARD'
                ? 'border-neutral-900 bg-neutral-100 shadow-sm ring-2 ring-neutral-400/30'
                : 'border-neutral-200 bg-white hover:bg-neutral-50'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center shadow-xs">
              <CreditCard size={15} />
            </div>
            <div className="text-center">
              <span className="text-[11px] font-bold text-neutral-900 block leading-tight">Carte Bancaire</span>
              <span className="text-[9px] text-neutral-500 font-semibold">Visa / GIM</span>
            </div>
          </button>

          {/* Cash */}
          <button
            type="button"
            onClick={() => {
              setSelectedMethod('CASH');
              setErrorMessage(null);
            }}
            className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1.5 transition ${
              selectedMethod === 'CASH'
                ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-400/30'
                : 'border-neutral-200 bg-white hover:bg-neutral-50'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Banknote size={15} />
            </div>
            <div className="text-center">
              <span className="text-[11px] font-bold text-neutral-900 block leading-tight">Espèces</span>
              <span className="text-[9px] text-emerald-700 font-semibold">Au chauffeur</span>
            </div>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle size={15} className="flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* METHOD 1: WAVE SENEGAL */}
      {selectedMethod === 'WAVE' && (
        <div className="bg-gradient-to-b from-blue-50/60 to-white border border-blue-200 rounded-2xl p-4 flex flex-col items-center text-center space-y-3">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1da1f2] animate-pulse" />
              <span className="text-xs font-bold text-neutral-900 font-display">
                API Wave Checkout Sénégal
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-neutral-500 font-mono">
              <Clock size={12} />
              <span>{Math.floor(waveCountdown / 60)}:{(waveCountdown % 60).toString().padStart(2, '0')}</span>
            </div>
          </div>

          {loading && !waveSession ? (
            <div className="py-8 flex flex-col items-center justify-center gap-2">
              <Loader2 size={24} className="animate-spin text-[#1da1f2]" />
              <span className="text-xs text-neutral-500">Génération du QR Code Wave sécurisé...</span>
            </div>
          ) : (
            <>
              {/* QR Code */}
              {waveSession && (
                <div className="my-1">
                  <WaveQRCode data={waveSession.qrPayload} size={150} />
                  <p className="text-[10px] text-neutral-500 mt-2">
                    Scannez ce code avec votre application mobile <b>Wave Sénégal</b>
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="w-full flex flex-col gap-2 pt-1">
                {waveSession && (
                  <a
                    href={waveSession.waveLaunchUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-3 bg-[#1da1f2] hover:bg-[#1991db] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition"
                  >
                    <span>Ouvrir l'application Wave</span>
                    <ExternalLink size={13} />
                  </a>
                )}

                <button
                  type="button"
                  onClick={handleVerifyWave}
                  disabled={loading}
                  className="w-full py-2.5 px-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs active:scale-95 transition disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 size={14} className="animate-spin text-amber-400" />
                  ) : (
                    <CheckCircle2 size={14} className="text-emerald-400" />
                  )}
                  <span>Confirmer le paiement Wave ({amount.toLocaleString('fr-FR')} FCFA)</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* METHOD 2: ORANGE MONEY */}
      {selectedMethod === 'ORANGE_MONEY' && (
        <div className="bg-gradient-to-b from-orange-50/60 to-white border border-orange-200 rounded-2xl p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff7900] animate-pulse" />
              <span className="text-xs font-bold text-neutral-900 font-display">
                API Orange Money Sénégal
              </span>
            </div>
            <span className="text-[10px] text-[#ff7900] font-bold px-2 py-0.5 rounded-full bg-orange-100">
              Web Payment API
            </span>
          </div>

          {!omSession ? (
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                  Numéro de téléphone Orange Money
                </label>
                <div className="relative">
                  <Smartphone size={15} className="absolute left-3 top-3 text-neutral-400" />
                  <input
                    type="text"
                    value={omPhone}
                    onChange={(e) => setOmPhone(e.target.value)}
                    placeholder="+221 77 000 00 00"
                    className="w-full pl-9 pr-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-mono font-bold text-neutral-900 focus:outline-none focus:border-[#ff7900]"
                  />
                </div>
                <span className="text-[10px] text-neutral-500 block mt-1">
                  Prélèvement direct avec validation USSD ou SMS
                </span>
              </div>

              <button
                type="button"
                onClick={handleRequestOrangeMoney}
                disabled={loading}
                className="w-full py-2.5 bg-[#ff7900] hover:bg-[#e06b00] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition active:scale-95 disabled:opacity-60"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
                <span>Demander le code d'autorisation OM</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3 animate-in fade-in">
              <div className="bg-white border border-neutral-200 rounded-xl p-3 text-xs space-y-1">
                <div className="flex items-center justify-between text-neutral-500 text-[10px]">
                  <span>Code USSD Orange :</span>
                  <span className="font-mono font-bold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded">
                    {omSession.ussdAuthCode}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-700 font-medium">
                  {omSession.message}
                </p>
              </div>

              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                  Saisissez le code d'autorisation (OTP) reçu :
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={omOtp}
                  onChange={(e) => setOmOtp(e.target.value)}
                  placeholder="Code OTP à 4 chiffres"
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-center text-sm font-mono tracking-widest font-black text-neutral-900 focus:outline-none focus:border-[#ff7900]"
                />
              </div>

              <button
                type="button"
                onClick={handleVerifyOrangeMoney}
                disabled={loading}
                className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition active:scale-95 disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 size={14} className="animate-spin text-amber-400" />
                ) : (
                  <CheckCircle2 size={14} className="text-emerald-400" />
                )}
                <span>Valider le prélèvement ({amount.toLocaleString('fr-FR')} FCFA)</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* METHOD 3: CARTE BANCAIRE */}
      {selectedMethod === 'CARD' && (
        <form onSubmit={handleChargeCard} className="space-y-3">
          {/* Card Mockup Graphic */}
          <div className="w-full h-36 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-950 p-4 text-white flex flex-col justify-between shadow-md relative overflow-hidden border border-neutral-700/60">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between z-10">
              <span className="text-[10px] tracking-wider text-neutral-400 uppercase font-bold">
                SamaTaxi Pay • {isMastercard ? 'Mastercard' : isVisa ? 'Visa' : 'GIM-UEMOA'}
              </span>
              <div className="flex items-center gap-1.5">
                <Lock size={12} className="text-emerald-400" />
                <span className="text-[9px] text-emerald-400 font-bold">3D-Secure</span>
              </div>
            </div>

            <div className="font-mono text-sm tracking-widest text-neutral-200 z-10 font-bold">
              {cardNumber || '•••• •••• •••• ••••'}
            </div>

            <div className="flex items-end justify-between z-10">
              <div>
                <span className="text-[8px] text-neutral-400 block uppercase">Titulaire</span>
                <span className="text-[11px] font-bold tracking-wide truncate max-w-[150px] block">
                  {cardHolder || 'NOM ET PRENOM'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[8px] text-neutral-400 block uppercase">Expire fin</span>
                <span className="text-[11px] font-mono font-bold">{cardExpiry || 'MM/AA'}</span>
              </div>
            </div>
          </div>

          {/* Form Inputs */}
          <div className="space-y-2.5">
            <div>
              <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                Numéro de carte
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => handleCardNumberChange(e.target.value)}
                placeholder="4242 4242 4242 4242"
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-mono font-bold text-neutral-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                  Titulaire
                </label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                  placeholder="OUSMANE FALL"
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-bold text-neutral-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                    Expiration
                  </label>
                  <input
                    type="text"
                    maxLength={5}
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="12/28"
                    className="w-full px-2 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-mono text-center text-neutral-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-neutral-700 block mb-1">
                    CVV
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="•••"
                    className="w-full px-2 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-mono text-center text-neutral-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 pt-1">
            <ShieldCheck size={14} className="text-emerald-600 flex-shrink-0" />
            <span>Paiement chiffré SSL 256-bit certifié PCI-DSS UEMOA.</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#F5B800] hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl shadow-md transition active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin text-neutral-950" />
            ) : (
              <>
                <Lock size={14} />
                <span>RÉGLER {amount.toLocaleString('fr-FR')} FCFA PAR CARTE</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* METHOD 4: ESPÈCES */}
      {selectedMethod === 'CASH' && (
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <Banknote size={20} />
          </div>
          <div>
            <h4 className="font-bold text-xs text-neutral-900">Paiement en espèces</h4>
            <p className="text-[11px] text-neutral-600 mt-0.5">
              Réglez directement le montant de <b>{amount.toLocaleString('fr-FR')} FCFA</b> en main propre au chauffeur.
            </p>
          </div>

          <button
            type="button"
            onClick={handlePayCash}
            disabled={loading}
            className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition"
          >
            Confirmer le règlement en espèces
          </button>
        </div>
      )}
    </div>
  );
};
