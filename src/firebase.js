// firebase.js
// This file initializes Firebase and exports the Firestore database instance

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration, pulled from environment variables using Vite's import.meta.env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firestore for use in other parts of your app
export const db = getFirestore(app);
