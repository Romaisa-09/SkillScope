// INDEX.JS - Entry point of React application
// This file renders the App component into the DOM

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Get the root element from public/index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the App component
// StrictMode helps identify potential problems in the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);