import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "../../components/sidebar/SidebarAdmin";
import Navbar from "../../components/navbar/Navbar";
import "./Dashboard.scss";
import Featured from "../../components/featured/Featured";
import Table from "../../components/table/Table";
import Users from '../../components/UserManagement/list/Users';
import User from '../../components/UserManagement/list/User';



const Dashboard = () => {
  /*
  const navigate = useNavigate();
  const { isLoggedIn, isAdmin } = useAuth();

  useEffect(() => {
    console.log("isLoggedIn:", isLoggedIn);
    console.log("isAdmin:", isAdmin);
    if (!isLoggedIn) {
      // Redirect to login if user is not logged in
      navigate('/login');
    } else if (!isAdmin) {
      // Redirect to unauthorized page if user is not admin
      navigate('/');
    }
  }, [isLoggedIn, isAdmin, navigate]); // Dependencies for the effect
  */

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />

        <Routes>
          <Route path="/" element={
            <>
              <div className="charts">
                <Featured />
              </div>
              <div className="listContainer">
                <div className="listTitle">Latest Transactions</div>
                <Table />
              </div>
            </>
          } />

          <Route path="users" element={<Users />} />
          <Route path="user/:username" element={<User />} />

        </Routes>
      </div>
    </div>
  );
}
export default Dashboard;
