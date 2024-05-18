import { useState, useEffect } from 'react';

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isManager, setIsManager] = useState(false); // Ajout de la vérification pour le rôle de gestionnaire

  useEffect(() => {
    // Check if the user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    // Check if the user has the admin or manager role
    const roles = JSON.parse(localStorage.getItem('roles'));
    setIsAdmin(roles && roles.includes('admin'));
    setIsManager(roles && roles.includes('responsableAi'));
  }, []);

  return { isLoggedIn, isAdmin, isManager }; // Retourne également l'état pour le rôle de gestionnaire
};

export default useAuth;
