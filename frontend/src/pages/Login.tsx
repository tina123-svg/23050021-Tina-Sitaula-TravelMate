import React from "react";
import { Mail, Lock, Facebook, Apple, Chrome } from "lucide-react";

export default function LoginPage() {
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
      {/* MAIN WHITE BOX */}
      <div className="w-[92%] max-w-6xl bg-white rounded-xl shadow-2xl overflow-hidden flex">
        
        {/* LEFT IMAGE SECTION */}
        <div
          className="w-1/2 bg-cover bg-center relative"
          style={{ backgroundImage: "url('/src/assets/img.png')" }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>

          {/* TEXT – little lower than center */}
          <div className="relative z-10 h-full flex items-center p-10"
               style={{ paddingTop: "12%" }}>
            <h2 className="text-white text-4xl font-bold w-4/5 leading-tight">
              Life is short. Work hard, travel harder.
            </h2>
          </div>
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="w-1/2 bg-[#0F4CB5] flex items-center justify-center p-10">
          <div className="w-full max-w-sm space-y-7">
            
            {/* HEADER */}
            <div className="border border-white text-white py-2 text-center uppercase font-semibold tracking-wide rounded">
              Travel Mate
            </div>

            {/* GOOGLE LOGIN */}
            <button className="w-full flex items-center justify-center gap-3 bg-white/20 text-white py-3 rounded-lg hover:bg-white/30 transition">
              <Chrome size={18} />
              Continue with Google
            </button>

            {/* SOCIAL ICON ROW */}
            <div className="flex gap-4">
              <button className="w-1/2 flex items-center justify-center bg-white/20 py-3 rounded-lg text-white hover:bg-white/30 transition">
                <Facebook size={18} />
              </button>
              <button className="w-1/2 flex items-center justify-center bg-white/20 py-3 rounded-lg text-white hover:bg-white/30 transition">
                <Apple size={18} />
              </button>
            </div>

            {/* EMAIL FIELD */}
            <div className="bg-white flex items-center gap-3 rounded-lg px-4 py-3 shadow">
              <Mail size={18} className="text-gray-500" />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-transparent focus:outline-none text-gray-800"
              />
            </div>

            {/* PASSWORD FIELD */}
            <div className="bg-white flex items-center gap-3 rounded-lg px-4 py-3 shadow">
              <Lock size={18} className="text-gray-500" />
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-transparent focus:outline-none text-gray-800"
              />
            </div>

            {/* LOGIN BUTTON */}
            <button className="w-full bg-white text-[#0F4CB5] font-semibold py-3 rounded-full shadow hover:bg-gray-100 transition">
              LOGIN
            </button>

            {/* SIGNUP TEXT */}
            <p className="text-center text-white/80">
              Don’t have an account?
              <span className="text-white ml-1 cursor-pointer hover:underline">
                Sign up
              </span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
