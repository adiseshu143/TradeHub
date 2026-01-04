import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()
  
  const footerLinks = {
    shop: [
      { label: 'All Products', to: '/products' },
      { label: 'Electronics', to: '/products?category=Electronics' },
      { label: 'Fashion', to: '/products?category=Fashion' },
      { label: 'Home & Kitchen', to: '/products?category=Home' },
    ],
    account: [
      { label: 'My Profile', to: '/profile' },
      { label: 'Order History', to: '/orders/ORD-2024-001' },
      { label: 'Wishlist', to: '/wishlist' },
      { label: 'Cart', to: '/cart' },
    ],
    help: [
      { label: 'Customer Service', to: '/faq' },
      { label: 'Track Order', to: '/orders/ORD-2024-001' },
      { label: 'Returns', to: '/faq' },
      { label: 'FAQs', to: '/faq' },
    ]
  }
  
  return (
    <footer className="bg-white border-t mt-auto" role="contentinfo">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div>
            <h3 className="text-2xl font-bold text-primary-600 mb-4">
              🛍️ Marketplace
            </h3>
            <p className="text-text-secondary mb-4">
              Your trusted destination for quality products at great prices.
            </p>
            <div className="flex flex-col gap-2">
              <a 
                href="mailto:support@marketplace.com"
                className="flex items-center gap-2 text-text-secondary hover:text-primary-600 transition-colors"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm">hanumanthuadiseshu@gmail.com</span>
              </a>
              <a 
                href="tel:+1234567890"
                className="flex items-center gap-2 text-text-secondary hover:text-primary-600 transition-colors"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm">+91 8019199799</span>
              </a>
              <div className="flex items-center gap-2 text-text-secondary">
                <MapPin className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm">Bhimavaram, Andhra Pradesh, India</span>
              </div>
            </div>
          </div>
          
          {/* Shop Links */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Shop</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.to}
                    className="text-text-secondary hover:text-primary-600 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Account Links */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">My Account</h4>
            <ul className="space-y-2">
              {footerLinks.account.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.to}
                    className="text-text-secondary hover:text-primary-600 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Help Links */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Help & Support</h4>
            <ul className="space-y-2">
              {footerLinks.help.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.to}
                    className="text-text-secondary hover:text-primary-600 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t text-center">
          <p className="text-text-secondary text-sm">
            © {currentYear} Marketplace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer