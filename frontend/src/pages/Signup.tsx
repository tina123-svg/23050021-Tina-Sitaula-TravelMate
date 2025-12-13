import React, { useState } from "react";
import { Mail, Lock, User, Building, MapPin, Phone, FileText } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/auth"; 

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

    // Basic validation
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

      // Save token and user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Registration successful!");
      navigate("/dashboard"); // Or home page
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... same structure as before, just update form and button
    <div className="min-h-screen w-full flex items-center justify-center"
      style={{ background: `linear-gradient(115deg, #2435A1 0%, #2435A1 32%, white 32%, white 100%)` }}
    >
      <div className="w-[92%] max-w-6xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        
        {/* LEFT IMAGE */}
        <div className="relative w-full lg:w-1/2 h-96 lg:h-auto bg-cover bg-center"
          style={{ backgroundImage: "url('/src/assets/div.png')" }}
        >
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative z-10 h-full flex flex-col justify-center items-start p-10 lg:p-16 text-white">
            <h2 className="text-4xl lg:text-6xl font-extrabold leading-tight">
              Adventure<br />
              awaits.<br />
              <span className="text-orange-400">Join us today.</span>
            </h2>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="w-full lg:w-1/2 bg-[#0F4CB5] flex items-center justify-center p-10">
          <div className="w-full max-w-sm space-y-7">
            <div className="border border-white text-white py-2 text-center uppercase font-semibold tracking-wide rounded">
              Travel Mate
            </div>

            {/* Role Selector */}
            <div className="flex justify-center gap-10">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" checked={role === "traveler"} onChange={() => setRole("traveler")} className="w-5 h-5 accent-white" />
                <span className="text-white font-medium text-lg">Traveler</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" checked={role === "agency"} onChange={() => setRole("agency")} className="w-5 h-5 accent-white" />
                <span className="text-white font-medium text-lg">Agency</span>
              </label>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Common Fields */}
              <div className="bg-white flex items-center gap-3 rounded-lg px-4 py-3 shadow">
                <User size={18} className="text-gray-500" />
                <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-transparent focus:outline-none text-gray-800" required />
              </div>
              <div className="bg-white flex items-center gap-3 rounded-lg px-4 py-3 shadow">
                <Mail size={18} className="text-gray-500" />
                <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent focus:outline-none text-gray-800" required />
              </div>
              <div className="bg-white flex items-center gap-3 rounded-lg px-4 py-3 shadow">
                <Lock size={18} className="text-gray-500" />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent focus:outline-none text-gray-800" required />
              </div>

              {/* Agency Fields */}
              <div className="overflow-hidden">
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-500 ease-in-out ${role === "agency" ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 h-0"}`}>
                  <div className="bg-white flex items-center gap-3 rounded-lg px-4 py-3 shadow">
                    <Building size={18} className="text-gray-500" />
                    <input type="text" placeholder="Agency Name" value={agencyName} onChange={(e) => setAgencyName(e.target.value)} className="w-full bg-transparent focus:outline-none text-gray-800" />
                  </div>
                  <div className="bg-white flex items-center gap-3 rounded-lg px-4 py-3 shadow">
                    <MapPin size={18} className="text-gray-500" />
                    <input type="text" placeholder="Agency Address" value={agencyAddress} onChange={(e) => setAgencyAddress(e.target.value)} className="w-full bg-transparent focus:outline-none text-gray-800" />
                  </div>
                  <div className="bg-white flex items-center gap-3 rounded-lg px-4 py-3 shadow">
                    <Phone size={18} className="text-gray-500" />
                    <input type="tel" placeholder="Agency Phone" value={agencyPhone} onChange={(e) => setAgencyPhone(e.target.value)} className="w-full bg-transparent focus:outline-none text-gray-800" />
                  </div>
                  <div className="bg-white flex items-center gap-3 rounded-lg px-4 py-3 shadow">
                    <FileText size={18} className="text-gray-500" />
                    <input type="text" placeholder="License Number" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} className="w-full bg-transparent focus:outline-none text-gray-800" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-[#0F4CB5] font-bold text-lg py-4 rounded-full shadow hover:bg-gray-100 transition disabled:opacity-70"
              >
                {loading ? "Creating Account..." : "REGISTER"}
              </button>
            </form>

            <p className="text-center text-white/80">
              Already have an account?{" "}
              <span onClick={() => navigate("/login")} className="text-white font-bold hover:underline cursor-pointer">
                Login here
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}