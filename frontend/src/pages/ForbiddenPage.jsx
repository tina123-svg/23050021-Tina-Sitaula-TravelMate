import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Home, ArrowLeft, Lock } from 'lucide-react';

const ForbiddenPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Lock Icon with Animation */}
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Lock className="text-red-500" size={64} />
          </div>
          <div className="absolute -top-2 -right-2 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
            403
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          Access Forbidden
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          You don't have permission to access this page.
        </p>

        {/* User Info Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 shadow-sm">
          <div className="flex items-center justify-center mb-4">
            <Shield className="text-red-500 mr-2" size={20} />
            <span className="text-gray-700 font-medium">This area is restricted</span>
          </div>
          <p className="text-sm text-gray-500">
            If you believe this is a mistake, please contact support or try logging in with the correct account.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center px-6 py-3 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={18} className="mr-2" />
            Go Back
          </button>

          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home size={18} className="mr-2" />
            Go to Homepage
          </button>
        </div>

        {/* Support Link */}
        <p className="mt-8 text-sm text-gray-500">
          Need help?{' '}
          <button
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Contact Support
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForbiddenPage;