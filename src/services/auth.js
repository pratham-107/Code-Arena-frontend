// Utility functions for authentication

export const isAuthenticated = () => {
  const token = sessionStorage.getItem("token");
  return !!token;
};

export const getCurrentUser = () => {
  const user = sessionStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
};

export const setAuthData = (token, user) => {
  sessionStorage.setItem("token", token);
  sessionStorage.setItem("user", JSON.stringify(user));
};

export default {
  isAuthenticated,
  getCurrentUser,
  logout,
  setAuthData,
};