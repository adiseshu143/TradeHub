/**
 * Firestore Database Service
 * Modular v9+ implementation for CRUD, queries, pagination, and real-time data
 * 
 * Includes:
 * - One-time fetch operations (getDocs)
 * - Real-time listeners (onSnapshot)
 * - Cursor-based pagination
 * - Server timestamps
 * - Complex queries with where, orderBy, limit
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  QueryConstraint,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

// ============================================================================
// CONSTANTS & HELPERS
// ============================================================================

const COLLECTION_NAMES = {
  USERS: "users",
  PRODUCTS: "products",
  ORDERS: "orders",
  REVIEWS: "reviews",
  CART: "cart",
  WISHLISTS: "wishlists",
};

/**
 * Get error message for Firestore operations
 */
const getFirestoreErrorMessage = (error) => {
  const errorMap = {
    "permission-denied": "You don't have permission to access this data.",
    "not-found": "The requested data was not found.",
    "already-exists": "This document already exists.",
    "failed-precondition": "Operation failed. Please try again.",
    "unauthenticated": "Please sign in to perform this action.",
  };
  return errorMap[error.code] || error.message || "Something went wrong";
};

// ============================================================================
// 1. BASIC CRUD OPERATIONS
// ============================================================================

/**
 * Create a new document
 * Uses server timestamp for automatic timestamp management
 * 
 * @param {string} collectionName - Collection name
 * @param {string} docId - Document ID (optional, auto-generated if not provided)
 * @param {object} data - Document data
 * @returns {Promise<{success: boolean, docId?: string, error?: string}>}
 * 
 * @example
 * await createDocument('products', 'prod_123', {
 *   name: 'Laptop',
 *   price: 999,
 *   category: 'electronics'
 * });
 */
export const createDocument = async (collectionName, docId, data) => {
  try {
    const collectionRef = collection(db, collectionName);
    const docRef = docId ? doc(collectionRef, docId) : doc(collectionRef);

    await setDoc(docRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { success: true, docId: docRef.id };
  } catch (error) {
    return {
      success: false,
      error: getFirestoreErrorMessage(error),
    };
  }
};

/**
 * Read a single document by ID
 * One-time fetch (not real-time)
 * 
 * @param {string} collectionName - Collection name
 * @param {string} docId - Document ID
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 * 
 * @example
 * const { data } = await readDocument('products', 'prod_123');
 */
export const readDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnapshot = await getDoc(docRef);

    if (!docSnapshot.exists()) {
      return { success: false, error: "Document not found" };
    }

    return {
      success: true,
      data: { id: docSnapshot.id, ...docSnapshot.data() },
    };
  } catch (error) {
    return {
      success: false,
      error: getFirestoreErrorMessage(error),
    };
  }
};

/**
 * Update a document
 * Only updates specified fields, doesn't replace entire document
 * 
 * @param {string} collectionName - Collection name
 * @param {string} docId - Document ID
 * @param {object} updates - Fields to update
 * @returns {Promise<{success: boolean, error?: string}>}
 * 
 * @example
 * await updateDocument('products', 'prod_123', {
 *   price: 899,
 *   inStock: true
 * });
 */
export const updateDocument = async (collectionName, docId, updates) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: getFirestoreErrorMessage(error),
    };
  }
};

/**
 * Delete a document
 * 
 * @param {string} collectionName - Collection name
 * @param {string} docId - Document ID
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: getFirestoreErrorMessage(error),
    };
  }
};

// ============================================================================
// 2. COLLECTION QUERIES (One-time fetch with where, orderBy, limit)
// ============================================================================

/**
 * Query collection with filters, ordering, and pagination
 * Use for one-time data fetch (not real-time)
 * 
 * For real-time updates, use subscribeToQuery() instead
 * 
 * @param {string} collectionName - Collection name
 * @param {object} options - Query options
 *   @param {Array} options.constraints - Array of QueryConstraint (where, orderBy, limit, startAfter)
 * @returns {Promise<{success: boolean, data?: Array, error?: string, lastDoc?: object}>}
 * 
 * @example
 * const { data } = await queryCollection('products', {
 *   constraints: [
 *     where('category', '==', 'electronics'),
 *     where('inStock', '==', true),
 *     orderBy('createdAt', 'desc'),
 *     limit(20)
 *   ]
 * });
 */
export const queryCollection = async (collectionName, options = {}) => {
  try {
    const { constraints = [] } = options;
    const collectionRef = collection(db, collectionName);

    const q = query(collectionRef, ...constraints);
    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Store last document for pagination
    const lastDoc =
      querySnapshot.docs.length > 0
        ? querySnapshot.docs[querySnapshot.docs.length - 1]
        : null;

    return {
      success: true,
      data,
      lastDoc, // Use this with startAfter() for pagination
    };
  } catch (error) {
    return {
      success: false,
      error: getFirestoreErrorMessage(error),
    };
  }
};

/**
 * Get all documents in a collection
 * Use only for small collections!
 * 
 * @param {string} collectionName - Collection name
 * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
 */
