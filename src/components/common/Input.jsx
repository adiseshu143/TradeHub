const Input = ({ label, type = 'text', placeholder, value, onChange, error, required = false, ...props }) => {
  const id = props.id || `input-${label?.replace(/\s+/g, '-').toLowerCase()}`
  return (
    <label className="block space-y-2">
      {label && (
        <span className="text-sm font-medium text-text-primary">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </span>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-3 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-text-primary placeholder:text-text-secondary/70 ${
          error ? 'border-red-400' : 'border-border'
        }`}
        {...props}
      />
      {error && <p className="text-xs text-red-500" role="alert">{error}</p>}
    </label>
  )}

export default Input
