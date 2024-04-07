
import "./App.css";
import Footer from "./pages/Home/Footer";
import Home from "./pages/Home/Home";
import Navbar from "./pages/Home/Navbar";
import Login from "./components/auth/Login";
import Registration from "./components/auth/Register";
import Statistics from "./components/Statistics/Statistics";
import AdminDashboard from "./pages/AdminDashboard/Dashboard";
import ResearcherDashboard from "./pages/ResearcherDashboard/Dashboard"
import AIManagerDashboard from "./pages/AIManagerDashboard/Dashboard"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Stepper from "./components/steps/ProcessingSteps";

function App() {


  return (
    <>
        <Routes>
          
          <Route path="/" element={<Home />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/researcher/*" element={<ResearcherDashboard />} />
          <Route path="/manager/*" element={<AIManagerDashboard />} />

          <Route path="/statistics" element={<Statistics />} />

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
