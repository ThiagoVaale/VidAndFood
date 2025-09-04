import React, { StrictMode } from 'react'
import App from './App.jsx'
import { createRoot } from 'react-dom/client'
import CustomNavbar from './components/nav-bar/CustomNavbar.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
   <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
