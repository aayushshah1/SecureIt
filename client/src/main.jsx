import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './components/ui/theme-provider.jsx'
import { Toaster } from '@/components/ui/sonner.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="secureit-theme">
        <App />
        <Toaster richColors position="top-right" />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
