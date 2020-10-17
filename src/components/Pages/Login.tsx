import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Button from '@material-ui/core/Button';

import * as styles from './Login.css';

const Login: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  const onLogin = async (): Promise<void> => {
    loginWithRedirect( );
  };

  return (
    <div className={styles['login-div']}>
      <Button onClick={onLogin} color="secondary" variant="contained">
        Sign in
      </Button>
    </div>
  );
};

export default Login;
