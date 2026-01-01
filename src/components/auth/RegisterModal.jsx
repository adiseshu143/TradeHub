import { useState } from 'react'
import Modal from '../common/Modal'
import Input from '../common/Input'
import Button from '../common/Button'
import useStore from '../../store/useStore'
import useAuth from '../../hooks/useAuth'
import { isValidEmail } from '../../utils/helpers'

const RegisterModal = () => {
  const { showRegisterModal, toggleRegisterModal, toggleLoginModal } = useStore()
  const { signup: firebaseSignup, loading, error: authError } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}
    
    if (!formData.name) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    // Firebase signup instead of mock
    const result = await firebaseSignup(formData.email, formData.password, formData.name)

    if (result.success) {
      // Clear form and close modal
      setFormData({ name: '', email: '', password: '', confirmPassword: '' })
      setErrors({})
      toggleRegisterModal()
    } else {
      setErrors({ general: result.error || authError })
    }
  }
  
  const switchToLogin = () => {
    toggleRegisterModal()
    toggleLoginModal()
  }
  
  return (
    <Modal
      isOpen={showRegisterModal}
      onClose={toggleRegisterModal}
      title="Create Your Account"
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          label="Full Name"
          placeholder="John Doe"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          required
        />
        
        <Input
          type="email"
          label="Email Address"
          placeholder="john@example.com"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
          required
        />
        
        <Input
          type="password"
          label="Password"
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          error={errors.password}
          required
        />
        
        <Input
          type="password"
          label="Confirm Password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
          error={errors.confirmPassword}
          required
        />
        
        {(errors.general || authError) && (
          <p className="text-red-500 text-sm p-2 bg-red-50 rounded">
            {errors.general || authError}
          </p>
        )}
        
        <Button type="submit" fullWidth size="lg" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </Button>
        
        <p className="text-center text-sm text-text-secondary">
          Already have an account?{' '}
          <button
            type="button"
            onClick={switchToLogin}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Sign in
          </button>
        </p>
      </form>
    </Modal>
  )
}

export default RegisterModal