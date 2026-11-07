import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Support typing /admin directly without the # (e.g. klaverdrive.nl/admin or localhost:5173/admin)
if (
  window.location.pathname.startsWith('/admin') &&
  !window.location.hash.startsWith('#/admin')
) {
  window.history.replaceState(
    null,
    '',
    '#' + window.location.pathname + window.location.search
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
