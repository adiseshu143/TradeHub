import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import CartItem from '../components/cart/CartItem'
import CartSummary from '../components/cart/CartSummary'
import useStore from '../store/useStore'
import Button from '../components/common/Button'

const Cart = () => {
  const navigate = useNavigate()
  const { cart, updateCartQuantity, removeFromCart, getCartTotal, clearCart, requireAuth } = useStore()

  const subtotal = getCartTotal()
  const shipping = subtotal > 0 ? 12 : 0
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleCheckout = () => {
    const ok = requireAuth(() => navigate('/checkout'))
    if (!ok) return
  }

  return (
    <main className="bg-bg-secondary min-h-screen py-10">
      <div className="container px-4 grid lg:grid-cols-[1fr_320px] gap-6">
        <section className="bg-white border border-border rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-text-primary">Shopping cart</h1>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-sm text-primary-600 font-semibold hover:underline"
                aria-label="Clear cart"
              >
                Clear cart
              </button>
            )}
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-lg font-semibold text-text-primary">Your cart is empty</p>
              <p className="text-sm text-text-secondary mb-4">Add something you love to get started.</p>
              <Button onClick={() => navigate('/products')}>Browse products</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {cart.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateCartQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>

        <CartSummary
          subtotal={subtotal}
          shipping={shipping}
          tax={tax}
          total={total}
          onCheckout={handleCheckout}
        />
      </div>
    </main>
  )
}

export default Cart
