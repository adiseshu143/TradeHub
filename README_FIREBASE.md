# Firebase Backend Architecture - Complete Setup Guide

## 🎯 Overview

This is a **production-ready Firebase backend** for TradeHub, built with:

- ✅ **Firebase Authentication v9+** (Email/Password with proper error handling)
- ✅ **Firestore Database** (CRUD, queries, pagination, real-time listeners)
- ✅ **Security Rules** (Role-based access, public/private collections)
- ✅ **State Management** (Zustand + React hooks)
- ✅ **Performance Optimized** (Pagination, lazy loading, cleanup)
- ✅ **Hackathon-ready** (Complete E2E examples)

---

## 📁 Project Structure

```
src/
├── firebase/
│   ├── firebaseConfig.js       ← Firebase initialization (env-safe)
│   ├── authService.js          ← Authentication logic
│   ├── firestoreService.js     ← Database operations
│   ├── constants.js            ← Centralized constants & utils
│   ├── firebaseRules.txt       ← Security rules (deploy to Console)
│   └── FIREBASE_GUIDE.md       ← Full examples & best practices
├── hooks/
│   ├── useAuth.js              ← Auth state management hook
│   └── useFirestore.js         ← Data fetching hook (real-time + pagination)
└── store/
    └── useStore.js             ← Zustand store (integrated with Firebase)
```

---

## 🚀 Quick Start

### 1. Setup Environment Variables

Create `.env.local` (in project root, git-ignored):

```bash
# Copy from .env.example and fill in your Firebase credentials
# Get values from: Firebase Console > Project Settings > Your App
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id_here
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
```

### 2. Update Firestore Security Rules

1. Go to **Firebase Console** > **Firestore Database** > **Rules**
2. Copy-paste the rules from `src/firebase/firebaseRules.txt`
3. Click "Publish"

### 3. Use in Components

```jsx
// Signup component
import { useAuth } from '../hooks/useAuth';

export function RegisterComponent() {
  const { signup, loading, error } = useAuth();

  const handleSignup = async (email, password, name) => {
    const result = await signup(email, password, name);
    if (result.success) {
      // User logged in, profile created in Firestore
      console.log('Welcome!', result.user);
    }
  };
}
```

```jsx
// Product listing with Firebase
import { useFirestore } from '../hooks/useFirestore';
import { where, orderBy, limit } from 'firebase/firestore';

export function ProductListing() {
  const { data: products, loading } = useFirestore(
    'products',
    [
      where('category', '==', 'electronics'),
      orderBy('createdAt', 'desc'),
      limit(20)
    ],
    { realtime: false } // One-time fetch
  );

  return (
    <div>
      {loading && <p>Loading...</p>}
      {products?.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
```

---

## 🔐 Authentication

### Signup (Automatic Profile Creation)

```javascript
import { signup } from '../firebase/authService';

const result = await signup('user@example.com', 'password123', 'John Doe');
// Returns: { success: true, user: { uid, email, displayName } }
// Automatically creates user profile in Firestore
```

### Login

```javascript
import { login } from '../firebase/authService';

const result = await login('user@example.com', 'password123');
// Returns: { success: true, user: {...} }
```

### Logout

```javascript
import { logout } from '../firebase/authService';

const result = await logout();
// Returns: { success: true }
```

### Password Reset

```javascript
import { resetPassword } from '../firebase/authService';

const result = await resetPassword('user@example.com');
// Sends reset email to user
```

### Error Handling

All auth functions return standardized responses:

```javascript
{
  success: true,
  user: {...},
  error?: "error message",
  errorCode?: "auth/specific-code"
}
```

User-friendly error messages are in `authErrorMessages`:

```javascript
{
  "auth/email-already-in-use": "This email is already registered",
  "auth/wrong-password": "Incorrect password",
  "auth/user-not-found": "No account found",
  // ... more
}
```

---

## 📊 Firestore Operations

### Create Document

```javascript
import { createDocument } from '../firebase/firestoreService';

const result = await createDocument('products', 'prod_123', {
  name: 'Laptop',
  price: 999,
  category: 'electronics'
  // createdAt & updatedAt added automatically
});
```

### Read Document (One-time)

```javascript
import { readDocument } from '../firebase/firestoreService';

const { data } = await readDocument('products', 'prod_123');
// Returns: { id, name, price, ... }
```

### Update Document

```javascript
import { updateDocument } from '../firebase/firestoreService';

await updateDocument('products', 'prod_123', {
  price: 899,
  stock: 50
});
```

