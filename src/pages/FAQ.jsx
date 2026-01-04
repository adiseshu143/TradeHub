import { useState } from 'react'
import { ChevronDown, Send } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import toast from 'react-hot-toast'

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    question: '',
  })
  const [sending, setSending] = useState(false)

  const faqs = [
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, debit cards, UPI, net banking, and cash on delivery for eligible orders.',
    },
    {
      question: 'How long does shipping take?',
      answer: 'Standard delivery takes 3-5 business days. Express delivery (available on select products) takes 1-2 business days.',
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy on most items. Products must be unused and in original packaging. Return shipping is free for damaged or defective items.',
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Currently, we only ship within India. International shipping will be available soon.',
    },
    {
      question: 'How can I track my order?',
      answer: 'Once your order ships, you will receive a tracking number via email and SMS. You can also track orders from your account dashboard.',
    },
    {
      question: 'Are there any hidden charges?',
      answer: 'No hidden charges. The price shown at checkout is the final price including all taxes. Shipping charges (if any) are clearly displayed.',
    },
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.question) {
      toast.error('Please fill all fields')
      return
    }

    setSending(true)

    // Create mailto link with pre-filled content
    const supportEmail = 'hanumanthuadiseshu@gmail.com'
    const subject = `FAQ Inquiry from ${formData.name}`
    const body = `Name: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0A%0D%0AQuestion:%0D%0A${formData.question}`
    
    const mailtoLink = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${body}`
    
    // Open default email client
    window.location.href = mailtoLink
    
    // Show success message
    setTimeout(() => {
      toast.success('Opening your email client...')
      setFormData({ name: '', email: '', question: '' })
      setSending(false)
    }, 500)
  }

  return (
    <main className="bg-bg-secondary min-h-screen py-10">
      <div className="container px-4 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-primary mb-4">Frequently Asked Questions</h1>
          <p className="text-text-secondary">
            Find answers to common questions about our products and services
          </p>
        </div>

        {/* FAQ Accordion */}
        <section className="bg-white rounded-xl shadow-card border border-border mb-12 overflow-hidden">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-border last:border-b-0">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                aria-expanded={openIndex === index}
              >
                <h3 className="text-lg font-semibold text-text-primary pr-4">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-text-secondary flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      <p className="text-text-secondary leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </section>

        {/* Contact Form */}
        <section className="bg-white rounded-xl shadow-card border border-border p-6 md:p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-text-primary mb-2">
              Still have questions?
            </h2>
            <p className="text-text-secondary">
              Send us your question and we'll get back to you via email
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Your Name"
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Your Email"
                type="email"
                placeholder="your_name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Your Question
              </label>
              <textarea
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="Type your question here..."
                rows="5"
                required
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-text-primary placeholder:text-text-secondary/70 resize-none"
              />
            </div>

            <Button type="submit" fullWidth disabled={sending}>
              <Send className="w-4 h-4 mr-2" />
              {sending ? 'Sending...' : 'Send Question'}
            </Button>
          </form>
        </section>
      </div>
    </main>
  )
}

export default FAQ