export const getAllDocuments = async (collectionName) => {
  try {
    const collectionRef = collection(db, collectionName);
    const querySnapshot = await getDocs(collectionRef);

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: getFirestoreErrorMessage(error),
    };
  }
};

// ============================================================================
// 3. REAL-TIME LISTENERS (onSnapshot with auto-cleanup)
// ============================================================================

/**
 * Subscribe to real-time document updates
 * Returns unsubscribe function for cleanup
 * 
 * ⚠️ CRITICAL: Always call returned function in useEffect cleanup
 * to avoid memory leaks and unnecessary reads
 * 
 * @param {string} collectionName - Collection name
 * @param {string} docId - Document ID
 * @param {function} onData - Callback: (data, error) => void
 * @returns {function} Unsubscribe function for cleanup
 * 
 * @example
 * useEffect(() => {
 *   const unsubscribe = subscribeToDocument('products', 'prod_123', (data, error) => {
 *     if (error) {
 *       console.error(error);
 *     } else {
 *       setProduct(data);
 *     }
 *   });
 *   return () => unsubscribe(); // Cleanup on unmount
 * }, []);
 */
export const subscribeToDocument = (collectionName, docId, onData) => {
  const docRef = doc(db, collectionName, docId);

  const unsubscribe = onSnapshot(
    docRef,
    (docSnapshot) => {
      if (docSnapshot.exists()) {
        onData({ id: docSnapshot.id, ...docSnapshot.data() }, null);
      } else {
        onData(null, "Document not found");
      }
    },
    (error) => {
      onData(null, getFirestoreErrorMessage(error));
    }
  );

  return unsubscribe;
};

/**
 * Subscribe to real-time collection query results
 * Returns unsubscribe function for cleanup
 * 
 * Use this for real-time leaderboards, active listings, notifications, etc.
 * 
 * ⚠️ IMPORTANT: Every onSnapshot call increases read costs
 * Only use when you need real-time updates
 * For static data, use queryCollection() instead
 * 
 * @param {string} collectionName - Collection name
 * @param {Array} constraints - Array of QueryConstraint (where, orderBy, limit, etc.)
 * @param {function} onData - Callback: (data, error) => void
 * @returns {function} Unsubscribe function for cleanup
 * 
 * @example
 * useEffect(() => {
 *   const unsubscribe = subscribeToQuery(
 *     'products',
 *     [
 *       where('category', '==', 'electronics'),
 *       where('inStock', '==', true),
 *       orderBy('createdAt', 'desc'),
 *       limit(10)
 *     ],
 *     (data, error) => {
 *       if (error) console.error(error);
 *       else setProducts(data);
 *     }
 *   );
 *   return () => unsubscribe();
 * }, []);
 */
export const subscribeToQuery = (collectionName, constraints, onData) => {
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef, ...constraints);

  const unsubscribe = onSnapshot(
    q,
    (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      onData(data, null);
    },
    (error) => {
      onData(null, getFirestoreErrorMessage(error));
    }
  );

  return unsubscribe;
};

// ============================================================================
// 4. PAGINATION (Cursor-based using lastDoc)
// ============================================================================

/**
 * Paginate through collection results
 * Uses cursor-based pagination with startAfter()
 * More efficient than offset-based for large datasets
 * 
 * @param {string} collectionName - Collection name
 * @param {Array} constraints - Query constraints (where, orderBy, etc.)
 * @param {number} pageSize - Documents per page (default: 20)
 * @param {object} options - Pagination options
 *   @param {object} options.lastDoc - Last document from previous query (for next page)
 *   @param {boolean} options.isNextPage - If true, paginate forward; if false, paginate backward
 * @returns {Promise<{success: boolean, data?: Array, lastDoc?: object, hasMore?: boolean, error?: string}>}
 * 
 * @example
 * // First page
 * const { data, lastDoc, hasMore } = await paginateCollection('products', [
 *   orderBy('createdAt', 'desc')
 * ], 20);
 * 
 * // Next page
 * const { data: nextPage } = await paginateCollection('products', [
 *   orderBy('createdAt', 'desc')
 * ], 20, { lastDoc, isNextPage: true });
 */
export const paginateCollection = async (
  collectionName,
  constraints,
  pageSize = 20,
  options = {}
) => {
  try {
    const { lastDoc = null, isNextPage = true } = options;
    const collectionRef = collection(db, collectionName);

    // Build query with pagination
    let q;
    if (lastDoc && isNextPage) {
      // Next page: start after last document
      q = query(collectionRef, ...constraints, startAfter(lastDoc), limit(pageSize));
    } else {
      // First page
      q = query(collectionRef, ...constraints, limit(pageSize));
    }

    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const newLastDoc =
      querySnapshot.docs.length > 0
        ? querySnapshot.docs[querySnapshot.docs.length - 1]
        : null;

    // Determine if more data exists
    const hasMore = querySnapshot.docs.length === pageSize;

    return {
      success: true,
      data,
      lastDoc: newLastDoc,
      hasMore,
    };
  } catch (error) {
    return {
      success: false,
      error: getFirestoreErrorMessage(error),
    };
  }
};

