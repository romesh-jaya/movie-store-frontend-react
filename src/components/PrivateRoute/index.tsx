import { useAuth0 } from '@auth0/auth0-react';
import { useRef } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import ContainerBody from '../../containers/ContainerBody/ContainerBody';

const PrivateRoute = () => {
  const { user, isAuthenticated, error } = useAuth0();
  const isAuthRef = useRef(false);

  if (isAuthenticated && !isAuthRef.current) {
    isAuthRef.current = true;
    console.info('Sign in success', user?.email);
  }

  return isAuthenticated || error ? (
    <ContainerBody>
      <Outlet />
    </ContainerBody>
  ) : (
    <Navigate to={{ pathname: '/login' }} />
  );
};

export default PrivateRoute;
