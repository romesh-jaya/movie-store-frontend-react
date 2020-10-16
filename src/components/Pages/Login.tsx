import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Button from '@material-ui/core/Button';

import Spinner from '../UI/Spinner/Spinner';
import * as styles from './Login.css';

let timerHandle : NodeJS.Timeout;

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { loginWithRedirect } = useAuth0();

  const onLogin = async (): Promise<void> => {
    loginWithRedirect();
  };

  if (isLoading) {
    return (
      <div className={styles['spinner-full-page']}>
        <Spinner />
      </div>  
    );
  }

  return (
    <div className={styles['login-div']}>
      <Button onClick={onLogin} color="secondary" variant="contained">
        Sign in with Auth0
      </Button>
    </div>
  );
};

export default Login;
