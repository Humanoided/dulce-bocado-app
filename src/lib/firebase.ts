import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

/* const firebaseConfig = {
  "projectId": "dulcebocado-app",
  "appId": "1:670991370795:web:ca9cec496f72ca1e6fb86e",
  "storageBucket": "dulcebocado-app.firebasestorage.app",
  "apiKey": "AIzaSyBDhWA9yG9FzbJNAJVDhC-_PVTQEUldhlQ",
  "authDomain": "dulcebocado-app.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "670991370795"
}; */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDHqCU4N76JBIOcspd5A82anNz-6YKyoFw",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "simple-solutions-it0bv.firebaseapp.com",
  // optional for realtime DB
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "https://simple-solutions-it0bv-default-rtdb.firebaseio.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "simple-solutions-it0bv",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "simple-solutions-it0bv.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "65675547987",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:65675547987:web:a95e93540d360182f47da6",
};

// Helpful debug info in development: print the projectId/authDomain so you can
// confirm the client is using the expected Firebase project without exposing
// sensitive values in production logs.
if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
  // Only show minimal identifying fields
  // eslint-disable-next-line no-console
  console.debug("Firebase config (dev):", {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
  });
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
