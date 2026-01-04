import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Star, ShoppingCart, Heart, Check, Truck } from 'lucide-react'
import { products } from '../utils/mockData'
import { formatPrice, calculateDiscount } from '../utils/helpers'
import Button from '../components/common/Button'
import SellerComparison from '../components/products/SellerComparison'
import ReviewCard from '../components/reviews/ReviewCard'
import AddReviewModal from '../components/reviews/AddReviewModal'
import useStore from '../store/useStore'

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = useMemo(() => products.find((p) => p.id === id), [id])
  const [quantity, setQuantity] = useState(1)
  const [reviews, setReviews] = useState([
    {
      id: 'r1',
      user: 'Priya K',
      rating: 5,
      title: 'Perfect for remote work',
      comment: 'Loved the build and battery life. Shipping was fast and packaging secure.',
      date: '2024-10-02',
    },
  ])
  const [showReview, setShowReview] = useState(false)
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, requireAuth } = useStore()

  if (!product) {
    return (
      <main className="min-h-screen grid place-items-center bg-bg-secondary">
        <div className="text-center space-y-3">
          <p className="text-lg font-semibold text-text-primary">Product not found</p>
          <Button onClick={() => navigate('/products')}>Back to products</Button>
        </div>
      </main>
    )
  }

  const discount = calculateDiscount(product.originalPrice, product.price)
  const toggleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const handleAddReview = (payload) => {
    setReviews((prev) => [payload, ...prev])
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    setQuantity(1)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate('/checkout')
  }

  return (
    <main className="bg-bg-secondary min-h-screen py-10">
      <div className="container px-4">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm">
          <button onClick={() => navigate('/')} className="text-primary-600 hover:underline">Home</button>
          <span className="text-text-secondary">/</span>
          <button onClick={() => navigate('/products')} className="text-primary-600 hover:underline">Products</button>
          <span className="text-text-secondary">/</span>
          <span className="text-text-secondary">{product.category}</span>
        </nav>

        {/* Main Grid: Image | Details | Sidebar */}
        <div className="grid lg:grid-cols-[1fr_1.2fr_320px] gap-8">
          {/* Left: Image */}
          <section className="bg-white border border-border rounded-xl overflow-hidden shadow-card">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-96 object-cover" 
              loading="lazy" 
            />
            {/* Could add thumbnails here in the future */}
          </section>

          {/* Center: Details */}
          <section className="space-y-6">
            {/* Title & Rating */}
            <div className="bg-white border border-border rounded-xl p-6 shadow-card">
              <p className="text-xs font-semibold text-primary-600 uppercase mb-2">{product.category}</p>
              <h1 className="text-3xl font-bold text-text-primary mb-3">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                <div className="flex items-center gap-1 text-warning-500">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      className={`w-5 h-5 ${i < Math.round(product.rating) ? 'fill-warning-500' : ''}`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <span className="font-semibold text-text-primary">{product.rating}</span>
                <a href="#reviews" className="text-primary-600 hover:underline text-sm font-semibold">
                  {product.reviews} customer reviews
                </a>
              </div>

              {/* Price Section */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold text-primary-600">{formatPrice(product.price)}</span>
                  {product.originalPrice > product.price && (
                    <>
                      <span className="text-lg text-text-secondary line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                      <span className="text-lg font-bold text-error-600">Save {discount}%</span>
                    </>
                  )}
                </div>
              </div>

              {/* Description & Highlights */}
              <div className="mb-6">
                <p className="text-text-secondary leading-relaxed mb-4">{product.description}</p>
                
                {product.highlights && product.highlights.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-text-primary mb-2">Key Features:</h3>
                    <ul className="space-y-2">
                      {product.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-text-secondary">
                          <Check className="w-4 h-4 text-success-600 flex-shrink-0 mt-0.5" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Shipping Info */}
              <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="w-4 h-4 text-primary-600" />
                  <span className="text-text-secondary">FREE delivery on orders over ₹2,499</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-success-600" />
                  <span className="text-text-secondary">Sold and shipped by TradeHub</span>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <section id="reviews" className="bg-white border border-border rounded-xl p-6 shadow-card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text-primary">Customer Reviews</h2>
                <Button size="sm" onClick={() => requireAuth(() => setShowReview(true))}>
                  Write a review
                </Button>
              </div>
              
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-text-secondary text-center py-6">No reviews yet. Be the first to review!</p>
                ) : (
                  reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))
                )}
              </div>
            </section>
          </section>

          {/* Right: Sticky Purchase Card */}
          <aside className="h-fit sticky top-24">
            <div className="bg-white border border-border rounded-xl shadow-card overflow-hidden">
              {/* Price */}
              <div className="p-6 bg-gradient-to-b from-gray-50 to-white border-b border-border">
                <p className="text-text-secondary text-sm mb-1">Price:</p>
                <p className="text-4xl font-bold text-primary-600">{formatPrice(product.price)}</p>
                {product.originalPrice > product.price && (
                  <p className="text-sm text-text-secondary mt-1">
                    Save {discount}% - List: {formatPrice(product.originalPrice)}
                  </p>
                )}
              </div>

              {/* Stock Status */}
              <div className="p-6 border-b border-border">
                {product.inStock ? (
                  <p className="text-success-600 font-semibold flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    In stock - Order soon
                  </p>
                ) : (
                  <p className="text-error-600 font-semibold">Out of stock</p>
                )}
              </div>

              {/* Quantity Selector */}
              {product.inStock && (
                <div className="p-6 border-b border-border">
                  <label htmlFor="quantity" className="text-sm font-semibold text-text-primary block mb-2">
                    Quantity:
                  </label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((q) => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Action Buttons */}
              <div className="p-6 space-y-2">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="w-full bg-warning-400 hover:bg-warning-500 disabled:bg-gray-300 text-text-primary font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Buy Now
                </button>
                <button
                  onClick={toggleWishlist}
                  className="w-full border border-border text-text-primary hover:bg-gray-50 font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  {isInWishlist(product.id) ? 'Saved' : 'Save for later'}
                </button>
              </div>

              {/* Seller Comparison Link */}
              <div className="p-6 border-t border-border bg-gray-50 text-center">
                <p className="text-sm text-text-secondary mb-2">Compare sellers</p>
                <p className="text-xs text-text-secondary">See other options from different sellers</p>
              </div>
            </div>
          </aside>
        </div>

        {/* Below Content */}
        <section className="mt-12 grid lg:grid-cols-2 gap-8">
          <div className="bg-white border border-border rounded-xl p-6 shadow-card">
            <h3 className="text-xl font-bold text-text-primary mb-4">About this item</h3>
            <p className="text-text-secondary leading-relaxed">{product.description}</p>
          </div>

          <div className="bg-white border border-border rounded-xl p-6 shadow-card">
            <h3 className="text-xl font-bold text-text-primary mb-4">Shipping & Returns</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex gap-2"><Check className="w-4 h-4 text-success-600 flex-shrink-0" /> Free delivery on orders over ₹2,499</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-success-600 flex-shrink-0" /> 30-day returns policy</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-success-600 flex-shrink-0" /> Secure checkout with encryption</li>
              <li className="flex gap-2"><Check className="w-4 h-4 text-success-600 flex-shrink-0" /> Track your order in real-time</li>
            </ul>
          </div>
        </section>
      </div>

      <AddReviewModal
        isOpen={showReview}
        onClose={() => setShowReview(false)}
        onSubmit={handleAddReview}
      />
    </main>
  )
}

export default ProductDetails
