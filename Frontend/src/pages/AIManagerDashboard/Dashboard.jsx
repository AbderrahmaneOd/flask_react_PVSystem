import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "../../components/sidebar/SidebarManager";
import Navbar from "../../components/navbar/Navbar";
import "./Dashboard.scss";
import ProcessingSteps from "../../components/steps/ProcessingSteps";
import Featured from "../../components/featured/Featured";
import Table from "../../components/table/Table";


const Dashboard = () => {


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

          

        </Routes>
      </div>
    </div>
  );
}
export default Dashboard;
