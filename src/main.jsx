import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'

console.log('Main.jsx loaded')
const root = document.getElementById('root')
console.log('Root element:', root)

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster position="top-center" toastOptions={{ duration: 2400 }} />
    </BrowserRouter>
  </StrictMode>
)

console.log('React app rendered')
