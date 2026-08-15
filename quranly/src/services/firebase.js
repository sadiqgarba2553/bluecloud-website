import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  collection,
  query,
  getDocs,
  limit,
  orderBy
} from "firebase/firestore";

function requireEnv(name, fallback = '') {
  const val = import.meta.env[name] || fallback;
  if (!val && import.meta.env.DEV) {
    console.warn(`[Firebase] Missing ${name}. Copy .env.example to .env and add your Firebase web config.`);
  }
  return val;
}

const firebaseConfig = {
  apiKey: requireEnv('VITE_FIREBASE_API_KEY'),
  authDomain: requireEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: requireEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: requireEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: requireEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: requireEnv('VITE_FIREBASE_APP_ID'),
  measurementId: requireEnv('VITE_FIREBASE_MEASUREMENT_ID'),
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('[Firebase] Firebase is not configured. Auth and cloud sync will not work until .env is set.');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

/**
 * Sign up with Email & Password
 */
export async function signUpWithEmail(email, password, displayName) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(userCredential.user, { displayName });
  }
  return userCredential.user;
}

/**
 * Sign in with Email & Password
 */
export async function signInWithEmail(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

/**
 * Sign in with Google Popup
 */
export async function signInWithGoogle() {
  const userCredential = await signInWithPopup(auth, googleProvider);
  return userCredential.user;
}

/**
 * Log Out current user
 */
export async function logOutUser() {
  return signOut(auth);
}

/**
 * Update user display name in Firebase Auth & Firestore
 */
export async function updateUserProfileName(name) {
  if (!auth.currentUser) return;
  const cleanName = String(name || '')
    .replace(/<[^>]*>?/gm, '')
    .trim()
    .slice(0, 40);
  await updateProfile(auth.currentUser, { displayName: cleanName });
  await saveUserDataToFirestore(auth.currentUser.uid, { displayName: cleanName });
}

/**
 * Save / update user document in Firestore
 */
export async function saveUserDataToFirestore(uid, data) {
  if (!uid) return;
  const userRef = doc(db, 'users', uid);
  const sanitizedData = { ...data };
  if (sanitizedData.displayName) {
    sanitizedData.displayName = String(sanitizedData.displayName)
      .replace(/<[^>]*>?/gm, '')
      .trim()
      .slice(0, 40);
  }
  await setDoc(userRef, {
    ...sanitizedData,
    updatedAt: new Date().toISOString()
  }, { merge: true });
}

/**
 * Fetch user document from Firestore once
 */
export async function getUserDataFromFirestore(uid) {
  if (!uid) return null;
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  if (snap.exists()) {
    return snap.data();
  }
  return null;
}

/**
 * Real-time listener for user data in Firestore
 */
export function subscribeUserData(uid, onUpdate) {
  if (!uid) return () => {};
  const userRef = doc(db, 'users', uid);
  return onSnapshot(userRef, (snap) => {
    if (snap.exists()) {
      onUpdate(snap.data());
    }
  }, (err) => {
    console.error("Firestore subscription error:", err);
  });
}

/**
 * Fetch top community members for leaderboard (ordered by totalXP when available)
 */
export async function getLeaderboardFromFirestore(limitCount = 20) {
  try {
    const usersRef = collection(db, 'users');
    let snap;
    try {
      const q = query(usersRef, orderBy('totalXP', 'desc'), limit(limitCount));
      snap = await getDocs(q);
    } catch (indexErr) {
      // Fallback if composite/index not ready — fetch a larger slice and sort client-side
      console.warn('Leaderboard orderBy unavailable, falling back:', indexErr?.message || indexErr);
      const q = query(usersRef, limit(Math.max(limitCount * 3, 60)));
      snap = await getDocs(q);
    }
    const users = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.displayName || data.email) {
        const azkarCount = data.completedAzkarCount || 0;
        const azkarBonusXP = azkarCount * 10;
        users.push({
          uid: docSnap.id,
          displayName: data.displayName || data.email?.split('@')[0] || 'Anonymous Reciter',
          totalMinutes: data.totalMinutes || 0,
          streak: data.streak || 0,
          completedAzkarCount: azkarCount,
          totalXP: (data.totalXP || 0) + azkarBonusXP,
          levelTitle: data.levelTitle || 'Novice Listener',
          isPro: data.isPro || false,
        });
      }
    });
    return users
      .sort((a, b) => b.totalXP - a.totalXP || b.streak - a.streak)
      .slice(0, limitCount);
  } catch (err) {
    console.error("Leaderboard fetch error:", err);
    return [];
  }
}

/**
 * Submit user feedback / feature suggestion to Firestore
 */
export async function submitAppFeedback({ type, payload, uid = null, email = null }) {
  if (!db) return { ok: false, error: 'Firebase not configured' };
  const ref = doc(collection(db, 'app_feedback'));
  await setDoc(ref, {
    type: type || 'suggestion',
    payload: payload || {},
    uid: uid || null,
    email: email || null,
    createdAt: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 200) : '',
  });
  return { ok: true, id: ref.id };
}

/**
 * Save group khatms to user document (cloud sync)
 */
export async function saveGroupKhatmsToFirestore(uid, groupKhatms) {
  if (!uid) return;
  await saveUserDataToFirestore(uid, { groupKhatms: groupKhatms || [] });
}
