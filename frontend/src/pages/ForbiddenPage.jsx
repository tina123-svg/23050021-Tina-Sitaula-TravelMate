import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Compass, Map } from 'lucide-react';

const ForbiddenPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=2675&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-blue-900/80 to-slate-900/90" />
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-lg">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-400 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">T</span>
          </div>
          <span className="text-white font-bold text-2xl">TravelMate</span>
        </div>

        {/* 403 Badge */}
        <div className="relative inline-block mb-8">
          <div className="w-32 h-32 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 mx-auto">
            <Compass size={56} className="text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
            403
          </div>
        </div>

        {/* Message */}
        <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">
          Off the Map
        </h1>
        <p className="text-lg text-blue-100/80 mb-4 leading-relaxed">
          This destination is restricted territory. You don't have the right permissions to explore this area.
        </p>
        <p className="text-sm text-blue-200/60 mb-10">
          If you believe this is a mistake, please contact our support team or try logging in with the correct account.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-medium rounded-xl transition-all backdrop-blur-md"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Home size={18} />
            Back to Home
          </button>
        </div>

        {/* Help Text */}
        <p className="mt-10 text-sm text-blue-200/50">
          Need help?{' '}
          <button className="text-blue-300 hover:text-white font-medium transition-colors underline underline-offset-2">
            Contact Support
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForbiddenPage;