import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Shield, Truck, Headphones, Sparkles, Flame } from 'lucide-react'
import ProductGrid from '../components/products/ProductGrid'
import Button from '../components/common/Button'
import HeroCarousel from '../components/common/HeroCarousel'
import { products, categories, featuredCollections, testimonials } from '../utils/mockData'
import slide1 from '../assets/1767095496993.jpg'
import slide2 from '../assets/1767095502585.jpg'
import slide3 from '../assets/1767095509017.jpg'
import slide4 from '../assets/1767095514233.jpg'
import slide5 from '../assets/1767095521568.jpg'
import slide6 from '../assets/1767095526848.jpg'
import slide7 from '../assets/1767095587997.jpg'
import slide8 from '../assets/1767095648872.jpg'

const Home = () => {
  const featuredProducts = products.slice(0, 8)
  const heroHighlights = ['Curated tech picks', 'Seller comparisons', 'Fast, insured delivery']
  const heroSlides = [
    { src: slide1, title: 'Curated work setups', subtitle: 'Pair devices, lighting, and comfort in one place', badge: 'Featured' },
    { src: slide2, title: 'Immersive audio', subtitle: 'Headphones and speakers tuned for focus and depth' },
    { src: slide3, title: 'Smart living', subtitle: 'Lighting, climate, and security in sync' },
    { src: slide4, title: 'Game-ready gear', subtitle: 'Low-latency peripherals and vibrant displays' },
    { src: slide5, title: 'Creative spaces', subtitle: 'Monitors, docks, and tools for makers' },
    { src: slide6, title: 'Wellness tech', subtitle: 'Track, recover, and move better every day' },
    { src: slide7, title: 'Next-gen essentials', subtitle: 'Future-proof picks with fast delivery' },
    { src: slide8, title: 'Desk details', subtitle: 'Finishing touches that keep you organized' },
  ]

  const features = [
    { icon: Shield, title: 'Protected checkout', description: '3D Secure, buyer protection, easy refunds.' },
    { icon: Truck, title: 'Express delivery', description: 'US-wide 2-day shipping on most picks.' },
    { icon: Headphones, title: 'Human support', description: 'Real people, 24/7 chat and phone.' },
  ]

  return (
    <div className="bg-bg-primary">
      <section className="relative overflow-hidden">
        <div className="container px-4 pt-16 pb-20 relative">
          <div className="grid md:grid-cols-1 gap-10 items-start">
            <div className="space-y-6">
              <div className="chip w-fit">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                New winter drops
              </div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-text-primary">
                The marketplace for thoughtful tech & home gear.
              </h1>
              <p className="text-lg text-text-secondary max-w-xl">
                Compare trusted sellers, track delivery in real time, and build a setup you love—without scrolling chaos.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products">
                  <Button size="lg" className ="flex items-center gap-2 group">
                    Shop curated picks
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                  </Button>
                </Link>
                <Link to="/products?category=Laptops">
                  <Button variant="outline" size="lg">Explore laptops</Button>
                </Link>
              </div>
              <div className="pill-track">
                {heroHighlights.map((item) => (
                  <span key={item} className="pill">{item}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full-width hero carousel above categories for large screens */}
      <section className="container px-4 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-6xl mx-auto"
        >
          <HeroCarousel slides={heroSlides} />
        </motion.div>
      </section>

      <section className="container px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-primary">Shop by category</h2>
          <Link to="/products" className="text-primary-600 font-semibold flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.filter((c) => c.id !== 'all').map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.name}`}
              className="glass-panel rounded-xl px-5 py-6 text-center card-hover"
            >
              <div className="text-3xl mb-2" aria-hidden="true">{category.icon}</div>
              <p className="font-semibold text-text-primary">{category.name}</p>
              <p className="text-xs text-text-secondary mt-1"> curated picks</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-text-secondary mb-1">Trending now</p>
            <h2 className="text-2xl font-bold text-text-primary">Featured drops</h2>
          </div>
          <div className="flex items-center gap-2 text-amber-600 font-semibold">
            <Flame className="w-4 h-4" aria-hidden="true" /> Ships fast
          </div>
        </div>
        <ProductGrid products={featuredProducts} />
      </section>

      <section className="container px-4 pb-14">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="bg-white rounded-xl p-6 shadow-card border border-border card-hover">
              <div className="w-12 h-12 rounded-lg bg-primary-50 text-primary-700 grid place-items-center mb-4">
                <feature.icon className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">{feature.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container px-4 pb-20">
        <div className="bg-white rounded-2xl p-8 shadow-card border border-border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <p className="text-sm text-primary-600 font-semibold">Why buyers stay</p>
              <h2 className="text-2xl font-bold text-text-primary">Loved by modern teams</h2>
            </div>
            <Link to="/products">
              <Button variant="outline">Explore catalog</Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((item) => (
              <div key={item.id} className="rounded-xl border border-border p-6 bg-surface-muted card-hover">
                <p className="text-lg font-semibold text-text-primary mb-3">“{item.quote}”</p>
                <p className="text-sm text-text-secondary">{item.name} · {item.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
