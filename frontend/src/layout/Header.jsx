import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Heart, LogOut } from 'lucide-react';
import NotificationBell from '../components/NotificationBell';

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const logoDestination = isLoggedIn ? '/traveler-dashboard' : '/';

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">

          <Link to={logoDestination} className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="text-2xl font-bold text-blue-700">TravelMate</span>
          </Link>

          <nav className="flex items-center space-x-6">
            {isLoggedIn ? (
              <>
                <Link to="/package" className="text-gray-700 hover:text-blue-600 font-medium">
                  Explore Trips
                </Link>
                <Link to="/my-bookings" className="text-gray-700 hover:text-blue-600 font-medium">
                  My Bookings
                </Link>
                <Link to="/wishlist" className="flex items-center text-gray-700 hover:text-blue-600">
                  <Heart size={20} />
                </Link>

                <NotificationBell /> {/* 🔔 RIGHT HERE */}

                <Link to="/profile" className="p-2 hover:bg-gray-100 rounded-full">
                  <User className="w-5 h-5 text-gray-600" />
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-blue-600 font-semibold hover:underline">
                  Login
                </Link>
                <Link to="/signup" className="bg-blue-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-700 transition">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;