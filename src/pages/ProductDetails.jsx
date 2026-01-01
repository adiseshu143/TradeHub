import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Star, ShoppingCart, Heart } from 'lucide-react'
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
    addToCart(product)
  }

  return (
    <main className="bg-bg-secondary min-h-screen py-10">
      <div className="container px-4 grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
        <section className="bg-white border border-border rounded-2xl p-6 shadow-card">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-border rounded-xl overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
            </div>
            <div className="space-y-4">
              <p className="text-sm text-text-secondary">{product.category}</p>
              <h1 className="text-2xl font-bold text-text-primary">{product.name}</h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-warning-500">
                  <Star className="w-4 h-4 fill-warning-500" aria-hidden="true" />
                  <span className="font-semibold text-text-primary">{product.rating}</span>
                </div>
                <span className="text-sm text-text-secondary">({product.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-3xl font-bold text-primary-600">{formatPrice(product.price)}</p>
                {product.originalPrice > product.price && (
                  <div className="flex items-center gap-2">
                    <span className="text-text-secondary line-through">{formatPrice(product.originalPrice)}</span>
                    <span className="pill">-{discount}%</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-text-secondary leading-relaxed">{product.description}</p>

              <div className="flex flex-wrap gap-2">
                {product.highlights?.map((item) => (
                  <span key={item} className="pill">{item}</span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button fullWidth onClick={handleAddToCart} disabled={!product.inStock} ariaLabel="Add to cart">
                  <ShoppingCart className="w-4 h-4 mr-2" aria-hidden="true" />
                  {product.inStock ? 'Add to cart' : 'Out of stock'}
                </Button>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={toggleWishlist}
                  ariaLabel="Toggle wishlist"
                >
                  <Heart className={`w-4 h-4 mr-2 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} aria-hidden="true" />
                  {isInWishlist(product.id) ? 'Wishlisted' : 'Save for later'}
                </Button>
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <SellerComparison sellers={product.sellers} onSelectSeller={addToCart} />

          <section className="bg-white rounded-2xl p-6 border border-border shadow-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-text-primary">Reviews</h2>
              <Button size="sm" onClick={() => requireAuth(() => setShowReview(true))} ariaLabel="Add review">
                Add review
              </Button>
            </div>
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </section>
        </aside>
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
