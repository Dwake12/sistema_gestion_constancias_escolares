import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster} from 'sonner'

import App from './App.jsx'
import AuthProvider from './context/AuthContext'

import './styles/variables.css'
import './styles/global.css'
import './styles/ui.css'
import './styles/layout.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster 
          richColors
          closeButton
          position='bottom-right'
          duration={3500}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
