import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Zap, Shield, Users, Target, Sparkles } from 'lucide-react'
import Button from '../components/common/Button'

const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'Customer First',
      description: 'We prioritize your satisfaction above everything else. Every decision we make is centered around making your shopping experience seamless and enjoyable.',
      color: '#ff6b6b',
    },
    {
      icon: Zap,
      title: 'Speed & Efficiency',
      description: 'Fast shipping, instant notifications, and real-time tracking. We believe your time is valuable and we respect that.',
      color: '#ffd93d',
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'Your data and transactions are protected with industry-leading security. Buyer protection and secure checkout are guaranteed.',
      color: '#6bcf7f',
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'We build for everyone. From tech enthusiasts to home improvement lovers, TradeHub serves diverse communities.',
      color: '#4ecdc4',
    },
  ]

  const features = [
    {
      number: '10K+',
      label: 'Curated Products',
      description: 'Handpicked items from trusted sellers',
    },
    {
      number: '2-Day',
      label: 'Fast Shipping',
      description: 'Available on most orders across the US',
    },
    {
      number: '24/7',
      label: 'Customer Support',
      description: 'Real people ready to help anytime',
    },
    {
      number: '100%',
      label: 'Buyer Protection',
      description: 'Secure payments and easy refunds',
    },
  ]

  const timeline = [
    {
      year: '2023',
      title: 'TradeHub Founded',
      description: 'Started with a vision to simplify online shopping for tech-savvy consumers.',
    },
    {
      year: '2024',
      title: 'Expanded Categories',
      description: 'Added audio, gaming, fitness, and smart home categories to our marketplace.',
    },
    {
      year: '2025',
      title: 'Seller Comparison Feature',
      description: 'Launched revolutionary seller comparison tool helping users get the best deals.',
    },
  ]

  return (
    <main className="bg-bg-secondary">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute w-96 h-96 rounded-full bg-primary-500/20 blur-3xl top-0 left-0" />
          <div className="absolute w-96 h-96 rounded-full bg-amber-400/20 blur-3xl bottom-0 right-0" />
        </div>

        <div className="container px-4 relative z-10 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="font-semibold text-sm">About TradeHub</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-text-primary max-w-3xl mx-auto leading-tight">
              The Marketplace for Thoughtful Shopping
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto mt-4">
              We're building a better way to buy tech, home gear, and everything in between. No chaos, just carefully curated picks from sellers you can trust.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-4xl font-bold text-text-primary mb-4">Our Mission</h2>
              <p className="text-lg text-text-secondary leading-relaxed mb-4">
                At TradeHub, we believe online shopping shouldn't be overwhelming. Every day, millions of people scroll through endless options, compare countless listings, and struggle to find trustworthy sellers.
              </p>
              <p className="text-lg text-text-secondary leading-relaxed">
                We're here to change that. We've created a marketplace where every product is curated, every seller is vetted, and every transaction is protected. Shopping should be joyful, not stressful.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-card border border-border text-center">
                <p className="text-3xl font-bold text-primary-600 mb-2">{feature.number}</p>
                <p className="font-semibold text-text-primary mb-1">{feature.label}</p>
                <p className="text-sm text-text-secondary">{feature.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-12"
        >
          <h2 className="text-4xl font-bold text-text-primary">Our Core Values</h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            These principles guide everything we do, from product curation to customer support.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-card border border-border hover:shadow-lg transition-shadow"
            >
              <div
                className="w-14 h-14 rounded-xl mb-4 flex items-center justify-center"
                style={{ background: `${value.color}20` }}
              >
                <value.icon className="w-7 h-7" style={{ color: value.color }} />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">{value.title}</h3>
              <p className="text-text-secondary leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="container px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-12"
        >
          <h2 className="text-4xl font-bold text-text-primary">Our Journey</h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            From idea to innovation, we're constantly evolving to serve you better.
          </p>
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 to-amber-400" style={{ transform: 'translateX(-50%)' }} />

          <div className="space-y-12">
            {timeline.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className={`flex gap-8 ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className="flex-1 bg-white rounded-2xl p-6 shadow-card border border-border">
                  <p className="text-sm font-bold text-primary-600 mb-2">{item.year}</p>
                  <h3 className="text-xl font-bold text-text-primary mb-2">{item.title}</h3>
                  <p className="text-text-secondary">{item.description}</p>
                </div>
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-600 text-white font-bold shadow-lg z-10 flex-shrink-0">
                  {idx + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-12"
        >
          <h2 className="text-4xl font-bold text-text-primary">Why Choose TradeHub?</h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            We're not just another marketplace. We're a community dedicated to quality and trust.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: 'Curated Selection',
              description: 'Every product is carefully selected to ensure quality and value. We don\'t sell everything—we sell the right things.',
            },
            {
              title: 'Transparent Pricing',
              description: 'See all seller prices upfront. Our comparison feature shows you exactly who offers the best deal on any item.',
            },
            {
              title: 'Hassle-Free Returns',
              description: 'Changed your mind? Buyer protection means easy returns and refunds. Your satisfaction is guaranteed.',
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-card border border-border text-center hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-bold text-text-primary mb-3">{item.title}</h3>
              <p className="text-text-secondary">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary-600 to-primary-500 rounded-3xl p-12 text-center space-y-6 text-white"
        >
          <h2 className="text-4xl font-bold">Ready to Experience the Difference?</h2>
          <p className="text-lg text-primary-50 max-w-2xl mx-auto">
            Join thousands of happy shoppers who've discovered smarter, more thoughtful online shopping with TradeHub.
          </p>
          <Link to="/products">
            <Button className="bg-white text-primary-600 hover:bg-primary-50">
              Start Shopping Now
            </Button>
          </Link>
        </motion.div>
      </section>
    </main>
  )
}

export default About
