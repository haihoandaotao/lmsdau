import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
const app = <App />;

if (process.env.NODE_ENV === 'development') {
  root.render(
    <React.StrictMode>
      {app}
    </React.StrictMode>
  );
} else {
  root.render(app);
}
