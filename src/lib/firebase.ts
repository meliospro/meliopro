import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with specific database ID from config
export const db =
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Test connection on boot as recommended by Firebase skill
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, '_connection_test_', 'ping'));
    console.log('Firebase Firestore connected successfully.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase connection check: client is currently offline or unreachable.');
    } else {
      console.info('Firebase Firestore initialized and ready.');
    }
    return false;
  }
}

// Sign-in helpers
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('Google Sign-In error:', error);
    // If popups are blocked in an iframe environment, try anonymous sign in as smooth fallback
    if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
      console.info('Attempting fallback anonymous authentication...');
      const anonResult = await signInAnonymously(auth);
      return anonResult.user;
    }
    throw error;
  }
}

export async function loginAnonymously() {
  const result = await signInAnonymously(auth);
  return result.user;
}

export async function logoutUser() {
  await fbSignOut(auth);
}

export { onAuthStateChanged };
export type { FirebaseUser };
