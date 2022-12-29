import ReactDOM from 'react-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';
import './styles/bootstrap.scss';
import 'react-loading-skeleton/dist/skeleton.css';
import ErrorBoundary from './hoc/ErrorBoundary/ErrorBoundary';

const DOMAIN = import.meta.env.VITE_AUTH0_DOMAIN || '';
const CLIENT_ID = import.meta.env.VITE_AUTH0_CLIENT_ID || '';
const AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE;

// Note: used Refresh Token Rotation and cacheLocation to “localstorage” when initializing the Auth0 client.
// as per https://community.auth0.com/t/why-is-authentication-lost-after-refreshing-my-single-page-application/56276
ReactDOM.render(
  <ErrorBoundary>
    <Auth0Provider
      domain={DOMAIN}
      clientId={CLIENT_ID}
      audience={AUDIENCE}
      redirectUri={window.location.origin}
      useRefreshTokens
      cacheLocation="localstorage"
    >
      <Router>
        <App />
      </Router>
    </Auth0Provider>
  </ErrorBoundary>,
  document.getElementById('root')
);
