// /src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// Añade el script de Google Sign-In
const script = document.createElement('script');
script.src = "https://accounts.google.com/gsi/client";
script.async = true;
script.defer = true;
document.body.appendChild(script);
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
