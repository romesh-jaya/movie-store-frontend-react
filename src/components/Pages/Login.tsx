import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Button from '@material-ui/core/Button';
import { useLocation } from 'react-router';

import * as globStyles from '../../index.module.css';
import * as styles from './login.module.css';

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
  const { loginWithRedirect } = useAuth0();
  const location = useLocation();
  const isAdminLogin = location.pathname.includes('login-admin');

  const onLogin = async (): Promise<void> => {
    if (isAdminLogin) {
      loginWithRedirect({ passwordLoginOnly: true});
      return;
    }
    loginWithRedirect();
  };

  return (
    <>
      <div className={globStyles['margin-t-20']}>
        {!isAdminLogin? 'Welcome! Sign in to browse movies and TV series' : null}
      </div>
      <div className={styles['login-div']}>
        <Button onClick={onLogin} color="secondary" variant="contained">
          {isAdminLogin? 'Sign in - Admin' : 'Sign in'}
        </Button>
      </div>
    </>
  );
};

export default Login;
