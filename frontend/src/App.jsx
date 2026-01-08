import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HomePage from "./pages/Dashboard/HomePage";
import { ToastContainer } from 'react-toastify';
import ForgotPassword from "./pages/Auth/ForgotPassword";
import AdminDashboard from "./pages/Admin/AdminDashboard"
import TravelerDashbord from "./pages/TravlerDashboard/Dashboard";
import Package from "./pages/TravlerDashboard/Package";
import ComparePackage from "./pages/TravlerDashboard/ComaprePackage";
import PackageDetailPage from './pages/TravelerDetailPage/Detailpage';



export default function App() {
  return (
    <>

      <Routes>
        <Route path="/" element={<Navigate to="/Homepage" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/traveler-dashboard" element={<TravelerDashbord />} />
        <Route path="/package" element={<Package />} />
        <Route path="/Compare" element={<ComparePackage />} />
        <Route path="/package/:id" element={<PackageDetailPage />} />


      </Routes>
      <ToastContainer position="top-right" autoClose={4000} />

    </>
  );
}

// cawd924  