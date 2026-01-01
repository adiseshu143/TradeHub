import { useState } from 'react'
import Modal from '../common/Modal'
import Input from '../common/Input'
import Button from '../common/Button'
import useStore from '../../store/useStore'
import useAuth from '../../hooks/useAuth'
import { isValidEmail } from '../../utils/helpers'

const LoginModal = () => {
  const { showLoginModal, toggleLoginModal, toggleRegisterModal } = useStore()
  const { login: firebaseLogin, loading, error: authError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}
    
    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    // Firebase login
    const result = await firebaseLogin(email, password)
    
    if (result.success) {
      setEmail('')
      setPassword('')
      setErrors({})
      toggleLoginModal() // Close modal
    } else {
      setErrors({ general: result.error || authError })
    }
  }
  
  const switchToRegister = () => {
    toggleLoginModal()
    toggleRegisterModal()
  }
  
  return (
    <Modal
      isOpen={showLoginModal}
      onClose={toggleLoginModal}
      title="Sign In to Your Account"
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="email"
          label="Email Address"
          placeholder="john@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          required
        />
        
        <Input
          type="password"
          label="Password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          required
        />
        
        {(errors.general || authError) && (
          <p className="text-red-500 text-sm p-2 bg-red-50 rounded">
            {errors.general || authError}
          </p>
        )}
        
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" className="w-3.5 h-3.5 text-primary-600 focus:ring-primary-500 rounded" />
            <span className="text-text-secondary">Remember me</span>
          </label>
          <button type="button" className="text-primary-600 hover:text-primary-700 font-medium">
            Forgot password?
          </button>
        </div>
        
        <Button type="submit" fullWidth size="md" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
        
        <p className="text-center text-xs text-text-secondary">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={switchToRegister}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Sign up
          </button>
        </p>
      </form>
    </Modal>
  )
}

export default LoginModal