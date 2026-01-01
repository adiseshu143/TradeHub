# 🏗️ Firebase Backend Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    REACT FRONTEND LAYER                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Home Page   │  │  Dashboard   │  │  Auth Pages  │  ...     │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    CUSTOM HOOKS LAYER                           │
│  ┌──────────────┐  ┌──────────────────────────┐               │
│  │   useAuth    │  │   useFirestore           │               │
│  │ - user       │  │ - data                   │               │
│  │ - loading    │  │ - loading                │               │
│  │ - signup()   │  │ - error                  │               │
│  │ - login()    │  │ - refetch()              │               │
│  │ - logout()   │  │ - pagination support     │               │
│  └──────────────┘  └──────────────────────────┘               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   SERVICE LAYER                                 │
│  ┌──────────────────┐  ┌──────────────────────┐               │
│  │  authService.js  │  │ firestoreService.js  │               │
│  │ - signUp()       │  │ - createDocument()   │               │
│  │ - login()        │  │ - readDocument()     │               │
│  │ - logout()       │  │ - updateDocument()   │               │
│  │ - resetPassword()│  │ - queryCollection()  │               │
│  │ - Error messages │  │ - subscribeToXxx()   │               │
│  └──────────────────┘  │ - paginateXxx()      │               │
│                        │ - batchWrite()       │               │
│                        └──────────────────────┘               │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  constants.js - Validation, roles, utilities, formatters │ │
│  └──────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              FIREBASE SDK (Modular v9+)                         │
│  ┌──────────────┐  ┌──────────────────────────┐               │
│  │  Firebase    │  │  Firestore JS SDK        │               │
│  │  Auth v9     │  │  - getAuth()             │               │
│  │              │  │  - getFirestore()        │               │
│  │              │  │  - onSnapshot()          │               │
│  │              │  │  - query()               │               │
│  └──────────────┘  └──────────────────────────┘               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│           FIREBASE BACKEND (Cloud)                              │
│  ┌──────────────┐  ┌──────────────────────────┐               │
│  │ Firebase     │  │ Firestore Database       │               │
│  │ Authentication│  │ - Collections            │               │
│  │ - Email/Pass │  │ - Documents              │               │
│  │ - Sessions   │  │ - Real-time Sync         │               │
│  │ - Security   │  │ - Security Rules         │               │
│  └──────────────┘  └──────────────────────────┘               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow: User Signup

```
User fills signup form
        ↓
Component calls useAuth().signup(email, password, name)
        ↓
useAuth hook calls authService.signUp()
        ↓
authService.signUp():
  • Create Firebase Auth user
  • Get user UID
  • Create Firestore profile document
  • Return user object
        ↓
useAuth hook updates state (user, isAuthenticated)
        ↓
Component updates (e.g., shows dashboard)
        ↓
onAuthStateChange listener fires (auto-sync)
```

---

## Data Flow: Fetch Products

### One-Time Fetch (Static Data)

```
Component mounts
        ↓
useFirestore('products', [where(...), limit(20)], { realtime: false })
        ↓
Hook calls queryCollection()
        ↓
Firebase executes query (1 read cost)
        ↓
Data returned to component
        ↓
Component renders products
        ↓
No ongoing listener (cost-efficient!)
```

### Real-Time Listener (Live Updates)

```
Component mounts
        ↓
useFirestore('products', [...], { realtime: true })
        ↓
Hook calls subscribeToQuery()
        ↓
Firebase sends initial data (1 read)
        ↓
Component renders products
        ↓
Firebase watches for changes:
  • Product updated → Component updates immediately
  • New product added → Component re-renders
  • Product deleted → Component updates
        ↓
Component unmounts
        ↓
Hook cleanup unsubscribes from listener (prevents memory leaks)
```

---

## Firestore Collections Structure

```
Firestore
├── users/{userId}
│   ├── uid: string (matches Auth UID)
│   ├── email: string
│   ├── displayName: string
│   ├── role: "user" | "seller" | "admin"
│   ├── avatar: string (URL)
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
│
├── products/{productId}
│   ├── name: string
│   ├── price: number
│   ├── category: string
│   ├── stock: number
│   ├── inStock: boolean
│   ├── sellerId: string (ref to users)
│   ├── rating: number
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
│
├── orders/{orderId}
│   ├── userId: string (ref to users)
│   ├── items: [{productId, quantity, price}]
│   ├── totalPrice: number
│   ├── status: string (pending|confirmed|shipped|delivered)
│   ├── shippingAddress: object
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
│
├── reviews/{reviewId}
│   ├── userId: string
│   ├── productId: string
│   ├── rating: 1-5
│   ├── comment: string
│   ├── helpful: number
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
│
└── wishlists/{wishlistId}
    ├── userId: string
    ├── productId: string
    └── createdAt: timestamp
```

---

## Security Rules Flow

