import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, Heart, LogOut } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();

  // Check login status (adjust 'token' or 'user' to match your localStorage key)
  const isLoggedIn = !!localStorage.getItem('token'); // or !!localStorage.getItem('user')

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/'); // back to landing
  };

  // Logo click destination
  const logoDestination = isLoggedIn ? '/traveler-dashboard' : '/';

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">

          {/* Logo - conditional destination */}
          <Link to={logoDestination} className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">T</span>
            </div>
            <span className="text-2xl font-bold text-blue-700">TravelMate</span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search destinations, packages..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">

            {/* Logged in: full nav + logout */}
            {isLoggedIn ? (
              <>
                <Link to="/package" className="text-gray-700 hover:text-blue-600 font-medium">
                  Explore Trips
                </Link>

                <Link to="/my-bookings" className="text-gray-700 hover:text-blue-600 font-medium">
                  My Bookings
                </Link>

                <Link to="/wishlist" className="flex items-center text-gray-700 hover:text-blue-600">
                  <Heart size={20} className="mr-2" />

                </Link>

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
                <Link
                  to="/login"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-700 transition"
                >
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