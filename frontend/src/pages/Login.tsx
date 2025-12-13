import React, { useState } from "react";
import { Mail, Lock, Facebook, Apple, Chrome } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; 

const API_URL = "http://localhost:5000/api/auth";

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
      
      // Save token and user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login successful!");
      // Redirect based on role or to dashboard
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
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
      <div className="w-[92%] max-w-6xl bg-white rounded-xl shadow-2xl overflow-hidden flex">
        
        {/* LEFT IMAGE */}
        <div
          className="relative w-full lg:w-1/2 h-96 lg:h-auto bg-cover bg-center"
          style={{ backgroundImage: "url('/src/assets/img.png')" }}
        >
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative z-10 h-full flex flex-col justify-center items-start p-10 lg:p-16 text-white">
            <h2 className="text-white text-4xl font-bold w-4/5 leading-tight">
              Life is short. Work hard, travel harder.
            </h2>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="w-1/2 bg-[#0F4CB5] flex items-center justify-center p-10">
          <div className="w-full max-w-sm space-y-7">
            <div className="border border-white text-white py-2 text-center uppercase font-semibold tracking-wide rounded">
              Travel Mate
            </div>

            {/* Social Buttons (you can implement later) */}
            <button className="w-full flex items-center justify-center gap-3 bg-white/20 text-white py-3 rounded-lg hover:bg-white/30 transition">
              <Chrome size={18} />
              Continue with Google
            </button>

            <div className="flex gap-4">
              <button className="w-1/2 flex items-center justify-center bg-white/20 py-3 rounded-lg text-white hover:bg-white/30 transition">
                <Facebook size={18} />
              </button>
              <button className="w-1/2 flex items-center justify-center bg-white/20 py-3 rounded-lg text-white hover:bg-white/30 transition">
                <Apple size={18} />
              </button>
            </div>

            {/* Form */}
             <form onSubmit={handleLogin} className="space-y-4">
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

              <div className="bg-white flex items-center gap-3 rounded-lg px-4 py-3 shadow">
                <Lock size={18} className="text-gray-500" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent focus:outline-none text-gray-800"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-[#0F4CB5] font-semibold py-3 rounded-full shadow hover:bg-gray-100 transition disabled:opacity-70"
              >
                {loading ? "Logging in..." : "LOGIN"}
              </button>
            </form>

            <p className="text-center text-white/80">
              Don’t have an account?
              <span onClick={() => navigate("/signup")} className="text-white ml-1 cursor-pointer hover:underline">
                Sign up
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}