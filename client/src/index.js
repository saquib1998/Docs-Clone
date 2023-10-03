import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Auth0Provider
    domain= process.env.DOMAIN,
    clientId=process.env.CLIENT_ID
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Auth0Provider>
);

