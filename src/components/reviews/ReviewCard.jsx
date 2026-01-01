import { Star } from 'lucide-react'
import { formatDate } from '../../utils/helpers'

const ReviewCard = ({ review }) => {
  return (
    <article className="bg-white border border-border rounded-xl p-4 shadow-sm" aria-label={`Review by ${review.user}`}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="font-semibold text-text-primary">{review.user}</p>
          <p className="text-xs text-text-secondary">{formatDate(review.date)}</p>
        </div>
        <div className="flex items-center gap-1 text-warning-500" aria-label={`Rating ${review.rating} of 5`}>
          <Star className="w-4 h-4 fill-warning-500" aria-hidden="true" />
          <span className="text-sm font-semibold text-text-primary">{review.rating}</span>
        </div>
      </div>
      <h4 className="text-sm font-semibold text-text-primary mb-1">{review.title}</h4>
      <p className="text-sm text-text-secondary leading-relaxed">{review.comment}</p>
    </article>
  )
}

export default ReviewCard
