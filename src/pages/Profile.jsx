import useStore from '../store/useStore'
import useAuth from '../hooks/useAuth'
import Button from '../components/common/Button'
import { mockOrders } from '../utils/mockData'
import { formatDate, formatPrice, orderStatusColor } from '../utils/helpers'
import { Link } from 'react-router-dom'
import { Chrome, Facebook, Cloud } from 'lucide-react'

const Profile = () => {
  const { toggleLoginModal, toggleRegisterModal } = useStore()
  const { user, isAuthenticated, loading, logout } = useAuth()

  if (loading) {
    return (
      <main className="min-h-screen grid place-items-center bg-bg-secondary px-4 py-4">
        <div className="text-center text-text-secondary">Loading your account…</div>
      </main>
    )
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen grid place-items-center bg-bg-secondary px-4 py-4">
        <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 md:p-10 shadow-card text-center space-y-6 max-w-sm sm:max-w-md w-full min-h-[450px] flex flex-col justify-center -mt-20">
          <div className="space-y-4">
            <p className="text-lg sm:text-xl md:text-2xl font-semibold text-text-primary">Login to view your profile</p>
            <p className="text-sm sm:text-base text-text-secondary">Access orders, wishlist, and faster checkout.</p>
          </div>
          
          <div className="space-y-4">
            <Button onClick={toggleLoginModal} size="md" className="w-full px-6">Sign In</Button>
            <p className="text-xs text-text-secondary">
              Don't have an account?{' '}
              <button onClick={toggleRegisterModal} className="text-primary-600 font-semibold hover:underline">
                Sign Up
              </button>
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border "></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-text-secondary">or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button className="flex items-center justify-center gap-1.5 px-3 py-2.5 border-2 border-border rounded-lg hover:bg-gray-50 hover:border-primary-500 transition-all duration-200">
              <Chrome className="w-4 h-4 " />
              <span className="font-medium text-text-primary text-sm">Google</span>
            </button>
            <button className="flex items-center justify-center gap-1.5 px-3 py-2.5 border-2 border-border rounded-lg hover:bg-gray-50 hover:border-primary-500 transition-all duration-200">
              <Facebook className="w-4 h-4" />
              <span className="font-medium text-text-primary text-sm">Facebook</span>
            </button>
            <button className="flex items-center justify-center gap-1.5 px-3 py-2.5 border-2 border-border rounded-lg hover:bg-gray-50 hover:border-primary-500 transition-all duration-200">
              <Cloud className="w-4 h-4" />
              <span className="font-medium text-text-primary text-sm">Salesforce</span>
            </button>
          </div>

          <p className="text-xs text-text-secondary pt-3">
            <span className="font-bold text-sm">Powered by TradeHub</span> &copy; {new Date().getFullYear()}
          </p>
        </div>
      </main>
    )
  }

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Your account'
  const email = user?.email || 'Signed in'

  return (
    <main className="bg-bg-secondary min-h-screen py-10">
      <div className="container px-4 space-y-6">
        <section className="bg-white border border-border rounded-2xl p-6 shadow-card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-primary-100 text-primary-700 grid place-items-center text-lg font-bold">
              {displayName?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="text-lg font-semibold text-text-primary">{displayName}</p>
              <p className="text-sm text-text-secondary">{email}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={logout}>Logout</Button>
          </div>
        </section>

        <section className="bg-white border border-border rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-primary">Orders</h2>
            <Link to="/orders/ORD-2024-118" className="text-primary-600 text-sm font-semibold">Track order</Link>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {mockOrders.map((order) => (
              <Link
                to={`/orders/${order.id}`}
                key={order.id}
                className="border border-border rounded-lg p-4 hover:border-primary-500 transition-colors block"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-text-primary">{order.id}</p>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${orderStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-text-secondary">Placed {formatDate(order.placedAt)}</p>
                <p className="text-sm font-semibold text-text-primary mt-1">Total {formatPrice(order.total)}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

export default Profile
