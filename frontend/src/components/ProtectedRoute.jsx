import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ForbiddenPage from "../pages/ForbiddenPage";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const [authState, setAuthState] = useState({
    loading: true,
    isAuthorized: false,
    isForbidden: false
  });

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      let newState = {
        loading: false,
        isAuthorized: false,
        isForbidden: false
      };

      // No token or user - not logged in
      if (!token || !user || Object.keys(user).length === 0) {
        setAuthState(newState);
        return;
      }

      // Check if user has required role
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        newState.isForbidden = true;
        setAuthState(newState);
        return;
      }

      // All checks passed
      newState.isAuthorized = true;
      setAuthState(newState);
    };

    checkAuth();
  }, [allowedRoles]);

  if (authState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (authState.isForbidden) {
    return <ForbiddenPage />;
  }

  if (!authState.isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;