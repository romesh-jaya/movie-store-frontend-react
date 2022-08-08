import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate, useLocation } from 'react-router';
import Button from 'react-bootstrap/esm/Button';

import globStyles from '../../index.module.scss';
import styles from './login.module.css';
import { storeName } from '../../constants/Constants';

// Note: the Auth0 hosted Universal classic login screen has been customized in order to pass a custom
//       param - passwordLoginOnly. The customized login screen can be accessed via:
//       Auth0 dashboard -> Universal login -> Login tab -> HTML view.
//       This behaviour is to enforce that guest users need to login via their Google account,
//       whereas admin should login via username/pwd.

// Here is the customized code in the Universal login javascript:
/* 
const connConfig = config.extraParams.passwordLoginOnly? 
  'Username-Password-Authentication' : 'google-oauth2';
const connection = connConfig;
*/

const Login: React.FC = () => {
  const { loginWithRedirect, isAuthenticated, error } = useAuth0();
  const location = useLocation();
  const isAdminLogin = location.pathname.includes('login-admin');

  const onLogin = async (): Promise<void> => {
    if (isAdminLogin) {
      loginWithRedirect({ passwordLoginOnly: true, display: 'page' });
      return;
    }
    loginWithRedirect();
  };

  if (error) {
    return <p className={globStyles['error-text']}>{error}</p>;
  }

  return !isAuthenticated ? (
    <div className={styles.content}>
      <div>
        <div className="my-4">
          {!isAdminLogin && (
            <p>
              {`Welcome! Sign in to browse movies and TV series at ${storeName}`}
            </p>
          )}
        </div>
        <div className={styles['login-div']}>
          <Button id="login-button" onClick={onLogin} variant="secondary">
            {isAdminLogin ? 'Sign in - Admin' : 'Sign in'}
          </Button>
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/" />
  );
};

export default Login;
