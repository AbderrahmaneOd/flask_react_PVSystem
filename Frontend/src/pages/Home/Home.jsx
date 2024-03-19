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
import { Routes, Route } from 'react-router-dom';

function Home() {

    return (
        <>
        
          <Navbar />
          <Banner/>
          <Services/>
          <About/>
          <Product/>
          <Blog/>
          <Newsletter/>          
          <Footer/>
        </>
      );
}

export default Home;