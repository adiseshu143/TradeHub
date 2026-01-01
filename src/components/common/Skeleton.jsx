const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} aria-hidden="true" />
)

export default Skeleton
