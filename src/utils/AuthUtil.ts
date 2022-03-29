export const isAdmin = (email: string): boolean => {
  return email === import.meta.env.VITE_AUTH0_ADMIN_USER;
};
