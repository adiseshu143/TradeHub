/**
 * Firebase Authentication Service
 * Modular v9+ implementation with comprehensive error handling
 * 
 * Handles: Signup, Login, Logout, Password Reset, Auth State Persistence
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  inMemoryPersistence,
} from "firebase/auth";
import { auth } from "./firebaseConfig";
import { createUserProfile } from "./firestoreService";

/**
 * Error messages mapping for user-friendly feedback
 */
const authErrorMessages = {
  "auth/email-already-in-use": "This email is already registered. Please sign in instead.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/weak-password": "Password should be at least 6 characters long.",
  "auth/user-not-found": "No account found with this email. Please sign up first.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/too-many-requests": "Too many failed login attempts. Please try again later.",
  "auth/account-exists-with-different-credential":
    "This email is already associated with another account.",
  "auth/operation-not-allowed": "Authentication is not enabled. Please contact support.",
  "auth/network-request-failed": "Network error. Please check your internet connection.",
    "auth/invalid-credential": "Email or password is incorrect. Please try again or reset your password.",
    "auth/invalid-login-credentials": "Email or password is incorrect. Please try again or reset your password.",
  "auth/invalid-api-key": "Invalid Firebase API key. Please check environment variables.",
  "auth/app-not-authorized": "This app is not authorized with Firebase. Verify project settings and API key.",
  "auth/configuration-not-found": "Firebase project configuration is missing. Check your .env values.",
  "auth/invalid-input": "Please provide a valid email and password.",
};

/**
 * Get user-friendly error message
 * @param {string} errorCode - Firebase error code
 * @returns {string} User-friendly error message
 */
export const getAuthErrorMessage = (errorCode) => {
  return authErrorMessages[errorCode] || "An error occurred. Please try again.";
};

/**
 * Setup auth persistence (optional but recommended)
 * Enables "Remember me" functionality
 */
export const initializeAuthPersistence = async () => {
  try {
    await setPersistence(auth, browserLocalPersistence);
    return "local";
  } catch (error) {
    console.warn("Local persistence unavailable, falling back to session:", error);
  }

  try {
    await setPersistence(auth, browserSessionPersistence);
    return "session";
  } catch (error) {
    console.warn("Session persistence unavailable, falling back to in-memory:", error);
  }

  try {
    await setPersistence(auth, inMemoryPersistence);
    return "memory";
  } catch (error) {
    console.error("Failed to set any auth persistence:", error);
    return null;
  }
};

/**
 * Sign up with email and password
 * Creates auth user and corresponding Firestore profile
 * 
 * @param {string} email - User email
 * @param {string} password - User password (min 6 chars)
 * @param {string} displayName - User's full name
 * @returns {Promise<{user: object, success: boolean, error?: string}>}
 */
export const signUp = async (email, password, displayName) => {
  try {
    // Validate inputs
    if (!email?.trim() || !password || !displayName?.trim()) {
      throw new Error("auth/invalid-input");
    }

    // Create authentication user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile with display name
    await updateProfile(user, {
      displayName: displayName.trim(),
    });

    // Create corresponding Firestore user profile (best-effort)
    try {
      await createUserProfile(user.uid, {
        email: user.email,
        displayName: displayName.trim(),
        avatar: null,
        role: "user", // Default role for new users
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (profileError) {
      console.warn("Profile creation failed (auth succeeded):", profileError);
      return {
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        },
        success: true,
        profileCreated: false,
        warning: getAuthErrorMessage(profileError.code || profileError.message),
      };
    }

    return {
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      },
      success: true,
      profileCreated: true,
    };
  } catch (error) {
    return {
      success: false,
      error: getAuthErrorMessage(error.code || error.message),
      errorCode: error.code,
    };
  }
};

/**
 * Sign in with email and password
 * 
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{user: object, success: boolean, error?: string}>}
 */
export const login = async (email, password) => {
  try {
    if (!email?.trim() || !password) {
      throw new Error("auth/invalid-input");
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    return {
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      },
      success: true,
    };
  } catch (error) {
    console.error("Firebase login failed", error);
    return {
      success: false,
      error: getAuthErrorMessage(error.code || error.message),
      errorCode: error.code,
    };
  }
};

/**
 * Sign out current user
 * 
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: getAuthErrorMessage(error.code || error.message),
      errorCode: error.code,
    };
  }
};

/**
 * Send password reset email
 * 
 * @param {string} email - User email
 * @returns {Promise<{success: boolean, error?: string, message?: string}>}
 */
export const resetPassword = async (email) => {
  try {
    if (!email?.trim()) {
      throw new Error("auth/invalid-email");
    }

    await sendPasswordResetEmail(auth, email);

    return {
      success: true,
      message: "Password reset email sent. Check your inbox.",
    };
  } catch (error) {
    return {
      success: false,
      error: getAuthErrorMessage(error.code || error.message),
      errorCode: error.code,
    };
  }
};

/**
 * Subscribe to auth state changes
 * Returns unsubscribe function for cleanup in useEffect
 * 
 * ⚠️ CRITICAL: Always call returned function in useEffect cleanup
 * to avoid memory leaks
 * 
 * @param {function} callback - Called with (user, isLoading) on state change
 * @returns {function} Unsubscribe function
 * 
 * @example
 * useEffect(() => {
 *   const unsubscribe = onAuthStateChange((user, isLoading) => {
 *     setUser(user);
 *     setLoading(isLoading);
 *   });
 *   return () => unsubscribe(); // Cleanup
 * }, []);
 */
export const onAuthStateChange = (callback) => {
  let isFirstCall = true;

  const unsubscribe = onAuthStateChanged(auth, (user) => {
    // On first call, auth state is determined
    if (isFirstCall) {
      isFirstCall = false;
      callback(user, false); // isLoading = false
    } else {
      callback(user, false);
    }
  });

  return unsubscribe;
};

/**
 * Get current authenticated user synchronously
 * Note: This is NOT reactive - use onAuthStateChange for reactive updates
 * 
 * @returns {object|null} Current user or null if not authenticated
 */
export const getCurrentUser = () => {
  return auth.currentUser;
};

/**
 * Update user profile (display name, avatar, etc.)
 * 
 * @param {object} updates - Object with fields to update (displayName, photoURL, etc.)
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const updateUserProfile = async (updates) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    await updateProfile(user, updates);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: getAuthErrorMessage(error.code || error.message),
    };
  }
};
