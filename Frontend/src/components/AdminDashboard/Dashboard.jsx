import React from 'react';
import { Redirect } from 'react-router-dom';
import useAuth from '../hooks/useAuth';


/*
function AdminDashboard() {
  const { isLoggedIn, isAdmin } = useAuth();

  if (!isLoggedIn) {
    // Redirect to login if user is not logged in
    return <Redirect to="/" />;
  }

  if (!isAdmin) {
    // Redirect to unauthorized page if user is not admin
    return <Redirect to="/unauthorized" />;
  }

  return (
    <div>
      <h2>Welcome to Your Dashboard</h2>
    </div>
  );
} */

export default AdminDashboard;
