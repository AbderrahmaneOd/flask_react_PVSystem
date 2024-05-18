import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import Sidebar from "../../components/sidebar/SidebarManager";
import Navbar from "../../components/navbar/Navbar";
import "./Dashboard.scss";
import Featured from "../../components/featured/Featured";
import Table from "../../components/table/Table";

import ListModels from "../../components/modelsManagement/ListModels";
import ModelForm from "../../components/modelsManagement/ModelForm";


import ListScripts from "../../components/scriptManagement/ListScripts";
import ScriptForm from "../../components/scriptManagement/ScriptForm";

const Dashboard = () => {
  const navigate = useNavigate();


  useEffect(() => {
    const isLoggedIn = localStorage.getItem('token') !== null && localStorage.getItem('tokenExpiration') > Date.now();
    const roles = JSON.parse(localStorage.getItem('roles'));

    if (!isLoggedIn) {
      // Redirect to login if user is not logged in
      navigate('/login');
    } else if (!roles.includes('responsableAi')) {
      // If user is not admin
      navigate('/');
    }
  }, [navigate]);

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

          <Route path="/listmodels" element={<ListModels />} />
          <Route path="models/:modelName" element={<ModelForm />} />


          <Route path="/listScripts" element={<ListScripts />} />
          <Route path="scripts/:scriptName" element={<ScriptForm />} />
          

        </Routes>
      </div>
    </div>
  );
}
export default Dashboard;
