import About from "../../components/About";
import Blog from "../../components/Blog";
import Footer from "../../components/Footer";
import Banner from "../../components/Banner";
import Navbar from "../../components/Navbar";
import Newsletter from "../../components/Newsletter";
import Product from "../../components/Product";
import Services from "../../components/Services";
import Login from "../../components/auth/Login";
import Registration from "../../components/auth/Register";
import AdminDashboard from "../Dashbord/Dashboard";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function Home() {
    return (
        <>
          <Navbar />
          
          <Routes>
            <Route path="/" element={<>
              <Banner/>
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
          
          <Footer/>
        </>
      );
}

export default Home;