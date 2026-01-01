import { motion } from 'framer-motion'
import { Star, Truck } from 'lucide-react'
import { formatPrice } from '../../utils/helpers'
import Button from '../common/Button'

const SellerComparison = ({ sellers, onSelectSeller }) => {
  return (
    <section className="bg-white rounded-lg p-6 shadow-sm" aria-labelledby="seller-comparison-title">
      <h2 id="seller-comparison-title" className="text-xl font-bold text-text-primary mb-4">
        Compare Sellers
      </h2>
      
      <div className="space-y-4">
        {sellers.map((seller, index) => (
          <motion.div
            key={seller.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border border-gray-200 rounded-lg p-4 hover:border-primary-500 transition-colors"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-text-primary mb-2">{seller.name}</h3>
                
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-warning-500 text-warning-500" aria-hidden="true" />
                    <span className="font-medium">{seller.rating}</span>
                    <span className="text-text-secondary">seller rating</span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-text-secondary">
                    <Truck className="w-4 h-4" aria-hidden="true" />
                    <span>{seller.deliveryTime}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-600">
                    {formatPrice(seller.price)}
                  </p>
                  <p className="text-xs text-text-secondary">+ shipping</p>
                </div>
                
                <Button
                  onClick={() => onSelectSeller(seller)}
                  size="sm"
                  ariaLabel={`Buy from ${seller.name} for ${formatPrice(seller.price)}`}
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default SellerComparison