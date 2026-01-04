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

// Check if Firebase is configured
const isFirebaseConfigured = import.meta.env.VITE_FIREBASE_API_KEY && 
  import.meta.env.VITE_FIREBASE_PROJECT_ID;

// Mock Firebase services for demo mode
const createMockAuth = () => ({
  currentUser: null,
  onAuthStateChanged: () => () => {},
  signInWithEmailAndPassword: () => Promise.resolve({ user: { uid: 'demo-user', email: 'demo@tradehub.com' } }),
  createUserWithEmailAndPassword: () => Promise.resolve({ user: { uid: 'demo-user', email: 'demo@tradehub.com' } }),
  signOut: () => Promise.resolve(),
});

const createMockDb = () => ({
  collection: () => ({}),
});

const createMockStorage = () => ({
  ref: () => ({}),
});

let auth, db, storage, analytics, app;

if (isFirebaseConfigured) {
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
  app = initializeApp(firebaseConfig);

  // Initialize Firebase services
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  // Initialize Analytics only if supported (not in SSR/Node.js environments)
  if (typeof window !== "undefined") {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    }).catch(() => {
      // Analytics not supported, silently ignore
    });
  }
} else {
  // Use mock services for demo mode
  console.info('🔧 Firebase not configured - running in demo mode with mock data');
  auth = createMockAuth();
  db = createMockDb();
  storage = createMockStorage();
  analytics = null;
}

// Export Firebase services
export { app, auth, db, storage, analytics };

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