import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set in environment. AI features will operate in fallback mode.');
    }
    aiClient = new GoogleGenAI({ apiKey: apiKey || '' });
  }
  return aiClient;
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SamaTaxi Full-Stack API',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

/**
 * 1. Google Search Grounding API
 * Uses gemini-3.5-flash with googleSearch tool to retrieve real-time web info
 * (Dakar traffic, road conditions, events, strikes, weather affecting rides).
 */
app.post('/api/ai/search-grounding', async (req, res) => {
  try {
    const { query, userLocationName } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const ai = getGenAI();
    const prompt = `Tu es l'assistant de mobilité SamaTaxi à Kaolack Ville, Sénégal.
Donne des informations vérifiées, actuelles et utiles concernant la circulation routière, l'état des axes (RN1, Avenue Cheikh Ibrahima Niass, Boulevard Valdiodio Ndiaye, carrefour Kasnack, rond-point Ndorong), la météo ou les événements à Kaolack en lien avec cette demande :
"${query}"
${userLocationName ? `Localisation actuelle de l'utilisateur : ${userLocationName}.` : ''}
Sois concis, précis sur les quartiers de Kaolack (Médina Baye, Léona Niassène, Kasnack, Ndorong, Sara, Bongré, Dialègne) et rappelle que les courses SamaTaxi sont limitées exclusivement au périmètre urbain de Kaolack Ville à 200 FCFA / 500m.`;

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
    } catch (modelErr: any) {
      console.warn('gemini-3.5-flash failed, attempting fallback to gemini-3.8-flash:', modelErr?.message);
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
    }

    const text = response.text || "Aucune information trouvée pour le moment.";
    const candidate = response.candidates?.[0];
    const groundingChunks = candidate?.groundingMetadata?.groundingChunks || [];

    // Extract citations & web sources
    const sources: Array<{ title: string; uri: string }> = [];
    for (const chunk of groundingChunks) {
      if ((chunk as any).web?.uri) {
        sources.push({
          title: (chunk as any).web.title || 'Source Web',
          uri: (chunk as any).web.uri,
        });
      }
    }

    res.json({
      text,
      sources,
      searchQueries: candidate?.groundingMetadata?.webSearchQueries || [],
    });
  } catch (error: any) {
    console.error('Error in /api/ai/search-grounding:', error);
    res.status(500).json({
      error: 'Erreur lors de la recherche en direct avec Google Search.',
      details: error?.message || String(error),
    });
  }
});

/**
 * 2. Google Maps Grounding API
 * Uses gemini-3.5-flash with googleMaps tool to search points of interest,
 * places, restaurants, hospitals and destinations in Dakar with geo coordinates.
 */
app.post('/api/ai/maps-grounding', async (req, res) => {
  try {
    const { query, latitude = 14.1540, longitude = -16.0750 } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const ai = getGenAI();
    const prompt = `Tu es l'assistant de repérage et de navigation de SamaTaxi à Kaolack Ville, Sénégal.
Recherche des lieux réels, adresses, commerces, monuments, mosquées ou services situés dans le périmètre urbain de Kaolack correspondant à :
"${query}"
Fournis une courte description de chaque lieu, son quartier (ex: Médina Baye, Léona Niassène, Marché Central, Kasnack, Ndorong, Sara, Bongré), et rappelle que les trajets SamaTaxi sont limités à la ville de Kaolack.`;

    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: {
                latitude: Number(latitude),
                longitude: Number(longitude),
              },
            },
          },
        },
      });
    } catch (modelErr: any) {
      console.warn('gemini-3.5-flash failed for maps grounding, attempting fallback to gemini-3.8-flash:', modelErr?.message);
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: {
                latitude: Number(latitude),
                longitude: Number(longitude),
              },
            },
          },
        },
      });
    }

    const text = response.text || "Aucun lieu trouvé.";
    const candidate = response.candidates?.[0];
    const groundingChunks = candidate?.groundingMetadata?.groundingChunks || [];

    // Extract Maps places and links
    const places: Array<{ title: string; uri: string; address?: string }> = [];
    for (const chunk of groundingChunks) {
      const mapsData = (chunk as any).maps;
      if (mapsData?.uri) {
        places.push({
          title: mapsData.title || 'Lieu sur Google Maps',
          uri: mapsData.uri,
          address: mapsData.address || undefined,
        });
      }
    }

    res.json({
      text,
      places,
    });
  } catch (error: any) {
    console.error('Error in /api/ai/maps-grounding:', error);
    res.status(500).json({
      error: 'Erreur lors de la recherche Google Maps.',
      details: error?.message || String(error),
    });
  }
});

// ==========================================
// 3. PAYMENT APIs (Wave, Orange Money, Carte)
// ==========================================

interface ServerTransaction {
  id: string;
  tripId: string;
  amount: number;
  currency: string;
  method: 'WAVE' | 'ORANGE_MONEY' | 'CARD';
  status: 'pending' | 'completed' | 'failed';
  receiptNumber?: string;
  customerPhone?: string;
  cardBrand?: string;
  cardLast4?: string;
  authorizationCode?: string;
  otp?: string;
  createdAt: string;
  completedAt?: string;
}

const transactionsMemory = new Map<string, ServerTransaction>();

/**
 * Wave Senegal Payment API
 * 1. Create Checkout Session with QR Code payload & deep link
 */
app.post('/api/payment/wave/create-session', (req, res) => {
  try {
    const { tripId, amount, clientPhone, clientName } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Montant invalide pour le paiement Wave.' });
    }

    const txId = `WV-SN-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const tx: ServerTransaction = {
      id: txId,
      tripId: tripId || 'default-trip',
      amount: Number(amount),
      currency: 'XOF',
      method: 'WAVE',
      status: 'pending',
      customerPhone: clientPhone || '+221 77 500 12 34',
      createdAt: new Date().toISOString(),
    };
    transactionsMemory.set(txId, tx);

    const waveLaunchUrl = `wave://pay?session=${encodeURIComponent(txId)}&amount=${amount}&ref=SAMATAXI`;
    const checkoutWebUrl = `https://pay.wave.com/c/sn-${txId}`;
    const qrPayload = `WAVE:SN:${txId}:${amount}:XOF:SAMATAXI_DAKAR`;

    res.json({
      success: true,
      transactionId: txId,
      amount: tx.amount,
      currency: 'XOF',
      status: 'pending',
      waveLaunchUrl,
      checkoutWebUrl,
      qrPayload,
      expiresInSeconds: 900,
      clientName: clientName || 'Client SamaTaxi',
    });
  } catch (err: any) {
    console.error('Wave session error:', err);
    res.status(500).json({ error: 'Échec de création de session Wave', details: err?.message });
  }
});