```
Request to Firestore
        ↓
Is user authenticated?
  ├─ NO → Check if reading public collection (products, reviews)
  │       ├─ YES → Allow read
  │       └─ NO → Deny
  │
  └─ YES → Check user's role & permissions
          ├─ Trying to read /users/{userId}
          │   ├─ User is {userId} (owner) → Allow
          │   ├─ User is admin → Allow
          │   └─ Other → Deny
          │
          ├─ Trying to write /products/{productId}
          │   ├─ User is selling this product (owner) → Allow
          │   ├─ User is admin → Allow
          │   └─ Other → Deny
          │
          └─ Trying to access /admin/{doc}
              ├─ User is admin → Allow
              └─ Other → Deny
```

---

## File Dependencies

```
Components
    ↓
useAuth() hook ──────→ authService.js ──→ firebase/auth
  useFirestore() ────→ firestoreService.js ──→ firebase/firestore

All services ──→ firebaseConfig.js ──→ Firebase SDK

Components ──→ constants.js ──→ Validation, formatting, roles
```

---

## Authentication State Flow

```
App mounted
        ↓
Initialize Firebase
        ↓
Setup onAuthStateChange listener
        ↓
┌─────────────────────────────────────┐
│ Listener fires with current user    │
│ (persisted from browser storage)    │
└─────────────────────────────────────┘
        ↓
useAuth hook updates:
  • user = {uid, email, displayName}
  • loading = false
  • isAuthenticated = true
        ↓
Component re-renders (logged in UI shown)
        ↓
User navigates away / browser closes
        ↓
Firebase persists session (browser local storage)
        ↓
User returns
        ↓
onAuthStateChange fires again
        ↓
User automatically logged in (UX!)
```

---

## Pagination Flow

```
Component mounts
        ↓
useFirestorePagination('products', [...], 20)
        ↓
Hook loads first page (20 items)
        ↓
Renders items, shows "Load More" button
        ↓
User clicks "Load More"
        ↓
Hook calls paginateCollection with lastDoc
        ↓
Firebase loads next 20 items starting after lastDoc
        ↓
More items added to data array
        ↓
Component re-renders with all items (initial + new)
        ↓
If < 20 items returned → hasMore = false → hide button
```

---

## Error Handling Flow

```
User action (signup, fetch, etc.)
        ↓
Firebase operation
        ↓
Error occurs? ──NO──→ Return { success: true, data }
  │
  └─YES→ Check error type
        │
        ├─ auth/invalid-email
        │  └→ Return { success: false, error: "Please enter valid email" }
        │
        ├─ auth/wrong-password
        │  └→ Return { success: false, error: "Incorrect password" }
        │
        ├─ network-error
        │  └→ Return { success: false, error: "Check internet connection" }
        │
        └─ Other
           └→ Return { success: false, error: "Something went wrong" }
        ↓
Component receives response
        ↓
Check response.success
  ├─ YES → Update state, show success message
  └─ NO → Show response.error to user
```

---

## Memory Management

### Good ✅

```javascript
useEffect(() => {
  const unsubscribe = subscribeToDocument(...);
  
  return () => unsubscribe(); // ✅ Cleanup!
}, []);
```

Behavior:
- Listener starts when component mounts
- When component unmounts → cleanup function runs
- unsubscribe() removes listener
- No memory leaks!

### Bad ❌

```javascript
subscribeToDocument(...); // No cleanup!

// Listener runs even after component unmounts
// Memory grows with each mount/unmount
// Memory leak!
```

---

## Cost Optimization

### Expensive ❌

```javascript
// Real-time listener = 1 read + 1 read per update
subscribeToQuery('products', [...]);

// If products change 10x/day:
// Cost = 1 + 10 = 11 reads/day per user
```

### Efficient ✅

```javascript
// One-time fetch = 1 read
queryCollection('products', [...], { realtime: false });

// If queried 3x/day:
// Cost = 3 reads/day per user
```

**Rule:** Use one-time fetch for static data, real-time for live data.

---

## Testing Checklist

```
✅ Authentication
  ├─ Signup with new email
  ├─ Login with correct credentials
  ├─ Login fails with wrong password
  ├─ Logout works
  └─ Auth state persists on page reload

✅ Database
  ├─ Create documents
  ├─ Read documents
  ├─ Update documents
  ├─ Delete documents
  └─ Query with filters

✅ Real-Time
  ├─ Subscribe to document
  ├─ See changes in real-time
  └─ Cleanup on unmount (DevTools > Memory)

✅ Pagination
  ├─ Load first page
  ├─ Load more works
  └─ hasMore = false at end

✅ Security
  ├─ Public read products
  ├─ Can't read other user's profile
  ├─ Can't create product without auth
  └─ Admin can do anything

✅ Error Handling
  ├─ Network error shows message
  ├─ Invalid input shows error
  └─ Offline mode handled gracefully
```

---

This architecture is:
- ✅ **Scalable** - Works from hackathon to production
- ✅ **Secure** - Rules-based, no secrets exposed
- ✅ **Efficient** - Smart pagination, optional real-time
- ✅ **Developer-friendly** - Clean hooks, good docs
- ✅ **Maintainable** - Separated concerns, reusable services
