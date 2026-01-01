import { Link } from 'react-router-dom'
import useStore from '../store/useStore'
import ProductCard from '../components/products/ProductCard'
import Button from '../components/common/Button'

const Wishlist = () => {
  const { wishlist, requireAuth } = useStore()
  const allowed = requireAuth()
  if (!allowed) return null

  return (
    <main className="bg-bg-secondary min-h-screen py-10">
      <div className="container px-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-secondary">Saved</p>
            <h1 className="text-2xl font-bold text-text-primary">Wishlist</h1>
          </div>
          <Link to="/products" className="text-primary-600 font-semibold text-sm">Continue shopping</Link>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white border border-border rounded-2xl p-8 text-center shadow-card">
            <p className="text-lg font-semibold text-text-primary">Nothing saved yet</p>
            <p className="text-sm text-text-secondary mb-4">Add items to keep track of them here.</p>
            <Button onClick={() => window.history.back()}>Back</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default Wishlist
