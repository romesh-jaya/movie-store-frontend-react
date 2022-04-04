import { User } from '@auth0/auth0-react';

export const isAdmin = (user?: User): boolean => {
  if (!user) {
    return false;
  }

  if (!user.email) {
    return false;
  }

  return user.email === import.meta.env.VITE_AUTH0_ADMIN_USER;
};
