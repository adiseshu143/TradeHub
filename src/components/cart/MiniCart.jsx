import { useState, useRef, useEffect } from 'react'
import { ShoppingCart, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useStore from '../../store/useStore'
import { formatPrice } from '../../utils/helpers'

const MiniCart = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const { cart, getCartTotal, removeFromCart } = useStore()
  const dropdownRef = useRef(null)
  
  const subtotal = getCartTotal()
  const displayItems = cart.slice(0, 3)
  const hiddenCount = cart.length - displayItems.length

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const handleViewCart = () => {
    navigate('/cart')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full right-0 mt-2 w-80 bg-white border border-border rounded-xl shadow-xl z-50"
      role="dialog"
      aria-label="Mini cart"
    >
      {cart.length === 0 ? (
        <div className="p-6 text-center">
          <ShoppingCart className="w-12 h-12 mx-auto text-gray-300 mb-2" />
          <p className="text-sm font-semibold text-text-primary">Your cart is empty</p>
        </div>
      ) : (
        <>
          <div className="p-4 border-b border-border max-h-64 overflow-y-auto">
            <h3 className="font-semibold text-text-primary mb-3">Cart items</h3>
            <div className="space-y-2">
              {displayItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg group"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-text-primary truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Remove ${item.name}`}
                  >
                    <X className="w-4 h-4 text-text-secondary hover:text-error-600" />
                  </button>
                </div>
              ))}
              {hiddenCount > 0 && (
                <p className="text-xs text-text-secondary text-center py-2">
                  +{hiddenCount} more item{hiddenCount > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>

          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-text-secondary">Subtotal</span>
              <span className="font-bold text-text-primary">{formatPrice(subtotal)}</span>
            </div>
          </div>

          <div className="p-4 space-y-2">
            <button
              onClick={handleViewCart}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              View cart
            </button>
            <button
              onClick={onClose}
              className="w-full border border-border text-text-primary font-semibold py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Continue shopping
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default MiniCart
