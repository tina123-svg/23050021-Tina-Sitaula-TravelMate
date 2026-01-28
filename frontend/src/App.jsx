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
import BookingPage from "./pages/Booking/BookingPage";
import BookingConfirmationPage from "./pages/Booking/BookingConfirmationPage";
import AgencyDashboard from "./pages/AgencyDashboard/AgencyDashboard";
import PackagesPage from "./pages/AgencyDashboard/PackagePage";
import BookingsPage from "./pages/AgencyDashboard/BookingPage";
import ReviewPage from "./pages/AgencyDashboard/ReviewPage";
import ProfilePage from "./pages/AgencyDashboard/ProfilePage";
import TravelerProfilePage from "./pages/TravlerDashboard/profilePage";
import MyBookingsPage from "./pages/TravlerDashboard/myBookingPage";
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
        <Route path="/booking/:packageId" element={<BookingPage />} />
        <Route path="/booking-confirmation/:bookingId" element={<BookingConfirmationPage />} />
        <Route path="/agency-dashboard" element={<AgencyDashboard />} />
        <Route path="/agency-packages" element={<PackagesPage />} />
        <Route path="/agency-booking" element={<BookingsPage />} />
        <Route path="/agency-Review" element={<ReviewPage />} />
        <Route path="/agency-Profile" element={<ProfilePage />} />
        <Route path="/profile" element={<TravelerProfilePage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />







      </Routes>
      <ToastContainer position="top-right" autoClose={4000} />

    </>
  );
}

