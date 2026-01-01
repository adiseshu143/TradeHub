/**
 * FIREBASE BACKEND ARCHITECTURE GUIDE
 * ====================================
 * 
 * Complete end-to-end examples and best practices for TradeHub
 * 
 * TABLE OF CONTENTS:
 * 1. Authentication Flow (Signup → Profile → Login)
 * 2. Product Fetching (One-time vs Real-time)
 * 3. Pagination Example
 * 4. Real-time Listeners & Cleanup
 * 5. Error Handling & Offline Support
 * 6. Performance Optimization
 * 7. Security Best Practices
 * 8. Troubleshooting
 */

// =============================================================================
// 1. AUTHENTICATION FLOW
// =============================================================================

/**
 * EXAMPLE: Signup Component
 * 
 * Flow:
 * 1. User fills signup form
 * 2. authService.signUp() creates Firebase Auth user
 * 3. User profile created in Firestore automatically
 * 4. User logged in and redirected to home
 */

// FILE: src/components/auth/RegisterModal.jsx
/*
import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import useStore from '../../store/useStore';

export function SignupExample() {
  const { signup, loading, error } = useAuth();
  const setAuthState = useStore(state => state.setAuthState);
  const setAuthError = useStore(state => state.setAuthError);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: ''
  });

  const handleSignup = async (e) => {
    e.preventDefault();
    
    const result = await signup(
      formData.email,
      formData.password,
      formData.displayName
    );

    if (result.success) {
      // Close modal, user state will auto-update via onAuthStateChange
      console.log('Signup successful!', result.user);
    } else {
      setAuthError(result.error);
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <input
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({...formData, password: e.target.value})}
        placeholder="Password"
        required
      />
      <input
        type="text"
        value={formData.displayName}
        onChange={(e) => setFormData({...formData, displayName: e.target.value})}
        placeholder="Full Name"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </form>
  );
}
*/

// =============================================================================
// 2. PRODUCT FETCHING (One-time vs Real-time)
// =============================================================================

/**
 * RULE: When to use one-time fetch vs real-time listeners
 * 
 * ✅ ONE-TIME FETCH (queryCollection):
 *    - Product listing page (data doesn't change frequently)
 *    - Search results (fresh data fetched per search)
 *    - Admin dashboards (periodic checks)
 *    - Reduces Firebase costs (1 read per query instead of continuous)
 * 
 * ✅ REAL-TIME LISTENER (subscribeToQuery):
 *    - Product detail page (stock/price change frequently)
 *    - Live inventory (show when item runs out)
 *    - Active orders (track status changes)
 *    - Chat or messaging (immediate updates needed)
 * 
 * ⚠️ COST IMPACT:
 *    - One-time fetch: 1 read per call
 *    - Real-time listener: 1 read + 1 read per update (continuous!)
 */

/**
 * EXAMPLE: Product Listing (ONE-TIME FETCH)
 * 
 * FILE: src/pages/ProductListing.jsx
 */
/*
import { useState, useEffect } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { where, orderBy, limit } from 'firebase/firestore';

export function ProductListingExample() {
  const [filters, setFilters] = useState({ category: 'electronics' });
  
  // One-time fetch with realtime: false
  const { data: products, loading, error, refetch } = useFirestore(
    'products',
    [
      where('category', '==', filters.category),
      where('inStock', '==', true),
      orderBy('createdAt', 'desc'),
      limit(50)
    ],
    { realtime: false } // ← One-time fetch
  );

  const handleCategoryChange = (newCategory) => {
    setFilters({ category: newCategory });
    // Hook re-runs automatically due to dependency change
  };

  return (
    <div>
      <select onChange={(e) => handleCategoryChange(e.target.value)}>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>

      {loading && <p>Loading products...</p>}
      {error && <p style={{color: 'red'}}>Error: {error}</p>}

      <div className="product-grid">
        {products?.map(product => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p>${product.price}</p>
          </div>
        ))}
      </div>

      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
*/

/**
 * EXAMPLE: Product Details (REAL-TIME LISTENER)
 * 
 * FILE: src/pages/ProductDetails.jsx
 * 
 * Real-time updates for: price changes, stock updates, reviews
 */
/*
export function ProductDetailsExample() {
  const { productId } = useParams();

  // Real-time listener (continuous updates)
  const { data: product, loading, error } = useFirestore(
    'products',
    null,
    { 
      realtime: true, // ← Real-time listener
      docId: productId 
    }
  );

  if (loading) return <p>Loading product...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>{product?.name}</h1>
      <p>Price: ${product?.price}</p>
      <p>Stock: {product?.stock}</p> {/* Updates in real-time */}
      <button>Add to Cart</button>
    </div>
  );
}
*/

// =============================================================================
// 3. PAGINATION EXAMPLE
// =============================================================================

