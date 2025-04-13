import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from './components/ui/toaster.jsx'
import { AuthProvider } from './lib/auth-context.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Toaster />
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
