import { useAuth0 } from '@auth0/auth0-react';
import { Outlet } from 'react-router-dom';
import { isAdmin } from '../../utils/AuthUtil';
import globStyles from '../../index.module.scss';

const AdminRoute = () => {
  const { user } = useAuth0();

  return isAdmin(user) ? (
    <Outlet />
  ) : (
    <div className={globStyles['error-text']}>
      You do not have access to this page
    </div>
  );
};

export default AdminRoute;
