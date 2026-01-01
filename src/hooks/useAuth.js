/**
 * useAuth Hook - Authentication State Management
 * 
 * Provides:
 * - Current user state
 * - Loading state during auth operations
 * - Auth functions (signup, login, logout)
 * - User-friendly error messages
 * 
 * Usage:
 * const { user, loading, error, signup, login, logout } = useAuth();
 */

import { useState, useEffect, useCallback } from "react";
import useStore from "../store/useStore";
import {
  signUp,
  login,
  logout,
  resetPassword,
  onAuthStateChange,
  getAuthErrorMessage,
  initializeAuthPersistence,
} from "../firebase/authService";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Access store actions without creating extra subscriptions
  const { setAuthState, setAuthError, clearAuthError } = useStore.getState();

  // Initialize auth state listener
  useEffect(() => {
    // Ensure auth persistence (remembered session)
    initializeAuthPersistence();

    const unsubscribe = onAuthStateChange((currentUser, isLoading) => {
      setUser(currentUser);
      setLoading(isLoading);
      setError(null);
      setAuthState(currentUser, isLoading);
      setAuthError(null);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  // Signup handler
  const handleSignUp = useCallback(async (email, password, displayName) => {
    setError(null);
    setAuthError(null);
    setLoading(true);
    const result = await signUp(email, password, displayName);
    setLoading(false);

    if (!result.success) {
      setError(result.error);
      setAuthError(result.error);
      return { success: false, error: result.error };
    }

    setAuthState(result.user, false);
    return { success: true, user: result.user };
  }, []);

  // Login handler
  const handleLogin = useCallback(async (email, password) => {
    setError(null);
    setAuthError(null);
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (!result.success) {
      setError(result.error);
      setAuthError(result.error);
      return { success: false, error: result.error };
    }

    setAuthState(result.user, false);
    return { success: true, user: result.user };
  }, []);

  // Logout handler
  const handleLogout = useCallback(async () => {
    setError(null);
    setAuthError(null);
    setLoading(true);
    const result = await logout();
    setLoading(false);

    if (!result.success) {
      setError(result.error);
      setAuthError(result.error);
      return { success: false, error: result.error };
    }

    setAuthState(null, false);
    return { success: true };
  }, []);

  // Password reset handler
  const handleResetPassword = useCallback(async (email) => {
    setError(null);
    setAuthError(null);
    setLoading(true);
    const result = await resetPassword(email);
    setLoading(false);

    if (!result.success) {
      setError(result.error);
      setAuthError(result.error);
      return { success: false, error: result.error };
    }

    return { success: true, message: result.message };
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
    setAuthError(null);
    clearAuthError();
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    signup: handleSignUp,
    login: handleLogin,
    logout: handleLogout,
    resetPassword: handleResetPassword,
    clearError,
  };
};

export default useAuth;
