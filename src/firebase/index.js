/**
 * Firebase Module Index
 * 
 * Centralized exports for all Firebase services and utilities
 * Makes it easy to import everything you need from one place
 */

// ============================================================================
// FIREBASE CONFIG & INITIALIZATION
// ============================================================================
export { app, auth, db, storage, analytics } from './firebaseConfig';

// ============================================================================
// AUTHENTICATION SERVICE
// ============================================================================
export {
  initializeAuthPersistence,
  signUp,
  login,
  logout,
  resetPassword,
  onAuthStateChange,
  getCurrentUser,
  updateUserProfile,
  getAuthErrorMessage,
} from './authService';

// ============================================================================
// FIRESTORE SERVICE
// ============================================================================
export {
  // Basic CRUD
  createDocument,
  readDocument,
  updateDocument,
  deleteDocument,
  // Queries
  queryCollection,
  getAllDocuments,
  getProducts,
  getProduct,
  // Real-time listeners
  subscribeToDocument,
  subscribeToQuery,
  subscribeToProduct,
  // Pagination
  paginateCollection,
  // Batch operations
  batchWriteDocuments,
  // User operations
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  subscribeToUserProfile,
  // Constants
  COLLECTION_NAMES,
} from './firestoreService';

// ============================================================================
// CONSTANTS & UTILITIES
// ============================================================================
export {
  // Collections
  COLLECTIONS,
  // Roles & Permissions
  USER_ROLES,
  ROLE_PERMISSIONS,
  hasPermission,
  // Categories & Status
  PRODUCT_CATEGORIES,
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
  canCancelOrder,
  // Configuration
  PAGINATION,
  VALIDATION,
  ERROR_MESSAGES,
  // Validators
  isValidEmail,
  validatePassword,
  validateDisplayName,
  validateProduct,
  // Formatters
  formatDate,
  formatTime,
  formatRelativeTime,
  formatPrice,
  calculateDiscount,
  calculateAverageRating,
  getRatingStars,
  getDocPath,
  getCollectionPath,
} from './constants';

/**
 * USAGE EXAMPLES:
 * 
 * // Import specific functions
 * import { signUp, login } from './firebase';
 * import { createDocument, queryCollection } from './firebase';
 * import { PRODUCT_CATEGORIES, formatPrice } from './firebase';
 * 
 * // Or import everything
 * import * as firebase from './firebase';
 * firebase.signUp(email, password, name);
 */
