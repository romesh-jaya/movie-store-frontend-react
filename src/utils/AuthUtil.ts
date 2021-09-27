export const isAdmin = (email: string): boolean => {
  return email === process.env.REACT_APP_AUTH0_ADMIN_USER;
};
