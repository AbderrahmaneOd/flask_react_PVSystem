
import "./App.css";
import About from "./components/About";
import Blog from "./components/Blog";
import MyFooter from "./components/Footer";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Newsletter from "./components/Newsletter";
import Product from "./components/Product";
import Services from "./components/Services";
import Login from "./components/auth/Login";
import Registration from "./components/auth/Register";
import AdminDashboard from "./components/AdminDashboard/Dashboard";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {


  return (
    <>
      <Navbar />
      
      <Routes>
        <Route path="/" element={<>
          <Home/>
          <Services/>
          <About/>
          <Product/>
          <Blog/>
          <Newsletter/>          
        </>} />

        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
      
      <MyFooter/>
    </>
  );
}

export default App;
