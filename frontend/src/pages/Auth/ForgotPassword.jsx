import React, { useState, useRef } from "react";
import { Mail, Lock, ArrowLeft, KeyRound, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";

const API_URL = "https://travelmatess.onrender.com/api/auth";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const otpRefs = useRef([]);

  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/forgotpassword`, { email });
      toast.success("OTP sent! Check your email");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      toast.error("Please enter full 6-digit OTP");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/verify-otp`, { email, otp: otpString });
      toast.success("OTP verified!");
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/resetpassword`, { email, password: newPassword });
      toast.success("Password reset successful!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  const stepLabels = ["Enter Email", "Verify OTP", "New Password"];

  return (
    <>
      <ToastContainer position="top-center" autoClose={4000} />
      <div className="min-h-screen w-full flex bg-gray-50">
        {/* LEFT - Travel Image */}
        <div className="hidden lg:flex w-1/2 relative bg-gray-900 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-[30s] hover:scale-110"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2670&auto=format&fit=crop')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent" />
          <div className="relative z-10 p-14 flex flex-col justify-end h-full">
            <Link to="/" className="absolute top-12 left-12 text-white/70 hover:text-white flex items-center gap-2 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            <div className="max-w-lg">
              <h2 className="text-5xl font-extrabold text-white mb-5 leading-tight tracking-tight">
                Reset your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
                  access
                </span>{" "}
                and keep exploring.
              </h2>
              <p className="text-xl text-gray-300 font-light leading-relaxed">
                Don't let a forgotten password stop your next adventure. We'll have you back exploring in minutes.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 relative">
          <Link to="/" className="lg:hidden absolute top-8 left-8 text-gray-500 hover:text-gray-900 flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <div className="w-full max-w-md space-y-8">
            {/* Logo */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 shadow-lg text-white mb-6">
                <KeyRound size={28} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Reset Password</h1>
              <p className="text-gray-500 mt-2">We'll guide you back to your account</p>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center justify-between px-2">
              {stepLabels.map((label, i) => (
                <div key={i} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all mb-1 ${step > i + 1
                      ? "bg-emerald-500 text-white"
                      : step === i + 1
                        ? "bg-blue-600 text-white ring-4 ring-blue-100"
                        : "bg-gray-100 text-gray-400"
                      }`}
                  >
                    {step > i + 1 ? <CheckCircle2 size={18} /> : i + 1}
                  </div>
                  <span className={`text-xs font-medium ${step === i + 1 ? "text-blue-600" : "text-gray-400"}`}>
                    {label}
                  </span>
                  {i < stepLabels.length - 1 && (
                    <div className={`absolute hidden`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Email */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                      <Mail className="h-5 w-5" />
                    </div>
                    <input
                      type="email"
                      placeholder="hello@travelmate.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900"
                      required
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    We'll send a 6-digit verification code to this address.
                  </p>
                </div>
                <button
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/20 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:transform-none"
                >
                  {loading ? "Sending OTP..." : "Send Verification Code"}
                </button>
              </div>
            )}

            {/* Step 2: OTP */}
            {step === 2 && (
              <div className="space-y-6">
                <p className="text-sm text-gray-600 text-center">
                  Enter the 6-digit code sent to <span className="font-medium text-blue-600">{email}</span>
                </p>
                <div className="flex justify-center gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpRefs.current[index] = el)}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-14 text-center text-xl font-bold border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-gray-800 bg-gray-50 focus:bg-white transition-all"
                    />
                  ))}
                </div>
                <button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/20 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transform hover:-translate-y-0.5 transition-all disabled:opacity-70"
                >
                  {loading ? "Verifying..." : "Verify Code"}
                </button>
                <button
                  onClick={() => { setStep(1); setOtp(["", "", "", "", "", ""]); }}
                  className="w-full text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                  Didn't receive the code? Go back
                </button>
              </div>
            )}

            {/* Step 3: New Password */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                      type="password"
                      placeholder="Min. 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                      type="password"
                      placeholder="Repeat your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900"
                      required
                    />
                  </div>
                </div>
                <button
                  onClick={handleResetPassword}
                  disabled={loading}
                  className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/20 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transform hover:-translate-y-0.5 transition-all disabled:opacity-70"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            )}

            <p className="text-center text-sm text-gray-600">
              Remember your password?{" "}
              <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-500 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
