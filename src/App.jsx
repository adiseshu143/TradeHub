import { useState, Suspense, lazy } from 'react'
import { NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ShoppingBag, ShoppingCart, Heart, User, Sparkles, Menu, X, Search } from 'lucide-react'
import Footer from './components/layout/Footer'
import MobileNav from './components/layout/MobileNav'
import useStore from './store/useStore'
import LoginModal from './components/auth/LoginModal'
import RegisterModal from './components/auth/RegisterModal'
import { searchAndRecommendProducts } from './utils/helpers'
import { products } from './utils/mockData'
import './App.css'

const Home = lazy(() => import('./pages/Home'))
const ProductListing = lazy(() => import('./pages/ProductListing'))
const ProductDetails = lazy(() => import('./pages/ProductDetails'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const OrderTracking = lazy(() => import('./pages/OrderTracking'))
const Profile = lazy(() => import('./pages/Profile'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const About = lazy(() => import('./pages/About'))

const Header = () => {
  const { getCartCount } = useStore()
  const navigate = useNavigate()
  const cartCount = getCartCount()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const navLinkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive ? 'bg-primary-50 text-primary-700' : 'text-text-secondary hover:text-text-primary'
    }`

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to products page with search query
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
      setMobileOpen(false)
    }
  }

  // Get search suggestions from navbar (real-time as user types)
  const getSearchSuggestions = (query) => {
    if (!query.trim()) return []
    return searchAndRecommendProducts(products, query).slice(0, 5)
  }

  const searchSuggestions = getSearchSuggestions(searchQuery)

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur shadow-sm">
      <div className="container px-4">
        <div className="flex items-center justify-between h-16 gap-6">
          <NavLink to="/" className="flex items-center gap-2 font-bold text-lg text-primary-700 flex-shrink-0">
            <img 
              src="/TradeHub_logo.jpeg" 
              alt="TradeHub logo" 
              className="w-9 h-9 rounded-xl object-cover shadow-hard"
            />
            <span className="hidden sm:inline">TradeHub</span>
          </NavLink>

          <nav className="hidden lg:flex items-center gap-0.5">
            <NavLink to="/" className={navLinkClass}>Home</NavLink>
            <NavLink to="/products" className={navLinkClass}>Products</NavLink>
            <NavLink to="/wishlist" className={navLinkClass}>Wishlist</NavLink>
            <NavLink to="/about" className={navLinkClass}>About</NavLink>
          </nav>

          <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                aria-label="Search products"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary-600 transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4" aria-hidden="true" />
              </button>

              {/* Search Suggestions Dropdown */}
              {searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-lg shadow-lg z-50">
                  <div className="py-2 max-h-80 overflow-y-auto">
                    {searchSuggestions.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        onClick={() => {
                          setSearchQuery(product.name)
                          navigate(`/products?search=${encodeURIComponent(product.name)}`)
                          setSearchQuery('')
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-border last:border-b-0"
                      >
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">{product.name}</p>
                          <p className="text-xs text-text-secondary">{product.category}</p>
                        </div>
                        <span className="text-sm font-semibold text-primary-600 flex-shrink-0">
                          ${product.price}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </form>

          <div className="flex items-center gap-1">
            <NavLink to="/wishlist" className={navLinkClass} aria-label="Wishlist">
              <Heart className="w-5 h-5" aria-hidden="true" />
            </NavLink>
            <NavLink to="/cart" className={navLinkClass} aria-label="Cart">
              <div className="relative">
                <ShoppingCart className="w-5 h-5" aria-hidden="true" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-[10px] font-semibold rounded-full px-1.5 py-0.5">
                    {cartCount}
                  </span>
                )}
              </div>
            </NavLink>
            <NavLink to="/profile" className={navLinkClass} aria-label="Profile">
              <User className="w-5 h-5" aria-hidden="true" />
            </NavLink>
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 ml-1"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-border shadow-md">
          <div className="container px-4 py-4 space-y-4">
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative w-full">
                <input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pr-10 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                  aria-label="Search products"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary-600 transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" aria-hidden="true" />
                </button>

                {/* Mobile Search Suggestions */}
                {searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-lg shadow-lg z-50">
                    <div className="py-2 max-h-64 overflow-y-auto">
                      {searchSuggestions.map((product) => (
                        <button
                          key={product.id}
                          type="button"
                          onClick={() => {
                            setSearchQuery(product.name)
                            navigate(`/products?search=${encodeURIComponent(product.name)}`)
                            setSearchQuery('')
                            setMobileOpen(false)
                          }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 border-b border-border last:border-b-0"
                        >
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text-primary truncate">{product.name}</p>
                            <p className="text-xs text-text-secondary">{product.category}</p>
                          </div>
                          <span className="text-sm font-semibold text-primary-600 flex-shrink-0">
                            ${product.price}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </form>
            <nav className="flex flex-col gap-1">
              <NavLink to="/" className={navLinkClass} onClick={() => setMobileOpen(false)}>Home</NavLink>
              <NavLink to="/products" className={navLinkClass} onClick={() => setMobileOpen(false)}>Products</NavLink>
              <NavLink to="/wishlist" className={navLinkClass} onClick={() => setMobileOpen(false)}>Wishlist</NavLink>
              <NavLink to="/about" className={navLinkClass} onClick={() => setMobileOpen(false)}>About</NavLink>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}

const App = () => {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-12 w-full bg-gradient-to-r from-primary-600 via-primary-500 to-amber-400 text-white text-sm font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4" aria-hidden="true" />
        Holiday drop: free 2-day shipping on orders over $99
      </div>
      <Header />

      <main className="flex-1 pb-20 lg:pb-0">
        <Suspense fallback={<div className="py-12 text-center text-text-secondary">Loading…</div>}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>
                    <Home />
                  </motion.div>
                }
              />
              <Route path="/products" element={<ProductListing />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders/:orderId" element={<OrderTracking />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/wishlist" element={<Wishlist />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>

      <MobileNav />
      <Footer />
      <LoginModal />
      <RegisterModal />
    </div>
  )
}

export default App