/**
 * EXAMPLE: Paginated Product Listing with "Load More"
 * 
 * FILE: src/pages/ProductListing.jsx
 */
/*
import { useFirestorePagination } from '../hooks/useFirestore';
import { where, orderBy } from 'firebase/firestore';

export function PaginatedProductsExample() {
  const {
    data: products,
    loading,
    error,
    hasMore,
    loadMore
  } = useFirestorePagination(
    'products',
    [
      where('category', '==', 'electronics'),
      orderBy('createdAt', 'desc')
    ],
    20 // 20 items per page
  );

  return (
    <div>
      <div className="product-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {hasMore && (
        <button onClick={loadMore} disabled={loading}>
          {loading ? 'Loading...' : 'Load More Products'}
        </button>
      )}

      {!hasMore && <p>No more products to load</p>}
    </div>
  );
}
*/

// =============================================================================
// 4. REAL-TIME LISTENERS & CLEANUP (MEMORY LEAK PREVENTION)
// =============================================================================

/**
 * ⚠️ CRITICAL: Always cleanup listeners to avoid memory leaks
 * 
 * WRONG: Memory leak - listener never unsubscribed
 */
/*
useEffect(() => {
  subscribeToDocument('products', 'prod_123', (data, error) => {
    setProduct(data);
  });
  // ❌ NO CLEANUP - listener continues after component unmount!
}, []);
*/

/**
 * CORRECT: Proper cleanup
 */
/*
useEffect(() => {
  const unsubscribe = subscribeToDocument('products', 'prod_123', (data, error) => {
    setProduct(data);
  });

  // Cleanup function called on unmount
  return () => {
    unsubscribe(); // ✅ Unsubscribe from listener
  };
}, []);
*/

/**
 * BEST: Use the useFirestore hook (handles cleanup automatically)
 */
/*
const { data: product } = useFirestore('products', null, {
  realtime: true,
  docId: 'prod_123'
});
// Hook automatically cleans up on unmount ✅
*/

// =============================================================================
// 5. ERROR HANDLING & OFFLINE SUPPORT
// =============================================================================

/**
 * EXAMPLE: Graceful Error Handling
 */
/*
export function ErrorHandlingExample() {
  const { data: products, loading, error } = useFirestore('products', [...]);

  if (error) {
    // Check if it's a network error
    const isNetworkError = error.includes('network') || error.includes('internet');
    
    return (
      <div className="error-container">
        <h2>❌ Something went wrong</h2>
        <p>{error}</p>
        
        {isNetworkError ? (
          <>
            <p>Check your internet connection and try again</p>
            <button onClick={() => window.location.reload()}>
              Reload Page
            </button>
          </>
        ) : (
          <p>Please try again later or contact support</p>
        )}
      </div>
    );
  }

  return (
    // Your component...
  );
}
*/

// =============================================================================
// 6. PERFORMANCE OPTIMIZATION
// =============================================================================

/**
 * BEST PRACTICES:
 * 
 * 1. MINIMIZE FIRESTORE READS
 *    ❌ Bad: Fetching user profile on every component render
 *    ✅ Good: Fetch once on mount, cache in state/store
 * 
 * 2. AVOID REPEATED QUERIES
 *    ❌ Bad: Query same data in multiple places
 *    ✅ Good: Query once, share via context/store
 * 
 * 3. BATCH WRITES WHEN POSSIBLE
 *    ❌ Bad: Update 10 documents with 10 separate calls
 *    ✅ Good: Use batchWriteDocuments() for atomic updates
 * 
 * 4. INDEX YOUR QUERIES
 *    Firestore will show index suggestions in Console
 *    Create indexes for common filter combinations
 * 
 * 5. UNSUBSCRIBE FROM LISTENERS
 *    ❌ Bad: Leave listeners active after component unmounts
 *    ✅ Good: Cleanup with unsubscribe() in useEffect
 * 
 * 6. USE PAGINATION
 *    ❌ Bad: Fetch all 10,000 products at once
 *    ✅ Good: Fetch 20 at a time, lazy load more
 */

/**
 * EXAMPLE: Efficient Product Search
 */
/*
export function EfficientSearchExample() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // Debounced search - avoid too many queries
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      
      // Only search when user stops typing (debounced)
      const { data, error } = await queryCollection('products', {
        constraints: [
          where('name', '>=', searchQuery),
          where('name', '<=', searchQuery + '\uf8ff'), // Hack for text search
          limit(20)
        ]
      });

      if (!error) {
        setSearchResults(data);
      }
      setSearching(false);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div>
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search products..."
      />
      {searching && <p>Searching...</p>}
      {searchResults.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
*/

// =============================================================================
// 7. SECURITY BEST PRACTICES
// =============================================================================