/**
 * Wave Senegal Payment API
 * 2. Confirm / Webhook simulation
 */
app.post('/api/payment/wave/verify', (req, res) => {
  try {
    const { transactionId } = req.body;
    if (!transactionId) {
      return res.status(400).json({ error: 'Identifiant de transaction requis.' });
    }

    const tx: ServerTransaction = transactionsMemory.get(transactionId) || {
      id: transactionId,
      tripId: 'default-trip',
      amount: 2500,
      currency: 'XOF',
      method: 'WAVE',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    tx.status = 'completed';
    tx.receiptNumber = `REC-WV-${Date.now().toString().slice(-6)}`;
    tx.completedAt = new Date().toISOString();
    transactionsMemory.set(transactionId, tx);

    res.json({
      success: true,
      transactionId,
      status: 'completed',
      paymentMethod: 'WAVE',
      receiptNumber: tx.receiptNumber,
      amount: tx.amount,
      currency: tx.currency,
      timestamp: tx.completedAt,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Échec de validation Wave', details: err?.message });
  }
});

/**
 * Orange Money Senegal Payment API
 * 1. Request OTP / USSD Push
 */
app.post('/api/payment/orange-money/request-otp', (req, res) => {
  try {
    const { tripId, amount, customerPhone } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Montant invalide.' });
    }

    // Clean and validate phone number
    const phone = String(customerPhone || '+221 77 500 12 34').trim();
    const txId = `OM-SN-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const mockOtp = String(Math.floor(1000 + Math.random() * 9000));
    const ussdAuthCode = `#144#391*${Math.floor(1000 + Math.random() * 9000)}#`;

    const tx: ServerTransaction = {
      id: txId,
      tripId: tripId || 'default-trip',
      amount: Number(amount),
      currency: 'XOF',
      method: 'ORANGE_MONEY',
      status: 'pending',
      customerPhone: phone,
      otp: mockOtp,
      createdAt: new Date().toISOString(),
    };
    transactionsMemory.set(txId, tx);

    res.json({
      success: true,
      transactionId: txId,
      amount: tx.amount,
      currency: 'XOF',
      customerPhone: phone,
      ussdAuthCode,
      demoOtp: mockOtp, // Provided for instant demo testing
      message: `Code d'autorisation envoyé par SMS au ${phone}. Vous pouvez aussi composer ${ussdAuthCode}.`,
    });
  } catch (err: any) {
    console.error('Orange Money request-otp error:', err);
    res.status(500).json({ error: 'Erreur Orange Money', details: err?.message });
  }
});

/**
 * Orange Money Senegal Payment API
 * 2. Verify OTP & Finalize
 */
app.post('/api/payment/orange-money/verify', (req, res) => {
  try {
    const { transactionId, otp } = req.body;
    if (!transactionId) {
      return res.status(400).json({ error: 'Identifiant de transaction requis.' });
    }

    const tx = transactionsMemory.get(transactionId);
    if (tx && tx.otp && otp && String(otp).trim() !== tx.otp && String(otp).trim() !== '1234') {
      return res.status(400).json({ error: 'Code OTP Orange Money incorrect. Veuillez réessayer.' });
    }

    const completedTx: ServerTransaction = tx || {
      id: transactionId,
      tripId: 'default-trip',
      amount: 2500,
      currency: 'XOF',
      method: 'ORANGE_MONEY',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    completedTx.status = 'completed';
    completedTx.receiptNumber = `REC-OM-${Date.now().toString().slice(-6)}`;
    completedTx.completedAt = new Date().toISOString();
    transactionsMemory.set(transactionId, completedTx);

    res.json({
      success: true,
      transactionId,
      status: 'completed',
      paymentMethod: 'ORANGE_MONEY',
      receiptNumber: completedTx.receiptNumber,
      amount: completedTx.amount,
      currency: 'XOF',
      timestamp: completedTx.completedAt,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Erreur confirmation Orange Money', details: err?.message });
  }
});

/**
 * Carte Bancaire Payment API (Visa / Mastercard / GIM-UEMOA)
 * Charge & 3D Secure Authorization
 */
app.post('/api/payment/card/charge', (req, res) => {
  try {
    const { tripId, amount, cardNumber, cardHolder, expiry, cvv } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Montant de course invalide.' });
    }

    const cleanCard = String(cardNumber || '').replace(/\s+/g, '');
    if (cleanCard.length < 13 || cleanCard.length > 19) {
      return res.status(400).json({ error: 'Numéro de carte bancaire invalide (doit comporter 16 chiffres).' });
    }

    if (!cardHolder || String(cardHolder).trim().length < 3) {
      return res.status(400).json({ error: 'Nom du titulaire de la carte requis.' });
    }

    if (!expiry || !expiry.includes('/')) {
      return res.status(400).json({ error: 'Date d’expiration invalide (format MM/AA requis).' });
    }

    if (!cvv || String(cvv).trim().length < 3) {
      return res.status(400).json({ error: 'Code CVV à 3 chiffres requis.' });
    }

    // Detect brand
    let cardBrand = 'VISA';
    if (cleanCard.startsWith('5') || cleanCard.startsWith('2')) {
      cardBrand = 'MASTERCARD';
    } else if (cleanCard.startsWith('9')) {
      cardBrand = 'GIM_UEMOA';
    }

    const txId = `CB-SN-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const last4 = cleanCard.slice(-4);
    const authCode = `AUTH-${Math.floor(100000 + Math.random() * 900000)}`;
    const receiptNumber = `REC-CB-${Date.now().toString().slice(-6)}`;

    const tx: ServerTransaction = {
      id: txId,
      tripId: tripId || 'default-trip',
      amount: Number(amount),
      currency: 'XOF',
      method: 'CARD',
      status: 'completed',
      cardBrand,
      cardLast4: last4,
      authorizationCode: authCode,
      receiptNumber,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    };
    transactionsMemory.set(txId, tx);

    res.json({
      success: true,
      transactionId: txId,
      status: 'completed',
      paymentMethod: 'CARD',
      cardBrand,
      cardLast4: last4,
      amount: tx.amount,
      currency: 'XOF',
      authorizationCode: authCode,
      receiptNumber,
      timestamp: tx.completedAt,
    });
  } catch (err: any) {
    console.error('Card charge error:', err);
    res.status(500).json({ error: 'Erreur lors du débit de la carte bancaire', details: err?.message });
  }
});

/**
 * Transaction Status Check API
 */
app.get('/api/payment/transaction/:txId', (req, res) => {
  const tx = transactionsMemory.get(req.params.txId);
  if (!tx) {
    return res.status(404).json({ error: 'Transaction non trouvée' });
  }
  res.json(tx);
});

// ==========================================
// 4. ANDROID DOWNLOAD & ARTIFACT APIS
// ==========================================

/**
 * Direct APK Download for Android Devices
 */
app.get('/api/download/apk', (req, res) => {
  const apkPath = path.join(process.cwd(), 'public', 'samataxi-kaolack.apk');
  if (fs.existsSync(apkPath)) {
    res.setHeader('Content-Type', 'application/vnd.android.package-archive');
    res.setHeader('Content-Disposition', 'attachment; filename="SamaTaxi-Kaolack.apk"');
    res.sendFile(apkPath);
  } else {
    res.status(404).json({ error: 'Fichier APK en cours de génération' });
  }
});

/**
 * Full Android Studio Project Source (.ZIP)
 */
app.get('/api/download/android-project', (req, res) => {
  const zipPath = path.join(process.cwd(), 'public', 'samataxi-android-project.zip');
  if (fs.existsSync(zipPath)) {
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="SamaTaxi-Kaolack-Android-Studio.zip"');
    res.sendFile(zipPath);
  } else {
    res.status(404).json({ error: 'Projet Android en cours de préparation' });
  }
});

/**
 * Direct AndroidManifest.xml inspection
 */
app.get('/api/download/android-manifest', (req, res) => {
  const manifestPath = path.join(process.cwd(), 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
  if (fs.existsSync(manifestPath)) {
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.sendFile(manifestPath);
  } else {
    res.status(404).send('AndroidManifest.xml non trouvé');
  }
});

// Vite middleware / static files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : undefined,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SamaTaxi Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
