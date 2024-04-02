import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from './context/auth-context';
import { CartContextProvider } from './context/cart-context';
import { StatusContextProvider } from './context/status-context';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StatusContextProvider>
    <CartContextProvider>
      <AuthContextProvider>
        <BrowserRouter>
          <React.StrictMode>

            <App />

          </React.StrictMode>
        </BrowserRouter>
      </AuthContextProvider>
    </CartContextProvider>
  </StatusContextProvider>
);