// ============================================================================
// 5. BATCH OPERATIONS (Multiple writes in one transaction)
// ============================================================================

/**
 * Batch write multiple documents
 * Use when you need to update/create multiple documents atomically
 * 
 * @param {Array} operations - Array of operations
 *   Each operation: {type: 'set'|'update'|'delete', collection, docId, data}
 * @returns {Promise<{success: boolean, error?: string}>}
 * 
 * @example
 * await batchWriteDocuments([
 *   { type: 'set', collection: 'products', docId: 'prod_1', data: {...} },
 *   { type: 'update', collection: 'users', docId: 'user_1', data: {points: 100} },
 *   { type: 'delete', collection: 'cart', docId: 'cart_item_1' }
 * ]);
 */
export const batchWriteDocuments = async (operations) => {
  try {
    const batch = writeBatch(db);

    for (const op of operations) {
      const docRef = doc(db, op.collection, op.docId);

      if (op.type === "set") {
        batch.set(docRef, {
          ...op.data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } else if (op.type === "update") {
        batch.update(docRef, {
          ...op.data,
          updatedAt: serverTimestamp(),
        });
      } else if (op.type === "delete") {
        batch.delete(docRef);
      }
    }

    await batch.commit();
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: getFirestoreErrorMessage(error),
    };
  }
};

// ============================================================================
// 6. USER-SPECIFIC OPERATIONS
// ============================================================================

/**
 * Create user profile after signup
 * Called automatically from authService.signUp()
 * 
 * @param {string} userId - Firebase Auth UID
 * @param {object} userData - User profile data
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const createUserProfile = async (userId, userData) => {
  return createDocument(COLLECTION_NAMES.USERS, userId, userData);
};

/**
 * Get user profile
 * 
 * @param {string} userId - Firebase Auth UID
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const getUserProfile = async (userId) => {
  return readDocument(COLLECTION_NAMES.USERS, userId);
};

/**
 * Update user profile
 * 
 * @param {string} userId - Firebase Auth UID
 * @param {object} updates - Fields to update
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const updateUserProfile = async (userId, updates) => {
  return updateDocument(COLLECTION_NAMES.USERS, userId, updates);
};

/**
 * Subscribe to user profile real-time updates
 * 
 * @param {string} userId - Firebase Auth UID
 * @param {function} onData - Callback: (data, error) => void
 * @returns {function} Unsubscribe function
 */
export const subscribeToUserProfile = (userId, onData) => {
  return subscribeToDocument(COLLECTION_NAMES.USERS, userId, onData);
};

// ============================================================================
// 7. PRODUCT-SPECIFIC OPERATIONS
// ============================================================================

/**
 * Get all products (for product listing)
 * Optional: Can be converted to real-time with subscribeToQuery
 * 
 * @param {object} filters - Filter options
 *   @param {string} filters.category - Filter by category
 *   @param {number} filters.minPrice - Minimum price
 *   @param {number} filters.maxPrice - Maximum price
 *   @param {string} filters.sortBy - 'createdAt' | 'price' | 'rating'
 *   @param {string} filters.sortOrder - 'asc' | 'desc'
 * @returns {Promise<{success: boolean, data?: Array, error?: string}>}
 * 
 * @example
 * const { data: products } = await getProducts({
 *   category: 'electronics',
 *   minPrice: 100,
 *   maxPrice: 1000,
 *   sortBy: 'price',
 *   sortOrder: 'asc'
 * });
 */
export const getProducts = async (filters = {}) => {
  try {
    const constraints = [];

    if (filters.category) {
      constraints.push(where("category", "==", filters.category));
    }

    if (filters.minPrice !== undefined) {
      constraints.push(where("price", ">=", filters.minPrice));
    }

    if (filters.maxPrice !== undefined) {
      constraints.push(where("price", "<=", filters.maxPrice));
    }

    // Add sorting
    const sortBy = filters.sortBy || "createdAt";
    const sortOrder = filters.sortOrder || "desc";
    constraints.push(orderBy(sortBy, sortOrder));

    // Add limit
    constraints.push(limit(100)); // Adjust as needed

    return queryCollection(COLLECTION_NAMES.PRODUCTS, { constraints });
  } catch (error) {
    return {
      success: false,
      error: getFirestoreErrorMessage(error),
    };
  }
};

/**
 * Get single product by ID
 * 
 * @param {string} productId - Product ID
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export const getProduct = async (productId) => {
  return readDocument(COLLECTION_NAMES.PRODUCTS, productId);
};

/**
 * Subscribe to product real-time updates
 * Useful for product detail pages showing live stock/price
 * 
 * @param {string} productId - Product ID
 * @param {function} onData - Callback: (data, error) => void
 * @returns {function} Unsubscribe function
 */
export const subscribeToProduct = (productId, onData) => {
  return subscribeToDocument(COLLECTION_NAMES.PRODUCTS, productId, onData);
};

// ============================================================================
// EXPORT CONSTANTS
// ============================================================================

export { COLLECTION_NAMES };
