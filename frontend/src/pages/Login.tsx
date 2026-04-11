import React, { useState } from "react";
import { Mail, Lock, ArrowLeft } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

const API_URL = "https://travelmatess.onrender.com/api/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login successful!");

      const user = res.data.user;
      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (user.role === "agency") {
        navigate("/agency-dashboard");
      } else {
        navigate("/traveler-dashboard");
      }

    } catch (err: any) {
      const message = err.response?.data?.message || "Login failed. Please try again.";
      if (message.includes("Invalid credentials")) {
        toast.error("Wrong email or password");
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gray-50 font-sans">

      {/* LEFT SIDE - Premium Image */}
      <div className="hidden lg:flex w-1/2 relative bg-gray-900 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-[30s] hover:scale-110"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&q=80&w=2670')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent" />

        <div className="relative z-10 p-16 flex flex-col justify-end h-full w-full">
          <Link to="/" className="absolute top-12 left-12 text-white/70 hover:text-white flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>

          <div className="max-w-xl">
            <h2 className="text-5xl font-heading font-extrabold text-white mb-6 leading-tight tracking-tight">
              Your next grand <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">adventure</span> awaits.
            </h2>
            <p className="text-xl text-gray-300 font-light leading-relaxed">
              Log in to uncover personalized itineraries, exclusive deals, and unforgettable experiences curated just for you.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Form Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 relative bg-gray-50">
        {/* Mobile Back Button */}
        <Link to="/" className="lg:hidden absolute top-8 left-8 text-gray-500 hover:text-gray-900 flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 sm:p-10 p-8 space-y-8 animate-fade-in-up">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 shadow-lg text-white mb-6">
              <span className="font-heading font-bold text-3xl">T</span>
            </div>
            <h1 className="text-3xl font-heading font-bold text-gray-900 tracking-tight">Welcome back</h1>
            <p className="text-gray-500 mt-3">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 mt-10">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900"
                  placeholder="hello@travelmate.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 cursor-pointer transition-colors"
                >
                  Forgot password?
                </div>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/30 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-8"
            >
              {loading ? "Signing in..." : "Sign in to your account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="font-semibold text-blue-600 hover:text-blue-500 cursor-pointer transition-colors"
            >
              Sign up free
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}