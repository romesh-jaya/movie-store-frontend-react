export const isAdmin = (email: string): boolean => {
  return email === import.meta.env.REACT_APP_AUTH0_ADMIN_USER;
};