/**
 * 1. ENVIRONMENT VARIABLES
 *    ✅ Store Firebase credentials in .env.local
 *    ✅ Use VITE_* prefix for Vite
 *    ❌ Never hardcode credentials
 * 
 * 2. SECURITY RULES
 *    ✅ Defined in src/firebase/firebaseRules.txt
 *    ✅ Review before deployment
 *    ❌ Never allow public write access to sensitive data
 * 
 * 3. AUTHENTICATION
 *    ✅ Use Firebase Auth exclusively
 *    ✅ Check auth state before sensitive operations
 *    ❌ Don't trust client-side authentication alone
 * 
 * 4. DATA VALIDATION
 *    ✅ Validate on client (UX)
 *    ✅ Validate on server (Firestore rules - security)
 *    ❌ Only validate on client (easy to bypass)
 * 
 * 5. ERROR MESSAGES
 *    ✅ Show user-friendly messages from authErrorMessages
 *    ✅ Log full errors server-side only
 *    ❌ Expose technical error details to users
 */

// =============================================================================
// 8. FIRESTORE DATA SCHEMA
// =============================================================================

/**
 * RECOMMENDED COLLECTIONS & SCHEMA:
 */

/**
 * users/{userId}
 * - uid: string (matches Firebase Auth UID)
 * - email: string
 * - displayName: string
 * - role: string ('user' | 'admin')
 * - avatar: string (URL) or null
 * - createdAt: timestamp
 * - updatedAt: timestamp
 */

/**
 * products/{productId}
 * - name: string
 * - description: string
 * - price: number
 * - category: string
 * - stock: number
 * - rating: number (0-5)
 * - reviewCount: number
 * - images: array of strings (URLs)
 * - sellerId: string (reference to users/{userId})
 * - inStock: boolean
 * - createdAt: timestamp
 * - updatedAt: timestamp
 */

/**
 * orders/{orderId}
 * - userId: string
 * - items: array of {productId, quantity, price}
 * - totalPrice: number
 * - status: string ('pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled')
 * - shippingAddress: object
 * - createdAt: timestamp
 * - updatedAt: timestamp
 * 
 * orders/{orderId}/items/{itemId}
 * - productId: string
 * - quantity: number
 * - price: number (price at time of order)
 */

/**
 * reviews/{reviewId}
 * - userId: string
 * - productId: string
 * - rating: number (1-5)
 * - comment: string
 * - helpful: number
 * - createdAt: timestamp
 * - updatedAt: timestamp
 */

/**
 * wishlists/{wishlistId}
 * - userId: string
 * - productId: string
 * - createdAt: timestamp
 */

// =============================================================================
// 9. TROUBLESHOOTING
// =============================================================================

/**
 * COMMON ISSUES & SOLUTIONS:
 * 
 * 1. "Permission denied" error
 *    → Check Firestore security rules in console
 *    → User might not be authenticated
 *    → Check rule conditions match your data
 * 
 * 2. Data not updating in real-time
 *    → Check if listener is subscribed (not realtime: false)
 *    → Check browser console for errors
 *    → Ensure Firestore security rules allow read access
 * 
 * 3. Memory leaks (app slows down over time)
 *    → Check useEffect cleanup functions
 *    → Unsubscribe from listeners in cleanup
 *    → Use useFirestore hook (handles cleanup)
 * 
 * 4. High Firestore costs
 *    → Use one-time fetch (realtime: false) when possible
 *    → Implement pagination for large collections
 *    → Avoid subscribing to large collections
 *    → Implement caching with Zustand store
 * 
 * 5. Offline functionality not working
 *    → Enable offline persistence in firebaseConfig.js
 *    → Test in DevTools offline mode
 *    → Handle errors gracefully
 * 
 * 6. "Missing or insufficient permissions" on signup
 *    → Check /users/{userId} rule allows creation
 *    → Verify authService.createUserProfile is called
 *    → Check Firestore rules security rules
 * 
 * 7. Environment variables not loading
 *    → Restart dev server after .env changes
 *    → Variables must start with VITE_
 *    → Use import.meta.env in code
 */

// =============================================================================
// 10. DEPLOYMENT CHECKLIST
// =============================================================================

/**
 * Before deploying to production:
 * 
 * [ ] Environment variables set in deployment platform
 * [ ] Firestore security rules copied to Firebase Console
 * [ ] Composite indexes created (Firebase Console > Indexes)
 * [ ] Auth providers enabled (Email/Password, etc.)
 * [ ] CORS properly configured if using backend
 * [ ] Error logging setup (Firebase Analytics or custom)
 * [ ] Rate limiting implemented (if needed)
 * [ ] Admin users have correct role field
 * [ ] Test signup/login flow
 * [ ] Test product creation/update/delete
 * [ ] Test paginated queries
 * [ ] Test offline mode (if implemented)
 */

export {}; // Make this a module
