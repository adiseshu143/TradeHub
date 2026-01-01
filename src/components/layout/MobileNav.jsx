import { NavLink } from 'react-router-dom'
import { Home, Grid, Heart, ShoppingCart, User } from 'lucide-react'
import useStore from '../../store/useStore'

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/products', label: 'Shop', icon: Grid },
  { to: '/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/cart', label: 'Cart', icon: ShoppingCart },
  { to: '/profile', label: 'Profile', icon: User },
]

const MobileNav = () => {
  const { getCartCount } = useStore()
  const cartCount = getCartCount()

  const linkClass = ({ isActive }) =>
    `flex flex-col items-center justify-center gap-1 text-xs font-semibold transition-colors ${
      isActive ? 'text-primary-700' : 'text-text-secondary hover:text-text-primary'
    }`

  return (
    <nav className="lg:hidden fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/95 backdrop-blur shadow-soft">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isCart = item.to === '/cart'
          return (
            <NavLink key={item.to} to={item.to} className={linkClass} aria-label={item.label}>
              <div className="relative">
                <Icon className="w-5 h-5" aria-hidden="true" />
                {isCart && cartCount > 0 && (
                  <span className="absolute -top-2 -right-3 text-[10px] px-1.5 py-0.5 rounded-full bg-primary-600 text-white font-bold leading-none shadow-sm">
                    {cartCount}
                  </span>
                )}
              </div>
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}

export default MobileNav
