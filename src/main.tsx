import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = document.getElementById('root') as HTMLElement;
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Production ships real HTML; development still supports Vite's empty shell.
if (root.children.length) ReactDOM.hydrateRoot(root, app);
else ReactDOM.createRoot(root).render(app);