### Query Collection (One-time)

```javascript
import { queryCollection } from '../firebase/firestoreService';
import { where, orderBy, limit } from 'firebase/firestore';

const { data, lastDoc } = await queryCollection('products', {
  constraints: [
    where('category', '==', 'electronics'),
    where('price', '>=', 100),
    orderBy('price', 'asc'),
    limit(20)
  ]
});
```

---

## 🔄 Real-Time Listeners

### Subscribe to Document Changes

```javascript
import { subscribeToDocument } from '../firebase/firestoreService';
import { useEffect, useState } from 'react';

export function ProductDetail() {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToDocument(
      'products',
      'prod_123',
      (data, error) => {
        if (error) console.error(error);
        else setProduct(data);
      }
    );

    // ⚠️ CRITICAL: Cleanup to prevent memory leaks
    return () => unsubscribe();
  }, []);

  return <div>{product?.name}</div>;
}
```

### Subscribe to Query Results

```javascript
import { subscribeToQuery } from '../firebase/firestoreService';

useEffect(() => {
  const unsubscribe = subscribeToQuery(
    'products',
    [where('category', '==', 'electronics'), limit(10)],
    (data, error) => {
      if (!error) setProducts(data);
    }
  );

  return () => unsubscribe();
}, []);
```

### Using the Hook (Recommended)

The `useFirestore` hook handles cleanup automatically:

```javascript
import { useFirestore } from '../hooks/useFirestore';

// Real-time listener
const { data } = useFirestore('products', [...], { realtime: true });

// One-time fetch
const { data } = useFirestore('products', [...], { realtime: false });
```

---

## 📄 Pagination

### Load More Example

```javascript
import { useFirestorePagination } from '../hooks/useFirestore';
import { orderBy, limit } from 'firebase/firestore';

export function ProductList() {
  const {
    data: products,
    loading,
    hasMore,
    loadMore
  } = useFirestorePagination('products', [orderBy('createdAt', 'desc')], 20);

  return (
    <>
      {products.map(p => <ProductCard key={p.id} product={p} />)}
      {hasMore && (
        <button onClick={loadMore} disabled={loading}>
          Load More
        </button>
      )}
    </>
  );
}
```

### Manual Pagination

```javascript
import { paginateCollection } from '../firebase/firestoreService';

// First page
const { data, lastDoc, hasMore } = await paginateCollection(
  'products',
  [orderBy('createdAt', 'desc')],
  20
);

// Next page
if (hasMore) {
  const { data: nextPage } = await paginateCollection(
    'products',
    [orderBy('createdAt', 'desc')],
    20,
    { lastDoc, isNextPage: true }
  );
}
```

---

## 🔒 Security Rules

Security rules are in `src/firebase/firebaseRules.txt`. Key features:

### Public Collections (Anyone can read)

```
products/        ← Public read, authenticated write
reviews/         ← Public read, authenticated write
```

### User-Owned (Only owner or admin)

```
users/{userId}/           ← Only user or admin
orders/{orderId}          ← Only user or admin
wishlists/{id}            ← Only user or admin
```

### Admin Only

```
analytics/       ← Admin only
auditLogs/       ← Admin only
```

### Helper Functions in Rules

```javascript
isAuthenticated()  // User is logged in
isOwner(userId)    // User owns this document
isAdmin()          // User has admin role
```

---

## 👤 User Roles

Three roles are supported:

```javascript
const USER_ROLES = {
  USER: 'user',      // Regular users (default)
  SELLER: 'seller',  // Can list products
  ADMIN: 'admin'     // Full access
};
```

Set during signup or update later:

```javascript
import { updateUserProfile } from '../firebase/firestoreService';

await updateUserProfile(userId, { role: 'admin' });
```

Check permissions:

```javascript
import { hasPermission } from '../firebase/constants';

if (hasPermission(user.role, 'canCreateProducts')) {
  // Show seller dashboard
}
```

---

## 💾 Batch Operations

Update multiple documents atomically:

```javascript
import { batchWriteDocuments } from '../firebase/firestoreService';

await batchWriteDocuments([
  {
    type: 'set',
    collection: 'products',
    docId: 'prod_1',
    data: { name: 'Laptop', price: 999 }
  },
  {
    type: 'update',
    collection: 'users',
    docId: 'user_1',
    data: { points: 100 }
  },
  {
    type: 'delete',
    collection: 'cart',
    docId: 'item_1'
  }
]);
```

---

## 🎣 Custom Hooks

### useAuth Hook

