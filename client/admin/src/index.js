import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { BrowserRouter } from 'react-router-dom';

import { AuthContextProvider } from './context/auth-context';
import { StatusContextProvider } from './context/status-context';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StatusContextProvider>
    <React.StrictMode>
      <AuthContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthContextProvider>
    </React.StrictMode>
  </StatusContextProvider>
);

reportWebVitals();
