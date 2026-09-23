import React, { useState, useEffect } from 'react';
import { useTaxi } from '../../context/TaxiContext';
import { PaymentMethod } from '../../types';
import { DigitalPaymentView } from '../payment/DigitalPaymentView';
import { PaymentReceipt } from '../../services/paymentApi';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Star,
  CreditCard,
  Banknote,
  Smartphone,
  ArrowRight,
  ThumbsUp,
  Receipt,
  ShieldCheck,
} from 'lucide-react';

export const RideCompletedModal: React.FC = () => {
  const { activeTrip, tripStatus, payActiveTrip, submitRating } = useTaxi();
  const [ratingStars, setRatingStars] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Motard sympathique',
    'Casque propre fourni',
  ]);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (tripStatus === 'TRIP_COMPLETED') {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F5B800', '#10B981', '#111827'],
        });
      } catch {}
    }
  }, [tripStatus]);

  if (!activeTrip) return null;
  if (tripStatus !== 'TRIP_COMPLETED' && tripStatus !== 'PAID') return null;

  const availableTags = [
    'Motard sympathique',
    'Conduite prudente & sécurisée',
    'Casque propre fourni',
    'Ponctuel',
    'Trajet fluide & rapide',
    'Respect du code de la route',
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handlePaymentSuccess = (receipt: PaymentReceipt) => {
    payActiveTrip(receipt.paymentMethod, {
      receiptNumber: receipt.receiptNumber,
      transactionId: receipt.transactionId,
      cardLast4: receipt.cardLast4,
    });
  };

  const handleSendRating = () => {
    submitRating(ratingStars, selectedTags, comment);
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center p-0 select-none animate-in fade-in">
      <div className="w-full bg-white rounded-t-3xl max-h-[92%] overflow-y-auto no-scrollbar p-5 flex flex-col shadow-2xl">
        {/* Step A: Trip Completed & Digital Payment APIs */}
        {tripStatus === 'TRIP_COMPLETED' && (
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
              <CheckCircle2 size={32} />
            </div>

            <span className="text-2xl">🎉</span>
            <h3 className="font-bold text-xl font-display text-neutral-900 mt-1">
              Course terminée !
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Vous êtes bien arrivé à destination.
            </p>

            {/* Price breakdown card */}
            <div className="w-full my-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-left">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-bold text-neutral-700">Montant total à régler</span>
                <span className="text-2xl font-black font-display text-neutral-900">
                  {activeTrip.finalPrice.toLocaleString('fr-FR')}{' '}
                  <span className="text-sm font-bold text-amber-600">FCFA</span>
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-amber-200/60 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-neutral-500 block">Distance parcourue</span>
                  <span className="font-bold text-neutral-800">{activeTrip.distanceKm} km</span>
                </div>
                <div>
                  <span className="text-[10px] text-neutral-500 block">Durée du trajet</span>
                  <span className="font-bold text-neutral-800">{activeTrip.durationMin} minutes</span>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-amber-200/60 text-[11px] text-neutral-600">
                <span className="font-semibold text-neutral-800">De :</span> {activeTrip.pickup.name}
                <br />
                <span className="font-semibold text-neutral-800">À :</span> {activeTrip.destination.name}
              </div>
            </div>

            {/* Interactive Digital Payment System (Wave, Orange Money, Card, Cash) */}
            <DigitalPaymentView
              tripId={activeTrip.id}
              amount={activeTrip.finalPrice}
              initialMethod={activeTrip.paymentMethod || 'WAVE'}
              clientPhone={activeTrip.clientPhone}
              clientName={activeTrip.clientName}
              onSuccess={handlePaymentSuccess}
            />
          </div>
        )}

        {/* Step B: Digital Receipt & Rating Step */}
        {tripStatus === 'PAID' && (
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
              <CheckCircle2 size={24} />
            </div>

            <h3 className="font-bold text-lg font-display text-neutral-900">
              Paiement confirmé & Course réglée !
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Merci pour votre confiance avec SamaTaxi.
            </p>

            {/* Digital Receipt Summary */}
            <div className="w-full my-3 p-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-left space-y-2 text-xs shadow-2xs">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                <div className="flex items-center gap-1.5 font-bold text-neutral-900">
                  <Receipt size={14} className="text-amber-500" />
                  <span>Reçu de paiement</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {activeTrip.receiptNumber || 'REC-WAVE-001'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-neutral-400 block text-[10px]">Moyen utilisé</span>
                  <span className="font-bold text-neutral-800">
                    {activeTrip.paymentMethod === 'WAVE'
                      ? 'Wave Sénégal (0% frais)'
                      : activeTrip.paymentMethod === 'ORANGE_MONEY'
                      ? 'Orange Money SN'
                      : activeTrip.paymentMethod === 'CARD'
                      ? 'Carte Bancaire (3D-Secure)'
                      : 'Espèces'}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px]">Montant réglé</span>
                  <span className="font-extrabold text-neutral-900">
                    {activeTrip.finalPrice.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
              </div>

              {activeTrip.transactionId && (
                <div className="text-[10px] text-neutral-500 font-mono pt-1 border-t border-neutral-200">
                  ID Transaction : {activeTrip.transactionId}
                </div>
              )}
            </div>

            <h4 className="font-bold text-sm font-display text-neutral-900 mt-2">
              Comment s’est passée votre course ?
            </h4>
            <p className="text-[11px] text-neutral-500">
              Votre avis avec {activeTrip.driver?.name || 'Mamadou Ndiaye'} nous aide à maintenir la qualité.
            </p>

            {/* 5 Stars Rating */}
            <div className="flex items-center gap-2 my-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRatingStars(star)}
                  className="p-1 text-2xl transition hover:scale-125 active:scale-95"
                >
                  <Star
                    size={30}
                    className={
                      star <= ratingStars
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-neutral-300'
                    }
                  />
                </button>
              ))}
            </div>

            {/* Compliment Tags Chips */}
            <div className="w-full text-left mb-3">
              <span className="text-[11px] font-bold text-neutral-700 block mb-2">
                Qu’avez-vous apprécié ?
              </span>
              <div className="flex flex-wrap gap-1.5">
                {availableTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                        isSelected
                          ? 'bg-amber-400 border-amber-400 text-neutral-950 font-bold'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Comment */}
            <div className="w-full text-left mb-4">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Laissez un commentaire au chauffeur (optionnel)..."
                rows={2}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs focus:outline-none focus:border-amber-400 focus:bg-white resize-none"
              />
            </div>

            {/* Submit Rating Button */}
            <button
              onClick={handleSendRating}
              className="w-full h-12 bg-[#F5B800] hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl shadow-md transition active:scale-[0.98]"
            >
              ENVOYER MON AVIS ET TERMINER
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
