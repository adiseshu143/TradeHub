/**
 * Firebase Constants & Utilities
 * 
 * Centralized configuration for Firestore collections, permissions, and constants
 * used throughout the application
 */

// =============================================================================
// FIRESTORE COLLECTIONS
// =============================================================================

export const COLLECTIONS = {
  USERS: "users",
  PRODUCTS: "products",
  ORDERS: "orders",
  REVIEWS: "reviews",
  CART: "cart",
  WISHLISTS: "wishlists",
  ANALYTICS: "analytics",
  AUDIT_LOGS: "auditLogs",
};

// =============================================================================
// USER ROLES & PERMISSIONS
// =============================================================================

export const USER_ROLES = {
  USER: "user",
  SELLER: "seller",
  ADMIN: "admin",
};

/**
 * Permission matrix: what each role can do
 */
export const ROLE_PERMISSIONS = {
  user: {
    canViewProducts: true,
    canCreateReviews: true,
    canCreateOrders: true,
    canViewOwnOrders: true,
    canCreateProducts: false,
    canModifyAnyProduct: false,
    canModifyAnyUser: false,
    canAccessAnalytics: false,
  },
  seller: {
    canViewProducts: true,
    canCreateReviews: true,
    canCreateOrders: true,
    canViewOwnOrders: true,
    canCreateProducts: true, // Can create their own products
    canModifyAnyProduct: false, // But only their own (checked in rules)
    canModifyAnyUser: false,
    canAccessAnalytics: false,
  },
  admin: {
    canViewProducts: true,
    canCreateReviews: true,
    canCreateOrders: true,
    canViewOwnOrders: true,
    canCreateProducts: true,
    canModifyAnyProduct: true,
    canModifyAnyUser: true,
    canAccessAnalytics: true,
  },
};

/**
 * Check if user has permission
 * @param {string} role - User role
 * @param {string} permission - Permission key
 * @returns {boolean}
 */
export const hasPermission = (role, permission) => {
  return ROLE_PERMISSIONS[role]?.[permission] ?? false;
};

// =============================================================================
// PRODUCT CATEGORIES
// =============================================================================

export const PRODUCT_CATEGORIES = [
  "Electronics",
  "Clothing",
  "Books",
  "Home & Garden",
  "Sports",
  "Toys",
  "Food",
  "Beauty",
  "Other",
];

// =============================================================================
// ORDER STATUSES
// =============================================================================

export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  RETURNED: "returned",
};

export const ORDER_STATUS_LABELS = {
  pending: "⏳ Pending",
  confirmed: "✅ Confirmed",
  shipped: "🚚 Shipped",
  delivered: "📦 Delivered",
  cancelled: "❌ Cancelled",
  returned: "↩️ Returned",
};

/**
 * Determine if order can be cancelled
 * @param {string} status - Current order status
 * @returns {boolean}
 */
export const canCancelOrder = (status) => {
  return [ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED].includes(status);
};

// =============================================================================
// PAGINATION DEFAULTS
// =============================================================================

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PRODUCT_LIST_PAGE_SIZE: 20,
  ORDER_LIST_PAGE_SIZE: 10,
  REVIEW_PAGE_SIZE: 5,
};

// =============================================================================
// VALIDATION RULES
// =============================================================================

export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  DISPLAY_NAME_MIN_LENGTH: 2,
  DISPLAY_NAME_MAX_LENGTH: 50,
  PRODUCT_NAME_MIN_LENGTH: 3,
  PRODUCT_NAME_MAX_LENGTH: 100,
  PRODUCT_DESCRIPTION_MAX_LENGTH: 5000,
  REVIEW_COMMENT_MIN_LENGTH: 10,
  REVIEW_COMMENT_MAX_LENGTH: 1000,
  PRICE_MIN: 0,
  PRICE_MAX: 999999,
  RATING_MIN: 1,
  RATING_MAX: 5,
};

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  return VALIDATION.EMAIL_REGEX.test(email);
};

/**
 * Validate password strength
 * @param {string} password
 * @returns {object} {valid: boolean, errors: string[]}
 */
export const validatePassword = (password) => {
  const errors = [];

  if (!password) {
    errors.push("Password is required");
  } else if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    errors.push(`Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`);
  }

  // Optional: Add strength requirements
  // if (!/[A-Z]/.test(password)) errors.push("Must contain uppercase letter");
  // if (!/[0-9]/.test(password)) errors.push("Must contain number");

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validate display name
 * @param {string} name
 * @returns {object}
 */
