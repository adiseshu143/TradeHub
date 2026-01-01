import { formatPrice } from '../../utils/helpers'
import Button from '../common/Button'

const CartSummary = ({ subtotal, shipping, tax, total, onCheckout }) => {
  return (
    <aside className="bg-white rounded-lg p-6 shadow-sm sticky top-20" aria-labelledby="cart-summary-title">
      <h2 id="cart-summary-title" className="text-xl font-bold text-text-primary mb-4">
        Order Summary
      </h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-text-secondary">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-text-secondary">
          <span>Shipping</span>
          <span>{formatPrice(shipping)}</span>
        </div>
        <div className="flex justify-between text-text-secondary">
          <span>Tax</span>
          <span>{formatPrice(tax)}</span>
        </div>
        <div className="border-t pt-3 flex justify-between text-lg font-bold text-text-primary">
          <span>Total</span>
          <span className="text-primary-600">{formatPrice(total)}</span>
        </div>
      </div>
      
      <Button
        onClick={onCheckout}
        fullWidth
        size="lg"
        ariaLabel="Proceed to checkout"
      >
        Proceed to Checkout
      </Button>
      
      <p className="text-xs text-text-secondary text-center mt-4">
        Taxes and shipping calculated at checkout
      </p>
    </aside>
  )
}

export default CartSummary