import { useParams, Link } from 'react-router-dom'
import { CheckCircle2, Truck, Clock4 } from 'lucide-react'
import { mockOrders } from '../utils/mockData'
import { formatDate, orderStatusColor } from '../utils/helpers'
import Button from '../components/common/Button'

const statusIcons = {
  delivered: CheckCircle2,
  shipped: Truck,
  processing: Clock4,
}

const OrderTracking = () => {
  const { orderId } = useParams()
  const order = mockOrders.find((o) => o.id === orderId)

  if (!order) {
    return (
      <main className="min-h-screen grid place-items-center bg-bg-secondary">
        <div className="text-center space-y-3">
          <p className="text-lg font-semibold text-text-primary">Order not found</p>
          <Link to="/products">
            <Button>Go shopping</Button>
          </Link>
        </div>
      </main>
    )
  }

  const Icon = statusIcons[order.status] || Truck

  return (
    <main className="bg-bg-secondary min-h-screen py-10">
      <div className="container px-4 space-y-6">
        <div className="bg-white border border-border rounded-2xl p-6 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <p className="text-sm text-text-secondary">Order</p>
              <h1 className="text-2xl font-bold text-text-primary">{order.id}</h1>
              <p className="text-sm text-text-secondary">Placed {formatDate(order.placedAt)}</p>
            </div>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${orderStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>

          <div className="flex items-center gap-3 text-primary-600">
            <Icon className="w-6 h-6" aria-hidden="true" />
            <p className="text-sm font-semibold text-text-primary">ETA {formatDate(order.eta)}</p>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 border border-border rounded-lg p-3">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover" loading="lazy" />
                <div>
                  <p className="font-semibold text-text-primary">{item.name}</p>
                  <p className="text-sm text-text-secondary">{item.seller}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-border rounded-2xl p-6 shadow-card">
          <h2 className="text-lg font-bold text-text-primary mb-4">Timeline</h2>
          <ol className="relative border-s border-border">
            {[
              { label: 'Order placed', date: order.placedAt },
              { label: order.status === 'delivered' ? 'Delivered' : 'Shipped', date: order.eta },
            ].map((step, idx) => (
              <li key={step.label} className="mb-6 ms-4">
                <div className="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full bg-primary-500" aria-hidden="true" />
                <p className="font-semibold text-text-primary">{step.label}</p>
                <p className="text-sm text-text-secondary">{formatDate(step.date)}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </main>
  )
}

export default OrderTracking
