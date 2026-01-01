import { create } from 'zustand'
import { mockUser, products } from '../utils/mockData'
import { getStorageItem, setStorageItem } from '../utils/helpers'

/**
 * TradeHub Store (Zustand)
 * 
 * Manages:
 * - Firebase auth state (integrated with useAuth hook)
 * - UI modal states (login, register)
 * - Cart and wishlist (local storage + future Firebase sync)
 * - User preferences and app state
 * 
 * Note: Auth state can be managed by useAuth() hook directly
 * This store serves as app-level state that may depend on auth
 */

const initialCart = getStorageItem('cart', [
  { ...products[1], quantity: 1 },
  { ...products[3], quantity: 2 },
])

const useStore = create((set, get) => ({
  // ========================================================================
  // AUTH & USER STATE (Integrated with Firebase)
  // ========================================================================
  user: null, // Firebase auth user object
  isAuthenticated: false, // Firebase auth state
  showLoginModal: false,
  showRegisterModal: false,
  authError: null,
  authLoading: false,

  /**
   * Set auth state from Firebase
   * Called from useAuth hook or auth components
   * 
   * @param {object} user - Firebase user object or null
   * @param {boolean} isLoading - Is auth state being determined
   */
  setAuthState: (user, isLoading = false) => {
    set({
      user,
      isAuthenticated: !!user,
      authLoading: isLoading,
      authError: null,
    })
  },

  /**
   * Set auth error message
   */
  setAuthError: (error) => {
    set({ authError: error })
  },

  /**
   * Clear auth error
   */
  clearAuthError: () => {
    set({ authError: null })
  },

  /**
   * Require authentication before proceeding
   * Opens login modal if not authenticated
   */
  requireAuth: (onAuthenticated) => {
    if (!get().isAuthenticated) {
      set({ showLoginModal: true })
      return false
    }
    if (typeof onAuthenticated === 'function') onAuthenticated()
    return true
  },

  toggleLoginModal: () => set((state) => ({ showLoginModal: !state.showLoginModal })),
  toggleRegisterModal: () => set((state) => ({ showRegisterModal: !state.showRegisterModal })),

  // Deprecated: Use Firebase auth instead
  // Kept for backward compatibility
  login: (userData = mockUser) => set({ user: userData, isAuthenticated: true, showLoginModal: false, showRegisterModal: false }),
  logout: () => set({ user: null, isAuthenticated: false }),

  // ========================================================================
  // CART STATE & OPERATIONS
  // ========================================================================
  cart: initialCart,

  /**
   * Add product to cart
   * Increases quantity if already in cart
   */
  addToCart: (product, quantity = 1) => {
    const cart = get().cart
    const existing = cart.find((item) => item.id === product.id)
    const nextCart = existing
      ? cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        )
      : [...cart, { ...product, quantity }]
    set({ cart: nextCart })
    setStorageItem('cart', nextCart)
    
    // TODO: Sync with Firebase Firestore when user is authenticated
    // if (get().isAuthenticated) {
    //   updateCartInFirestore(get().user.uid, nextCart);
    // }
  },

  removeFromCart: (productId) => {
    const nextCart = get().cart.filter((item) => item.id !== productId)
    set({ cart: nextCart })
    setStorageItem('cart', nextCart)
  },

  updateCartQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId)
      return
    }
    const nextCart = get().cart.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    )
    set({ cart: nextCart })
    setStorageItem('cart', nextCart)
  },

  clearCart: () => {
    set({ cart: [] })
    setStorageItem('cart', [])
  },

  getCartTotal: () => get().cart.reduce((total, item) => total + item.price * item.quantity, 0),
  getCartCount: () => get().cart.reduce((count, item) => count + item.quantity, 0),

  // ========================================================================
  // WISHLIST STATE & OPERATIONS
  // ========================================================================
  wishlist: getStorageItem('wishlist', [products[0], products[2]]),

  addToWishlist: (product) => {
    const wishlist = get().wishlist
    if (wishlist.find((p) => p.id === product.id)) return
    const nextWishlist = [...wishlist, product]
    set({ wishlist: nextWishlist })
    setStorageItem('wishlist', nextWishlist)
    
    // TODO: Sync with Firebase when user is authenticated
    // if (get().isAuthenticated) {
    //   addToWishlistInFirestore(get().user.uid, product);
    // }
  },

  removeFromWishlist: (productId) => {
    const nextWishlist = get().wishlist.filter((item) => item.id !== productId)
    set({ wishlist: nextWishlist })
    setStorageItem('wishlist', nextWishlist)
  },

  isInWishlist: (productId) => get().wishlist.some((item) => item.id === productId),

  moveToCart: (productId) => {
    const product = get().wishlist.find((item) => item.id === productId)
    if (!product) return
    get().addToCart(product)
    get().removeFromWishlist(productId)
  },
}))

export default useStore