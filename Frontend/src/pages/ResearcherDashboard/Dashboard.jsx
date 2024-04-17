import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import SidebarResearcher from "../../components/sidebar/SidebarResearcher";
import Navbar from "../../components/navbar/Navbar";
import "./Dashboard.scss";
import Stepper from "../../components/steps/Steps";


const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('token') !== null && localStorage.getItem('tokenExpiration') > Date.now();
    const roles = JSON.parse(localStorage.getItem('roles'));

    if (!isLoggedIn) {
      // Redirect to login if user is not logged in
      navigate('/login');
    } else if (!roles.includes('researcher')) {
      // If user is not admin
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="home">
      <SidebarResearcher />
      <div className="homeContainer">
        <Navbar />

        <Routes>
          <Route path="/" element={
            <>
              <Stepper />
            </>
          } />

        </Routes>
      </div>
    </div>
  );
}
export default Dashboard;
