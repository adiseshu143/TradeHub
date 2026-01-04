import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Shield, Truck, Headphones, Sparkles, Flame, Check } from 'lucide-react'
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

  const [openFeature, setOpenFeature] = useState('all')

  useEffect(() => {
    const handleScroll = () => {
      if (openFeature === 'all') {
        setOpenFeature(null)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [openFeature])

  const features = [
    {
      icon: Shield,
      title: 'Protected checkout',
      description: '3D Secure, buyer protection, easy refunds.',
      details: [
        'Bank-level security with 3D Secure on eligible cards',
        'Purchase protection on every order',
        'Hassle-free refunds and status updates',
      ],
    },
    {
      icon: Truck,
      title: 'Express delivery',
      description: 'US-wide 2-day shipping on most picks.',
      details: [
        'Fast dispatch from regional hubs',
        'Real-time tracking from checkout to doorstep',
        'Coverage across the continental US',
      ],
    },
    {
      icon: Headphones,
      title: 'Human support',
      description: 'Real people, 24/7 chat and phone.',
      details: [
        'Round-the-clock chat, phone, and email help',
        'Real agents—no scripts when you need answers',
        'Proactive updates on orders and returns',
      ],
    },
  ]

  const handleFeatureToggle = (index) => {
    setOpenFeature((current) => (current === index ? null : index))
  }

  const handleKeyToggle = (event, index) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleFeatureToggle(index)
    }
  }

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
          {features.map((feature, index) => {
            const isOpen = openFeature === index
            return (
              <div
                key={feature.title}
                className="bg-white rounded-xl shadow-card border border-border focus-within:shadow-lg transition-all duration-200 overflow-hidden"
              >
                <div
                  role="button"
                  tabIndex={0}
                  aria-expanded={isOpen}
                  aria-controls={`feature-panel-${index}`}
                  onClick={() => handleFeatureToggle(index)}
                  onKeyDown={(e) => handleKeyToggle(e, index)}
                  className={`p-6 flex flex-col gap-3 outline-none transition-all duration-200 ${isOpen ? 'shadow-md' : ''} hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white cursor-pointer`}
                >
                  <div className="w-12 h-12 rounded-lg bg-primary-50 text-primary-700 grid place-items-center">
                    <feature.icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary">{feature.title}</h3>
                      <p className="text-sm text-text-secondary leading-relaxed">{feature.description}</p>
                    </div>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      className="text-text-secondary"
                      aria-hidden="true"
                    >
                      +
                    </motion.span>
                  </div>
                </div>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`feature-panel-${index}`}
                      initial={{ opacity: 0, height: 0, y: -6 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="px-6 pb-5 bg-white"
                    >
                      <div className="border-t border-border pt-4 space-y-3">
                        {feature.details.map((item) => (
                          <div key={item} className="flex items-start gap-2 text-sm text-text-secondary">
                            <Check className="w-4 h-4 text-primary-600 mt-0.5" aria-hidden="true" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
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
