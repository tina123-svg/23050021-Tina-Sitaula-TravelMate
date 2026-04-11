import React, { useState } from "react";
import { Mail, Lock, User, Building, MapPin, Phone, FileText, ArrowLeft } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

const API_URL = "https://travelmatess.onrender.com/api/auth";

export default function SignUpPage() {
  const [role, setRole] = useState<"traveler" | "agency">("traveler");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [agencyAddress, setAgencyAddress] = useState("");
  const [agencyPhone, setAgencyPhone] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !password) {
      toast.error("Full name, email, and password are required");
      return;
    }

    if (role === "agency") {
      if (!agencyName || !agencyAddress || !agencyPhone || !licenseNumber) {
        toast.error("All agency fields are required");
        return;
      }
    }

    setLoading(true);
    try {
      const payload: any = {
        fullName,
        email,
        password,
        role,
      };

      if (role === "agency") {
        payload.agencyName = agencyName;
        payload.agencyAddress = agencyAddress;
        payload.agencyPhone = agencyPhone;
        payload.licenseNumber = licenseNumber;
      }

      const res = await axios.post(`${API_URL}/signup`, payload);

      toast.success("Registration successful!");
      if (res.data.message && res.data.message.includes("pending")) {
        toast.info("Agency registration successful! Your account is pending admin approval.");
        navigate("/login");
      } else {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/login");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-gray-50 font-sans">

      {/* LEFT SIDE - Premium Image */}
      <div className="hidden lg:flex w-5/12 xl:w-1/2 relative bg-gray-900 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-[30s] hover:scale-110"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=2668&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent" />

        <div className="relative z-10 p-16 flex flex-col justify-end h-full w-full">
          <Link to="/" className="absolute top-12 left-12 text-white/70 hover:text-white flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>

          <div className="max-w-xl">
            <h2 className="text-4xl xl:text-5xl font-heading font-extrabold text-white mb-6 leading-tight tracking-tight">
              Begin your journey with <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">TravelMate</span>
            </h2>
            <p className="text-lg xl:text-xl text-gray-300 font-light leading-relaxed">
              Join millions of travelers who have discovered the world's hidden treasures with our platform.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Form Content */}
      <div className="w-full lg:w-7/12 xl:w-1/2 flex items-center justify-center p-6 sm:p-10 md:p-16 relative overflow-y-auto bg-gray-50">
        {/* Mobile Back Button */}
        <Link to="/" className="lg:hidden absolute top-6 left-6 text-gray-500 hover:text-gray-900 flex items-center gap-2 transition-colors z-10">
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-gray-100 sm:p-10 p-8 space-y-6 animate-fade-in-up my-10">
          <div className="text-center">
            <h1 className="text-3xl font-heading font-bold text-gray-900 tracking-tight">Create an account</h1>
            <p className="text-gray-500 mt-2">Start exploring or managing tours today.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 mt-8">

            {/* Role Selection Tabs */}
            <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
              <button
                type="button"
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${role === "traveler" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setRole("traveler")}
              >
                Traveler
              </button>
              <button
                type="button"
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${role === "agency" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setRole("agency")}
              >
                Travel Agency
              </button>
            </div>

            {/* Common Fields */}
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <User className="h-5 w-5" />
                </div>
                <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900" required />
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900" required />
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full pl-11 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900" required />
              </div>
            </div>

            {/* Agency Fields */}
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${role === "agency" ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"}`}>
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Agency Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                      <Building className="h-4 w-4" />
                    </div>
                    <input type="text" placeholder="Agency Name" value={agencyName} onChange={(e) => setAgencyName(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-white focus:focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-gray-900" />
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <input type="text" placeholder="Address" value={agencyAddress} onChange={(e) => setAgencyAddress(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-white focus:focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-gray-900" />
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                      <Phone className="h-4 w-4" />
                    </div>
                    <input type="tel" placeholder="Phone Number" value={agencyPhone} onChange={(e) => setAgencyPhone(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-white focus:focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-gray-900" />
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                      <FileText className="h-4 w-4" />
                    </div>
                    <input type="text" placeholder="License Number" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-white focus:focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm text-gray-900" />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/30 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-6"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-8">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")} className="font-semibold text-blue-600 hover:text-blue-500 cursor-pointer transition-colors">
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}