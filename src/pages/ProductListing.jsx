import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { debounce, searchAndRecommendProducts, getRelatedProducts } from '../utils/helpers'
import { products, categories } from '../utils/mockData'
import ProductGrid from '../components/products/ProductGrid'
import ProductFilters from '../components/products/ProductFilters'
import Skeleton from '../components/common/Skeleton'

const ProductListing = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'All',
    sort: 'featured',
    priceMin: 0,
    priceMax: 10000,
    minRating: 0,
  })
  const [visibleCount, setVisibleCount] = useState(8)
  const [loading, setLoading] = useState(false)

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    if (key === 'category') {
      setSearchParams({ category: value })
    }
  }

  const clearFilters = () => {
    setFilters({ category: 'All', sort: 'featured', priceMin: 0, priceMax: 10000, minRating: 0 })
    setSearchParams({})
  }

  useEffect(() => {
    setLoading(true)
    const timeout = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(timeout)
  }, [filters])

  const filteredProducts = useMemo(() => {
    let items = [...products]
    if (filters.category && filters.category !== 'All') {
      items = items.filter((p) => p.category === filters.category)
    }
    items = items.filter((p) => p.price >= filters.priceMin && p.price <= filters.priceMax)
    items = items.filter((p) => p.rating >= (filters.minRating || 0))

    if (filters.sort === 'price-low') items.sort((a, b) => a.price - b.price)
    if (filters.sort === 'price-high') items.sort((a, b) => b.price - a.price)
    if (filters.sort === 'rating') items.sort((a, b) => b.rating - a.rating)
    return items
  }, [filters])

  const visibleProducts = filteredProducts.slice(0, visibleCount)

  const loadMore = () => {
    setVisibleCount((c) => c + 8)
  }

  const onSearch = debounce((value) => {
    setFilters((prev) => ({ ...prev, search: value }))
  }, 250)

  const searchedProducts = useMemo(() => {
    if (!filters.search) return visibleProducts
    return searchAndRecommendProducts(visibleProducts, filters.search)
  }, [filters.search, visibleProducts])

  // Get related products when searching
  const relatedProducts = useMemo(() => {
    if (!filters.search || searchedProducts.length === 0) return []
    
    // Get the first result's category as reference
    const firstResult = searchedProducts[0]
    if (!firstResult?.category) return []
    
    // Get related products from same category, exclude already shown results
    const shownIds = searchedProducts.slice(0, 8).map(p => p.id)
    return getRelatedProducts(visibleProducts, firstResult.category, shownIds, 4)
  }, [filters.search, searchedProducts, visibleProducts])

  return (
    <main className="bg-bg-secondary min-h-screen py-6">
      <div className="container px-4 grid lg:grid-cols-[260px_1fr] gap-4">
        <ProductFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
        />

        <section className="space-y-3" aria-label="Product listing">
          <div>
            <h1 className="text-xl font-bold text-text-primary">Products</h1>
            <p className="text-xs text-text-secondary">{filteredProducts.length} items curated</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, idx) => (
                <Skeleton key={idx} className="h-[280px]" />
              ))}
            </div>
          ) : searchedProducts.length > 0 ? (
            <>
              <div>
                <p className="text-xs text-text-secondary mb-3">
                  Found {searchedProducts.length} result{searchedProducts.length !== 1 ? 's' : ''} for "{filters.search}"
                </p>
                <ProductGrid products={searchedProducts} />
              </div>

              {relatedProducts.length > 0 && (
                <div className="mt-8 pt-6 border-t border-border">
                  <h2 className="text-lg font-bold text-text-primary mb-3">You might also like</h2>
                  <p className="text-xs text-text-secondary mb-4">Related products in {searchedProducts[0]?.category}</p>
                  <ProductGrid products={relatedProducts} />
                </div>
              )}
            </>
          ) : (
            <div className="bg-white border border-border rounded-xl p-5 text-center shadow-sm">
              <p className="text-base font-semibold text-text-primary">No products match these filters</p>
              <p className="text-xs text-text-secondary mt-1">Try adjusting categories, price, or search term.</p>
            </div>
          )}

          {visibleCount < filteredProducts.length && (
            <button
              onClick={loadMore}
              className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-primary-500 text-white font-semibold shadow-soft"
            >
              Load more
            </button>
          )}
        </section>
      </div>
    </main>
  )
}

export default ProductListing
