/**
 * Firebase Configuration (Modular v9+)
 * Environment-safe initialization using Vite's import.meta.env
 * 
 * ⚠️ SECURITY: Never commit .env files with real credentials
 * Use .env.local for development (git-ignored)
 * Use CI/CD secrets for production deployment
 */

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

// Validate required environment variables
const requiredEnv = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
];

requiredEnv.forEach((env) => {
  if (!import.meta.env[env]) {
    console.warn(`⚠️ Missing environment variable: ${env}`);
  }
});

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase (singleton pattern)
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize Analytics only if supported (not in SSR/Node.js environments)
let analytics = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, analytics };

// Optional: Enable offline persistence (useful for mobile-like experiences)
// ⚠️ Note: Enables local caching, but requires careful sync handling
// import { enableIndexedDbPersistence } from "firebase/firestore";
// enableIndexedDbPersistence(db).catch((err) => {
//   if (err.code === "failed-precondition") {
//     console.warn("Multiple tabs open, persistence disabled");
//   } else if (err.code === "unimplemented") {
//     console.warn("Browser doesn't support persistence");
//   }
// });