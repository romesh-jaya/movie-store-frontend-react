import { useAuth0 } from '@auth0/auth0-react';
import React, { useRef } from 'react';
import { Redirect } from 'react-router';

import styles from './protectedRoute.module.css';
import globStyles from '../../index.module.css';
import Spinner from '../UI/Spinner/Spinner';

interface IProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<IProps> = (props) => {
  const { isLoading, isAuthenticated, error, user } = useAuth0();
  const { children } = props;
  const isAuthRef = useRef<boolean>(false);

  if (isLoading) {
    return (
      <div className={styles['spinner-full-page']}>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <p className={globStyles['error-text']}>{error}</p>;
  }

  if (isAuthenticated && !isAuthRef.current) {
    isAuthRef.current = true;
    console.log('Sign in success', user && user?.email);
  }

  return isAuthenticated ? children : <Redirect to="/login" />;
};

export default ProtectedRoute;
