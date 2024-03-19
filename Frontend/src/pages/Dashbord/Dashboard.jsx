import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useEffect } from 'react';


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



import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./Dashboard.scss";
import Widget from "../../components/widget/Widget";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import Table from "../../components/table/Table";

const Home = () => {
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
        <div className="widgets">
          <Widget type="user" />
          <Widget type="order" />
          <Widget type="earning" />
          <Widget type="balance" />
        </div>
        <div className="charts">
          <Featured />
          <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} />
        </div>
        <div className="listContainer">
          <div className="listTitle">Latest Transactions</div>
          <Table />
        </div>
      </div>
    </div>
  );
};

export default Home;
