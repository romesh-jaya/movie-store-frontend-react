import React from 'react';
import ReactDOM from 'react-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';
import * as serviceWorker from './serviceWorker';
import ErrorBoundary from './hoc/ErrorBoundary/ErrorBoundary';

const DOMAIN = import.meta.env.REACT_APP_AUTH0_DOMAIN || '';
const CLIENT_ID = import.meta.env.REACT_APP_AUTH0_CLIENT_ID || '';
const AUDIENCE = import.meta.env.REACT_APP_AUTH0_AUDIENCE;

ReactDOM.render(
  <ErrorBoundary>
    <Auth0Provider
      domain={DOMAIN}
      clientId={CLIENT_ID}
      audience={AUDIENCE}
      redirectUri={window.location.origin}
    >
      <Router>
        <App />
      </Router>
    </Auth0Provider>
  </ErrorBoundary>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
