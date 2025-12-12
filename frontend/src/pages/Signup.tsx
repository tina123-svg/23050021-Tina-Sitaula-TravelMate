import React, { useState } from "react";
import { Mail, Lock, User, Building, MapPin, Phone, FileText } from "lucide-react";

export default function SignUpPage() {
  const [role, setRole] = useState<"traveler" | "agency">("traveler");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [agencyAddress, setAgencyAddress] = useState("");
  const [agencyPhone, setAgencyPhone] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign Up →", {
      role,
      fullName,
      email,
      password,
      ...(role === "agency" && { agencyName, agencyAddress, agencyPhone, licenseNumber }),
    });
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
        `
      }}
    >
      {/* BOX SIZE NEVER CHANGES */}
      <div className="w-[92%] max-w-6xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">

        {/* LEFT IMAGE */}
        <div
          className="relative w-full lg:w-1/2 h-96 lg:h-auto bg-cover bg-center"
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

            {/* ROLE SELECTOR */}
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

            {/* COMMON FIELDS */}
            <div className="space-y-4">
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
            </div>

            {/* AGENCY FIELDS – DOUBLE COLUMN + SMOOTH ANIMATION */}
            <div className="overflow-hidden">
              <div
                className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-500 ease-in-out ${
                  role === "agency" ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 h-0"
                }`}
              >
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

            {/* REGISTER BUTTON */}
            <button
              onClick={handleSubmit}
              className="w-full bg-white text-[#0F4CB5] font-bold text-lg py-4 rounded-full shadow hover:bg-gray-100 transition"
            >
              REGISTER
            </button>

            <p className="text-center text-white/80">
              Already have an account?{" "}
              <span className="text-white font-bold hover:underline cursor-pointer">
                Login here
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}