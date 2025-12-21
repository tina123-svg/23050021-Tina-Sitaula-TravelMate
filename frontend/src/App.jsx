import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HomePage from "./pages/Dashboard/HomePage";
import { ToastContainer } from 'react-toastify';
export default function App() {
  return (
    <>

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/homepage" element={<HomePage />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />

    </>
  );
}
