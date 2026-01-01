import { useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import useStore from '../store/useStore'
import { formatPrice } from '../utils/helpers'

const Checkout = () => {
  const navigate = useNavigate()
  const { cart, getCartTotal, requireAuth } = useStore()
  const allowed = requireAuth()
  if (!allowed) return null

  const subtotal = getCartTotal()
  const shipping = subtotal > 0 ? 12 : 0
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handlePlaceOrder = (e) => {
    e.preventDefault()
    navigate('/orders/ORD-2024-118')
  }

  return (
    <main className="bg-bg-secondary min-h-screen py-10">
      <div className="container px-4 grid lg:grid-cols-2 gap-8">
        <section className="bg-white border border-border rounded-2xl p-6 shadow-card">
          <h1 className="text-2xl font-bold text-text-primary mb-4">Checkout</h1>
          <form className="space-y-6" onSubmit={handlePlaceOrder}>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Full name" placeholder="Alex Carter" required />
              <Input label="Email" type="email" placeholder="alex@example.com" required />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Address" placeholder="123 Main St" required />
              <Input label="City" placeholder="New York" required />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <Input label="State" placeholder="NY" required />
              <Input label="Zip" placeholder="10001" required />
              <Input label="Phone" placeholder="(555) 123-4567" required />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Card number" placeholder="4242 4242 4242 4242" required />
              <Input label="Expiry" placeholder="12/27" required />
            </div>
            <Button type="submit" fullWidth size="lg" disabled={cart.length === 0} ariaLabel="Place order">
              Place order
            </Button>
          </form>
        </section>

        <section className="bg-white border border-border rounded-2xl p-6 shadow-card h-fit">
          <h2 className="text-xl font-bold text-text-primary mb-4">Order summary</h2>
          <div className="space-y-3 mb-4">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm text-text-secondary">
                <span>{item.name} × {item.quantity}</span>
                <span className="font-semibold text-text-primary">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-sm text-text-secondary">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{formatPrice(shipping)}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>{formatPrice(tax)}</span></div>
          </div>
          <div className="border-t border-border mt-4 pt-3 flex justify-between text-lg font-bold text-text-primary">
            <span>Total</span>
            <span className="text-primary-600">{formatPrice(total)}</span>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Checkout
