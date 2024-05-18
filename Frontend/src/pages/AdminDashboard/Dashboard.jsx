import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import Sidebar from "../../components/sidebar/SidebarAdmin";
import Navbar from "../../components/navbar/Navbar";
import "./Dashboard.scss";
import Featured from "../../components/featured/Featured";
import Table from "../../components/table/Table";
import Users from '../../components/UserManagement/list/Users';
import User from '../../components/UserManagement/list/User';

import ModelForm from '../../components/modelsManagement/ModelForm';
import ListModels from '../../components/modelsManagement/ListModels';


import ListScripts from '../../components/scriptManagement/ListScripts';
import ScriptForm from '../../components/scriptManagement/ScriptForm';


import Widget from '../../components/widget/Widget';
import Widget1 from '../../components/UserStatistiques/UserWidgets/Widget';

import Diagnostic from "../../components/Diagnostic/Diagnostic";
import CpuChart from '../../components/Diagnostic/CpuChart';
import MemoryChart from '../../components/Diagnostic/MemoryChart';
import PieChart from "../../components/Diagnostic/PieChart";
import ChartRes from "../../components/Diagnostic/ChartRes";
import Chart from "../../components/UserStatistiques/chartCreationUser/Chart";
import DiskUsage from "../../components/Diagnostic/DiskUsage";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('token') !== null && localStorage.getItem('tokenExpiration') > Date.now();
    const roles = JSON.parse(localStorage.getItem('roles'));

    if (!isLoggedIn) {
      // Redirect to login if user is not logged in
      navigate('/login');
    } else if (!roles.includes('admin')) {
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
          <Route path="/Metrique" element={
            <>

              <div className="widgets">
                <Widget type="Temps_Reponse_Moyen" />
                <Widget type="Nombre_Requete_TOTAL" />
                <Widget type="Nombre_Requete_POST" />
                <Widget type="Nombre_Requete_GET" />
                <Widget type="Nombre_Requete_PUT" />
                <Widget type="Nombre_Requete_DELETE" />
                <Widget type="Server_Status" />

              </div>              <br/><br/><br/>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', width: '100%' }}>
                <div>
                  <div className="titlez" style={{ marginLeft: '130px'}}>Nombre de réponses par code</div>
                  <ChartRes />
                </div>
                <div>
                  <div className="titlez"style={{ marginLeft: '290px'}} >Nombre de réponses par type</div>
                  <PieChart />
                </div>
                <div style={{ marginLeft: '200px'}}>
                  <div className="titlez">Espace disponible</div>
                  <DiskUsage />
                </div>
              </div>
              <br/><br/><br/>
       



              
              <div >
                <div className="titlez" >Graphique d'utilisation du CPU</div>
                <CpuChart />              <br/><br/><br/>

                <div className="titlez" >Graphique d'utilisation de la mémoire</div>
                <MemoryChart />
              </div>




            </>
          } />

          <Route path="/" element={
            <>

              <div className="widgets">
                <Widget1 type="Nombre_Admin" />
                <Widget1 type="Nombre_Responsable_ai" />
                <Widget1 type="Nombre_Chercheur" />
                <Widget1 type="Nombre_Utilisateur_Totale" />
                <Widget1 type="Nombre_Models" />

              </div>

              <div className="charts">
                <Featured />
                <Chart title="Évolution du nombre d'utilisateurs" aspect={2 / 1} />
              </div>



            </>
          } />

          <Route path="users" element={<Users />} />
          <Route path="user/:username" element={<User />} />



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