Manages authentication state and operations:

```javascript
const {
  user,              // Current user object or null
  loading,           // Auth state being determined
  error,             // Error message if any
  isAuthenticated,   // Boolean
  signup,            // (email, password, name) => Promise
  login,             // (email, password) => Promise
  logout,            // () => Promise
  resetPassword,     // (email) => Promise
  clearError         // () => void
} = useAuth();
```

### useFirestore Hook

Fetches data with real-time or one-time options:

```javascript
const {
  data,              // Array of documents or single document
  loading,           // Boolean
  error,             // Error message if any
  refetch,           // Manually refetch
  lastDoc,           // For pagination
  hasMore            // For pagination
} = useFirestore(
  'products',        // Collection name
  [...constraints],  // Query constraints
  {
    realtime: false, // One-time fetch (default: true for real-time)
    docId: 'prod_123', // For single document
    enabled: true    // Can disable hook
  }
);
```

### useFirestorePagination Hook

Handles paginated queries:

```javascript
const {
  data,              // All loaded documents
  loading,           // Boolean
  error,             // Error message
  hasMore,           // More documents available
  loadMore           // () => void
} = useFirestorePagination(
  'products',
  [...constraints],
  20  // Page size
);
```

---

## 🛒 Cart & Wishlist (Firebase Ready)

Cart and wishlist are currently using local storage. To sync with Firebase:

```javascript
// In addToCart (src/store/useStore.js):

if (get().isAuthenticated) {
  // Sync to Firestore
  await updateDocument('users', userId, {
    cart: nextCart
  });
}
```

Or use a dedicated `carts` collection:

```javascript
// Users can have: users/{userId}/cart/{itemId}
```

---

## 🚨 Error Handling

All services return consistent responses:

```javascript
{
  success: boolean,
  data?: any,
  error?: string,
  errorCode?: string
}
```

Example:

```javascript
const result = await signup('invalid-email', 'pass', 'Name');

if (!result.success) {
  console.error(result.error);    // "Please enter a valid email"
  console.error(result.errorCode); // "auth/invalid-email"
}
```

Network errors are gracefully handled:

```javascript
{
  success: false,
  error: "Network error. Please check your internet connection."
}
```

---

## 📈 Performance Tips

### ✅ DO

- Use **one-time fetch** for static data (realtime: false)
- Implement **pagination** for large collections
- **Unsubscribe** from listeners in useEffect cleanup
- Use **Zustand store** to cache frequently accessed data
- **Index** your queries in Firestore Console

### ❌ DON'T

- Subscribe to large collections with real-time listeners
- Fetch the same data multiple places
- Forget to unsubscribe (memory leaks!)
- Hardcode Firebase credentials in code
- Trust client-side security alone

---

## 🔧 Advanced: Cloud Functions (Optional)

For business logic that needs to run on the backend:

```javascript
// Example: Order confirmation email on new order
export const onOrderCreated = functions.firestore
  .document('orders/{orderId}')
  .onCreate(async (snap) => {
    const order = snap.data();
    // Send confirmation email
    // Update analytics
    // etc.
  });
```

---

## ✅ Deployment Checklist

- [ ] `.env.local` configured (never commit this!)
- [ ] Firebase rules deployed
- [ ] Composite indexes created
- [ ] Auth providers enabled
- [ ] Test signup/login/logout
- [ ] Test product creation/update
- [ ] Test pagination
- [ ] Test error cases (wrong password, etc.)
- [ ] User roles set correctly
- [ ] Analytics enabled (optional)

---

## 📚 Full Documentation

See `src/firebase/FIREBASE_GUIDE.md` for:

- Complete E2E examples
- Firestore data schema
- Troubleshooting guide
- Cost optimization
- Security deep dive

---

## 🆘 Support & Troubleshooting

### "Permission denied" Error

→ Check Firestore security rules match your data structure

### Data not updating in real-time

→ Ensure `realtime: true` in useFirestore

### Memory leaks

→ Always unsubscribe from listeners in cleanup

### High Firestore costs

→ Use `realtime: false` and implement caching

### Environment variables not loading

→ Restart dev server after `.env.local` changes

---

## 📞 Firebase Resources

- [Firebase Docs](https://firebase.google.com/docs)
- [Firestore Queries](https://firebase.google.com/docs/firestore/query-data/queries)
- [Security Rules](https://firebase.google.com/docs/firestore/security/start)
- [Firebase Console](https://console.firebase.google.com)

---

**Built for hackathons. Ready for production.** 🚀
