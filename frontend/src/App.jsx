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
import WishlistPage from "./pages/TravlerDashboard/wishlistPage";
import ProtectedRoute from "./components/ProtectedRoute"; 

export default function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/homepage" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/package" element={<Package />} />
        <Route path="/package/:id" element={<PackageDetailPage />} />
        <Route path="/Compare" element={<ComparePackage />} />

        {/* Traveler Routes */}
        <Route path="/traveler-dashboard" element={
          <ProtectedRoute allowedRoles={['traveler']}>
            <TravelerDashbord />
          </ProtectedRoute>
        } />
        <Route path="/booking/:packageId" element={
          <ProtectedRoute allowedRoles={['traveler']}>
            <BookingPage />
          </ProtectedRoute>
        } />
        <Route path="/booking-confirmation/:bookingId" element={
          <ProtectedRoute allowedRoles={['traveler']}>
            <BookingConfirmationPage />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={['traveler']}>
            <TravelerProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/my-bookings" element={
          <ProtectedRoute allowedRoles={['traveler']}>
            <MyBookingsPage />
          </ProtectedRoute>
        } />
        <Route path="/wishlist" element={
          <ProtectedRoute allowedRoles={['traveler']}>
            <WishlistPage />
          </ProtectedRoute>
        } />

        {/* Agency Routes */}
        <Route path="/agency-dashboard" element={
          <ProtectedRoute allowedRoles={['agency']}>
            <AgencyDashboard />
          </ProtectedRoute>
        } />
        <Route path="/agency-packages" element={
          <ProtectedRoute allowedRoles={['agency']}>
            <PackagesPage />
          </ProtectedRoute>
        } />
        <Route path="/agency-booking" element={
          <ProtectedRoute allowedRoles={['agency']}>
            <BookingsPage />
          </ProtectedRoute>
        } />
        <Route path="/agency-Review" element={
          <ProtectedRoute allowedRoles={['agency']}>
            <ReviewPage />
          </ProtectedRoute>
        } />
        <Route path="/agency-Profile" element={
          <ProtectedRoute allowedRoles={['agency']}>
            <ProfilePage />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/homepage" />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={4000} />
    </>
  );
}