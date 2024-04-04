
import "./App.css";
import Footer from "./components/Footer";
import Home from "./pages/Home/Home";
import Navbar from "./components/Navbar";
import Login from "./components/auth/Login";
import Registration from "./components/auth/Register";
import AdminDashboard from "./pages/Dashbord/Dashboard";
import ListUsers from "./components/UserManagement/ListUsers";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {


  return (
    <>
        <Routes>
        <Route path="/users" element={<ListUsers />} />
          <Route path="/" element={<Home />} />
          <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
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
