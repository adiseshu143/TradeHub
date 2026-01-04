import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import useStore from '../../store/useStore'
import { formatPrice, calculateDiscount } from '../../utils/helpers'
import Button from '../common/Button'

const ProductCard = ({ product }) => {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useStore()
  const isWishlisted = isInWishlist(product.id)
  const discount = calculateDiscount(product.originalPrice, product.price)
  
  const handleAddToCart = (e) => {
    e.preventDefault()
    addToCart(product)
    toast.success('Added to cart')
  }
  
  const handleToggleWishlist = (e) => {
    e.preventDefault()
    if (isWishlisted) {
      removeFromWishlist(product.id)
      toast.success('Removed from wishlist')
    } else {
      addToWishlist(product)
      toast.success('Saved to wishlist')
    }
  }
  
  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
    >
      <Link to={`/products/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gray-100 aspect-square">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Discount Badge */}
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{discount}%
            </span>
          )}
          
          {/* Wishlist Button */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
              aria-hidden="true"
            />
          </button>
          
          {/* Stock Status */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="p-4">
          <p className="text-xs text-text-secondary mb-1">{product.category}</p>
          <h3 className="font-semibold text-text-primary mb-2 line-clamp-2 min-h-[3rem]">
            {product.name}
          </h3>
          
          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-4 h-4 fill-warning-500 text-warning-500" aria-hidden="true" />
            <span className="text-sm font-medium text-text-primary">{product.rating}</span>
            <span className="text-xs text-text-secondary">({product.reviews})</span>
          </div>
          
          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl font-bold text-primary-600">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-text-secondary line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          
          {/* Seller */}
          <p className="text-xs text-text-secondary mb-3">
            Sold by <span className="font-medium text-text-primary">{product.seller}</span>
          </p>
        </div>
      </Link>
      
      {/* Add to Cart Button */}
      <div className="px-4 pb-4">
        <Button
          onClick={handleAddToCart}
          fullWidth
          disabled={!product.inStock}
          ariaLabel={`Add ${product.name} to cart`}
        >
          <ShoppingCart className="w-4 h-4 mr-2" aria-hidden="true" />
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </div>
    </motion.article>
  )
}

export default ProductCard