export const validateDisplayName = (name) => {
  const errors = [];

  if (!name) {
    errors.push("Name is required");
  } else if (name.length < VALIDATION.DISPLAY_NAME_MIN_LENGTH) {
    errors.push(`Name must be at least ${VALIDATION.DISPLAY_NAME_MIN_LENGTH} characters`);
  } else if (name.length > VALIDATION.DISPLAY_NAME_MAX_LENGTH) {
    errors.push(`Name must be less than ${VALIDATION.DISPLAY_NAME_MAX_LENGTH} characters`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validate product creation/update
 * @param {object} productData
 * @returns {object} {valid: boolean, errors: object}
 */
export const validateProduct = (productData) => {
  const errors = {};

  if (!productData.name?.trim()) {
    errors.name = "Product name is required";
  } else if (productData.name.length < VALIDATION.PRODUCT_NAME_MIN_LENGTH) {
    errors.name = `Product name must be at least ${VALIDATION.PRODUCT_NAME_MIN_LENGTH} characters`;
  }

  if (!productData.price) {
    errors.price = "Price is required";
  } else if (productData.price < VALIDATION.PRICE_MIN) {
      errors.price = `Price must be at least ₹${VALIDATION.PRICE_MIN}`;
  }

  if (!productData.category) {
    errors.category = "Category is required";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

// =============================================================================
// ERROR MESSAGES
// =============================================================================

export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your internet connection.",
  PERMISSION_DENIED: "You don't have permission to perform this action.",
  NOT_FOUND: "The requested item was not found.",
  ALREADY_EXISTS: "This item already exists.",
  INVALID_INPUT: "Please check your input and try again.",
  UNKNOWN_ERROR: "Something went wrong. Please try again later.",
  UNAUTHORIZED: "Please sign in to perform this action.",
};

// =============================================================================
// TIME UTILITIES
// =============================================================================

/**
 * Format Firestore timestamp for display
 * @param {object} timestamp - Firestore Timestamp
 * @returns {string} Formatted date (e.g., "Dec 31, 2025")
 */
export const formatDate = (timestamp) => {
  if (!timestamp) return "N/A";

  const date = timestamp.toDate?.() || new Date(timestamp);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

/**
 * Format Firestore timestamp for time display
 * @param {object} timestamp
 * @returns {string} Formatted time (e.g., "2:30 PM")
 */
export const formatTime = (timestamp) => {
  if (!timestamp) return "N/A";

  const date = timestamp.toDate?.() || new Date(timestamp);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

/**
 * Format Firestore timestamp with relative time
 * @param {object} timestamp
 * @returns {string} e.g., "2 hours ago"
 */
export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return "N/A";

  const date = timestamp.toDate?.() || new Date(timestamp);
  const now = new Date();
  const secondsAgo = Math.floor((now - date) / 1000);

  if (secondsAgo < 60) return "just now";
  if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)} minutes ago`;
  if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)} hours ago`;
  if (secondsAgo < 604800) return `${Math.floor(secondsAgo / 86400)} days ago`;

  return formatDate(timestamp);
};

// =============================================================================
// CURRENCY & PRICE UTILITIES
// =============================================================================

/**
 * Format price for display
 * @param {number} price
 * @param {string} currency
 * @returns {string}
 */
export const formatPrice = (price, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(price);
};

/**
 * Calculate discount percentage
 * @param {number} originalPrice
 * @param {number} discountedPrice
 * @returns {number} Discount percentage
 */
export const calculateDiscount = (originalPrice, discountedPrice) => {
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
};

// =============================================================================
// RATING UTILITIES
// =============================================================================

/**
 * Calculate average rating
 * @param {array} reviews - Array of review objects with 'rating' field
 * @returns {number} Average rating (0-5)
 */
export const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return (sum / reviews.length).toFixed(1);
};

/**
 * Get rating stars display
 * @param {number} rating
 * @returns {string} e.g., "★★★★☆"
 */
export const getRatingStars = (rating) => {
  const filled = Math.floor(rating);
  const empty = 5 - filled;
  return "★".repeat(filled) + "☆".repeat(empty);
};

// =============================================================================
// URL & STORAGE UTILITIES
// =============================================================================

/**
 * Generate Firestore document path
 * @param {string} collection
 * @param {string} docId
 * @returns {string} Path like "products/prod_123"
 */
export const getDocPath = (collection, docId) => {
  return `${collection}/${docId}`;
};

/**
 * Generate Firestore collection path
 * @param {string} collection
 * @returns {string}
 */
export const getCollectionPath = (collection) => {
  return collection;
};

// =============================================================================
// EXPORT ALL
// =============================================================================

export default {
  COLLECTIONS,
  USER_ROLES,
  ROLE_PERMISSIONS,
  PRODUCT_CATEGORIES,
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
  PAGINATION,
  VALIDATION,
  ERROR_MESSAGES,
  formatDate,
  formatTime,
  formatRelativeTime,
  formatPrice,
  calculateDiscount,
  calculateAverageRating,
  getRatingStars,
  isValidEmail,
  validatePassword,
  validateDisplayName,
  validateProduct,
  hasPermission,
  canCancelOrder,
};
