import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PaymentMethod } from '../types';

export interface WaveSessionResponse {
  success: boolean;
  transactionId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  waveLaunchUrl: string;
  checkoutWebUrl: string;
  qrPayload: string;
  expiresInSeconds: number;
  clientName: string;
}

export interface OrangeMoneyInitiateResponse {
  success: boolean;
  transactionId: string;
  amount: number;
  currency: string;
  customerPhone: string;
  ussdAuthCode: string;
  demoOtp: string;
  message: string;
}

export interface PaymentReceipt {
  success: boolean;
  transactionId: string;
  status: 'completed' | 'pending' | 'failed';
  paymentMethod: PaymentMethod;
  receiptNumber: string;
  amount: number;
  currency: string;
  timestamp: string;
  cardBrand?: string;
  cardLast4?: string;
  authorizationCode?: string;
}

/**
 * 1. Create a Wave Checkout Session
 */
export async function createWaveSession(
  tripId: string,
  amount: number,
  clientPhone?: string,
  clientName?: string
): Promise<WaveSessionResponse> {
  const res = await fetch('/api/payment/wave/create-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tripId, amount, clientPhone, clientName }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erreur Wave' }));
    throw new Error(err.error || 'Impossible de créer la session Wave');
  }
  return res.json();
}

/**
 * 2. Confirm Wave Payment
 */
export async function verifyWavePayment(transactionId: string): Promise<PaymentReceipt> {
  const res = await fetch('/api/payment/wave/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transactionId }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erreur Wave' }));
    throw new Error(err.error || 'Échec de validation du paiement Wave');
  }
  return res.json();
}

/**
 * 3. Request Orange Money OTP / USSD Push
 */
export async function requestOrangeMoneyOtp(
  tripId: string,
  amount: number,
  customerPhone: string
): Promise<OrangeMoneyInitiateResponse> {
  const res = await fetch('/api/payment/orange-money/request-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tripId, amount, customerPhone }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erreur Orange Money' }));
    throw new Error(err.error || 'Échec d’initialisation Orange Money');
  }
  return res.json();
}

/**
 * 4. Verify Orange Money OTP
 */
export async function verifyOrangeMoneyOtp(
  transactionId: string,
  otp: string
): Promise<PaymentReceipt> {
  const res = await fetch('/api/payment/orange-money/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transactionId, otp }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Code incorrect' }));
    throw new Error(err.error || 'Code OTP Orange Money incorrect');
  }
  return res.json();
}

/**
 * 5. Charge Bank Card (Visa / Mastercard / GIM-UEMOA)
 */
export async function processCardPayment(
  tripId: string,
  amount: number,
  cardData: {
    cardNumber: string;
    cardHolder: string;
    expiry: string;
    cvv: string;
  }
): Promise<PaymentReceipt> {
  const res = await fetch('/api/payment/card/charge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tripId,
      amount,
      ...cardData,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erreur Carte' }));
    throw new Error(err.error || 'Échec de validation de la carte bancaire');
  }
  return res.json();
}

/**
 * Helper to record payment transaction in Firestore
 */
export async function recordFirestorePaymentTransaction(
  receipt: PaymentReceipt,
  tripId: string,
  customerInfo?: { phone?: string; name?: string }
): Promise<void> {
  try {
    const txRef = doc(db, 'transactions', receipt.transactionId);
    await setDoc(txRef, {
      transactionId: receipt.transactionId,
      tripId,
      amount: receipt.amount,
      currency: receipt.currency,
      method: receipt.paymentMethod,
      status: receipt.status,
      receiptNumber: receipt.receiptNumber,
      customerPhone: customerInfo?.phone || null,
      cardBrand: receipt.cardBrand || null,
      cardLast4: receipt.cardLast4 || null,
      authorizationCode: receipt.authorizationCode || null,
      createdAt: new Date().toISOString(),
      completedAt: receipt.timestamp,
    });
    console.log(`Payment transaction ${receipt.transactionId} saved to Firestore.`);
  } catch (error) {
    console.warn('Could not record transaction in Firestore (offline or preview mode):', error);
  }
}
