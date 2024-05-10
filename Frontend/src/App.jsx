
import "./App.css";
import Footer from "./pages/Home/Footer";
import Home from "./pages/Home/Home";
import Navbar from "./pages/Home/Navbar";
import Login from "./components/auth/Login";
import Registration from "./components/auth/Register";
import AdminDashboard from "./pages/AdminDashboard/Dashboard";
import ResearcherDashboard from "./pages/ResearcherDashboard/Dashboard"
import AIManagerDashboard from "./pages/AIManagerDashboard/Dashboard"
import { Routes, Route } from 'react-router-dom';
import PieChart from "./components/Diagnostic/PieChart";
import ListModels from "./components/modelsManagement/ListModels";
import ContactUsForm from "./components/Reclamation/ContactUsForm";


import 'bootstrap/dist/css/bootstrap.min.css';


function App() {


  return (
    <>
        <Routes>

       
        <Route path="/rec" element={<ContactUsForm/>} />


          
          <Route path="/" element={<Home />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/researcher/*" element={<ResearcherDashboard />} />
          <Route path="/manager/*" element={<AIManagerDashboard />} />

          <Route path="/register" element={<>
            <Navbar />
            <Registration />
            <Footer/>
          </>} />
          
          <Route path="/login" element={<>
            <Navbar />
            <Login />
            <Footer/>
          </>
            
            
          } />
        </Routes>
    </>
  );
}

export default App;
