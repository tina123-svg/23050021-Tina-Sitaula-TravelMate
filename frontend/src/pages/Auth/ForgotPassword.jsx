import React, { useState, useRef } from "react";
import { Mail, Lock } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/auth";

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
      toast.success("OTP sent! Check server console");
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
      // Verify OTP first
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
      await axios.post(`${API_URL}/resetpassword`, {
        email,
        password: newPassword,
      });
      toast.success("Password reset successful!");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={4000} />

      <div
        className="min-h-screen w-full flex items-center justify-center relative"
        style={{
          background: `
            linear-gradient(
              115deg,
              #2435A1 0%,
              #2435A1 32%,
              white 32%,
              white 100%
            )
          `,
        }}
      >
        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>

        <div className="relative z-10 w-[92%] max-w-6xl bg-white rounded-xl shadow-2xl overflow-hidden flex">

          {/* LEFT IMAGE */}
          <div
            className="relative w-full lg:w-1/2 h-96 lg:h-auto bg-cover bg-center"
            style={{ backgroundImage: "url('/src/assets/img.png')" }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="relative z-10 h-full flex flex-col justify-center items-start p-10 lg:p-16 text-white">
              <h2 className="text-4xl font-bold leading-tight">
                Forgot Password?
              </h2>
              <p className="text-xl mt-4">
                No worries — we'll help you get back in
              </p>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="w-full lg:w-1/2 bg-[#0F4CB5] flex items-center justify-center p-10">
            <div className="w-full max-w-sm space-y-7">
              <div className="border border-white text-white py-2 text-center uppercase font-semibold tracking-wide rounded">
                Travel Mate
              </div>

              {step === 1 && (
                <div className="space-y-6">
                  <div className="bg-white flex items-center gap-3 rounded-lg px-4 py-3 shadow">
                    <Mail size={18} className="text-gray-500" />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent focus:outline-none text-gray-800"
                      required
                    />
                  </div>

                  <button
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="w-full bg-white text-[#0F4CB5] font-bold py-3 rounded-full shadow hover:bg-gray-100 transition disabled:opacity-70"
                  >
                    {loading ? "Sending..." : "Send OTP"}
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8">
                  <p className="text-center text-white/80 text-sm">
                    Enter the 6-digit code sent to your email
                  </p>
                  <div className="flex justify-center gap-4">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => (otpRefs.current[index] = el)}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-14 h-14 text-center text-2xl font-bold bg-white rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800"
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleVerifyOtp}
                    disabled={loading}
                    className="w-full bg-white text-[#0F4CB5] font-bold py-3 rounded-full shadow hover:bg-gray-100 transition disabled:opacity-70"
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="bg-white flex items-center gap-3 rounded-lg px-4 py-3 shadow">
                    <Lock size={18} className="text-gray-500" />
                    <input
                      type="password"
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-transparent focus:outline-none text-gray-800"
                      required
                    />
                  </div>

                  <div className="bg-white flex items-center gap-3 rounded-lg px-4 py-3 shadow">
                    <Lock size={18} className="text-gray-500" />
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-transparent focus:outline-none text-gray-800"
                      required
                    />
                  </div>

                  <button
                    onClick={handleResetPassword}
                    disabled={loading}
                    className="w-full bg-white text-[#0F4CB5] font-bold py-3 rounded-full shadow hover:bg-gray-100 transition disabled:opacity-70"
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                </div>
              )}

              <p className="text-center text-white/80">
                Remember password?{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="text-white font-bold hover:underline cursor-pointer"
                >
                  Login here
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}