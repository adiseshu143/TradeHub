import { Minus, Plus, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatPrice } from '../../utils/helpers'

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > 0) {
      onUpdateQuantity(item.id, newQuantity)
    }
  }
  
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex gap-4 bg-white rounded-lg p-4 shadow-sm"
    >
      <img
        src={item.image}
        alt={item.name}
        className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
        loading="lazy"
      />
      
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-text-primary mb-1 line-clamp-2">
          {item.name}
        </h3>
        <p className="text-sm text-text-secondary mb-2">{item.seller}</p>
        <p className="text-lg font-bold text-primary-600">
          {formatPrice(item.price)}
        </p>
      </div>
      
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={() => onRemove(item.id)}
          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
          aria-label={`Remove ${item.name} from cart`}
        >
          <Trash2 className="w-5 h-5 text-red-500" aria-hidden="true" />
        </button>
        
        <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="p-2 hover:bg-gray-100 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" aria-hidden="true" />
          </button>
          <span className="w-8 text-center font-medium" aria-label={`Quantity: ${item.quantity}`}>
            {item.quantity}
          </span>
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="p-2 hover:bg-gray-100 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </motion.article>
  )
}

export default CartItem