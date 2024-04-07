import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SidebarResearcher from "../../components/sidebar/SidebarResearcher";
import Navbar from "../../components/navbar/Navbar";
import "./Dashboard.scss";
import Stepper from "../../components/steps/ProcessingSteps";


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




const Dashboard = () => {

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
