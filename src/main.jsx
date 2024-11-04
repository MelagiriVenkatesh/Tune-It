import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react';
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Auth0Provider

    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Auth0Provider>
  
  </StrictMode>,
)
