import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  "projectId": "dulcebocado-app",
  "appId": "1:670991370795:web:ca9cec496f72ca1e6fb86e",
  "storageBucket": "dulcebocado-app.firebasestorage.app",
  "apiKey": "AIzaSyBDhWA9yG9FzbJNAJVDhC-_PVTQEUldhlQ",
  "authDomain": "dulcebocado-app.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "670991370795"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
