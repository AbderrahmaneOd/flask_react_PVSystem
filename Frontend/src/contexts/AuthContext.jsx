import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Function to set user
  const login = (userData) => {
    setUser(userData);
  };

  // Function to logout
  const logout = () => {
    setUser(null);
  };

  // Function to check if user has a certain role
  const hasRole = (role) => {
    return user && user.roles && user.roles.includes(role);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create the useAuth custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};