import { useState } from 'react'
import Modal from '../common/Modal'
import Input from '../common/Input'
import Button from '../common/Button'
import useStore from '../../store/useStore'

const AddReviewModal = ({ isOpen, onClose, onSubmit }) => {
  const { requireAuth, user } = useStore()
  const [title, setTitle] = useState('')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const allowed = requireAuth()
    if (!allowed) return
    onSubmit({
      id: Date.now().toString(),
      user: user?.name || 'You',
      rating: Number(rating),
      title,
      comment,
      date: new Date().toISOString(),
    })
    setTitle('')
    setComment('')
    setRating(5)
    onClose?.()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add your review" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          placeholder="Great quality and fast delivery"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <label className="block space-y-2">
          <span className="text-sm font-medium text-text-primary">Rating</span>
          <select
            className="w-full border border-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            aria-label="Rating"
          >
            {[5,4,3,2,1].map((r) => (
              <option key={r} value={r}>{r} Stars</option>
            ))}
          </select>
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-text-primary">Comment</span>
          <textarea
            className="w-full border border-border rounded-lg px-3 py-2.5 h-28 focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience"
            required
          />
        </label>
        <Button type="submit" fullWidth>
          Submit review
        </Button>
      </form>
    </Modal>
  )
}

export default AddReviewModal
