import { useState, useEffect } from 'react';

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if the user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    // Check if the user has the admin role
    const roles = JSON.parse(localStorage.getItem('roles'));
    setIsAdmin(roles && roles.includes('admin'));
  }, []);

  return { isLoggedIn, isAdmin };
};

export default useAuth;
