import { Filter, X } from 'lucide-react'
import { categories } from '../../utils/mockData'
import Button from '../common/Button'

const ProductFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const priceRanges = [
    { label: 'Under ₹500', min: 0, max: 500 },
    { label: '₹500 - ₹1,000', min: 500, max: 1000 },
    { label: '₹1,000 - ₹2,500', min: 1000, max: 2500 },
    { label: 'Over ₹2,500', min: 2500, max: 10000 },
  ]
  
  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
  ]
  
  return (
    <aside className="bg-white rounded-lg p-4 shadow-sm" aria-label="Product filters">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
          <Filter className="w-5 h-5" aria-hidden="true" />
          Filters
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          ariaLabel="Clear all filters"
        >
          <X className="w-4 h-4 mr-1" aria-hidden="true" />
          Clear
        </Button>
      </div>
      
      {/* Sort */}
      <div className="mb-4">
        <h3 className="font-semibold text-text-primary mb-2">Sort By</h3>
        <select
          value={filters.sort}
          onChange={(e) => onFilterChange('sort', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Sort products"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      {/* Categories */}
      <div className="mb-6">
        <h3 className="font-semibold text-text-primary mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-1.5 cursor-pointer hover:bg-gray-50 p-1.5 rounded transition-colors"
            >
              <input
                type="radio"
                name="category"
                value={category.name}
                checked={filters.category === category.name}
                onChange={(e) => onFilterChange('category', e.target.value)}
                className="w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-text-primary">
                {category.icon} {category.name}
              </span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Price Range */}
      <div className="mb-6">
        <h3 className="font-semibold text-text-primary mb-3">Price Range</h3>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <label
              key={range.label}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
            >
              <input
                type="radio"
                name="priceRange"
                value={`${range.min}-${range.max}`}
                checked={filters.priceMin === range.min && filters.priceMax === range.max}
                onChange={() => {
                  onFilterChange('priceMin', range.min)
                  onFilterChange('priceMax', range.max)
                }}
                className="w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-text-primary">{range.label}</span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Rating */}
      <div>
        <h3 className="font-semibold text-text-primary mb-3">Minimum Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2].map((rating) => (
            <label
              key={rating}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
            >
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={filters.minRating === rating}
                onChange={() => onFilterChange('minRating', rating)}
                className="w-4 h-4 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-text-primary">
                {rating}★ & above
              </span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  )
}

export default ProductFilters