/**
 * useFirestore Hook - Real-time and One-time Firestore Data Fetching
 * 
 * Features:
 * - Automatic subscription/unsubscription with cleanup
 * - Real-time listener option (onSnapshot)
 * - One-time fetch option (getDocs)
 * - Pagination support
 * - Loading and error states
 * 
 * Usage:
 * // Real-time listener
 * const { data, loading, error } = useFirestore('products', [
 *   where('category', '==', 'electronics')
 * ]);
 * 
 * // One-time fetch
 * const { data, loading, error } = useFirestore('products', [...], {
 *   realtime: false
 * });
 */

import { useState, useEffect, useCallback } from "react";
import {
  subscribeToQuery,
  subscribeToDocument,
  queryCollection,
  readDocument,
  paginateCollection,
} from "../firebase/firestoreService";

/**
 * Hook for real-time and one-time Firestore data fetching
 * 
 * @param {string} collectionName - Firestore collection name
 * @param {Array} constraints - Query constraints (where, orderBy, limit, etc.)
 *                              For single doc: pass null
 * @param {object} options - Hook options
 *   @param {boolean} options.realtime - Use real-time listener (default: true)
 *   @param {string} options.docId - For reading single document by ID
 *   @param {boolean} options.enabled - Enable/disable the hook (default: true)
 * @returns {object} {data, loading, error, refetch, lastDoc, hasMore}
 * 
 * @example
 * // Real-time collection query
 * const { data: products, loading } = useFirestore('products', [
 *   where('category', '==', 'electronics'),
 *   orderBy('createdAt', 'desc'),
 *   limit(20)
 * ]);
 * 
 * @example
 * // One-time fetch
 * const { data: products } = useFirestore('products', [
 *   where('inStock', '==', true)
 * ], { realtime: false });
 * 
 * @example
 * // Read single document
 * const { data: product } = useFirestore('products', null, {
 *   docId: 'prod_123'
 * });
 */
export const useFirestore = (collectionName, constraints = [], options = {}) => {
  const {
    realtime = true,
    docId = null,
    enabled = true,
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(false);

  // Refetch function (manual fetch)
  const refetch = useCallback(async () => {
    if (!enabled || !collectionName) return;

    setLoading(true);
    setError(null);

    try {
      let result;

      if (docId) {
        // Single document fetch
        result = await readDocument(collectionName, docId);
        setData(result.data || null);
      } else {
        // Collection query (one-time fetch)
        result = await queryCollection(collectionName, { constraints });
        setData(result.data || []);
        setLastDoc(result.lastDoc || null);
      }

      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [collectionName, docId, constraints, enabled]);

  // Setup listeners and subscriptions
  useEffect(() => {
    if (!enabled || !collectionName) {
      setLoading(false);
      return;
    }

    let unsubscribe = null;

    if (realtime) {
      // Real-time listener setup
      if (docId) {
        // Real-time single document
        unsubscribe = subscribeToDocument(collectionName, docId, (doc, err) => {
          if (err) {
            setError(err);
            setData(null);
          } else {
            setData(doc);
            setError(null);
          }
          setLoading(false);
        });
      } else {
        // Real-time collection query
        unsubscribe = subscribeToQuery(
          collectionName,
          constraints,
          (docs, err) => {
            if (err) {
              setError(err);
              setData([]);
            } else {
              setData(docs);
              setError(null);
            }
            setLoading(false);
          }
        );
      }
    } else {
      // One-time fetch
      refetch();
    }

    // Cleanup: Unsubscribe from listener on unmount or dependency change
    return () => {
      if (unsubscribe && typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [collectionName, constraints, docId, realtime, enabled, refetch]);

  return {
    data,
    loading,
    error,
    refetch,
    lastDoc,
    hasMore,
  };
};

/**
 * Hook for paginated Firestore queries
 * Handles cursor-based pagination
 * 
 * @param {string} collectionName - Collection name
 * @param {Array} constraints - Query constraints
 * @param {number} pageSize - Documents per page (default: 20)
 * @returns {object} {data, loading, error, hasMore, lastDoc, loadMore}
 * 
 * @example
 * const { data, hasMore, loadMore } = useFirestorePagination('products', [
 *   where('category', '==', 'electronics'),
 *   orderBy('createdAt', 'desc')
 * ], 20);
 * 
 * return (
 *   <>
 *     {data.map(product => <ProductCard key={product.id} product={product} />)}
 *     {hasMore && <button onClick={loadMore}>Load More</button>}
 *   </>
 * );
 */
export const useFirestorePagination = (
  collectionName,
  constraints,
  pageSize = 20
) => {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load first page
  useEffect(() => {
    const loadFirstPage = async () => {
      setLoading(true);
      setError(null);

      const result = await paginateCollection(
        collectionName,
        constraints,
        pageSize
      );

      if (result.success) {
        setAllData(result.data);
        setLastDoc(result.lastDoc);
        setHasMore(result.hasMore);
      } else {
        setError(result.error);
        setAllData([]);
      }

      setLoading(false);
      setIsInitialized(true);
    };

    loadFirstPage();
  }, [collectionName, constraints, pageSize]);

  // Load next page
  const loadMore = useCallback(async () => {
    if (!hasMore || !lastDoc) return;

    setLoading(true);

    const result = await paginateCollection(
      collectionName,
      constraints,
      pageSize,
      { lastDoc, isNextPage: true }
    );

    if (result.success) {
      setAllData((prev) => [...prev, ...result.data]);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } else {
      setError(result.error);
    }

    setLoading(false);
  }, [collectionName, constraints, pageSize, lastDoc, hasMore]);

  return {
    data: allData,
    loading: isInitialized ? loading : true,
    error,
    hasMore,
    lastDoc,
    loadMore,
  };
};

export default useFirestore;
