import ProductCard from './ProductCard'
import Skeleton from '../common/Skeleton'

const ProductGrid = ({ products = [], loading = false }) => {
  const skeletons = Array.from({ length: 8 })
  return (
    <section 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      aria-label="Product grid"
    >
      {loading
        ? skeletons.map((_, idx) => <Skeleton key={idx} className="h-[280px] w-full" />)
        : products.map((product) => <ProductCard key={product.id} product={product} />)}
    </section>
  )
}

export default ProductGrid