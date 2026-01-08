import React from "react";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-xl">TM</span>
              </div>
              <span className="font-bold text-2xl text-white">Travel Mate</span>
            </div>
            <p className="leading-relaxed">
              Your trusted partner for unforgettable Nepal travel experiences — from Himalayas to heritage.
            </p>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white text-lg mb-5">Company</h3>
            <ul className="space-y-3">
              {["About Us", "Contact", "Blog", "Careers"].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-orange-400 transition">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-white text-lg mb-5">Legal</h3>
            <ul className="space-y-3">
              {[
                "Terms & Conditions",
                "Privacy Policy",
                "Refund Policy",
                "FAQ",
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-orange-400 transition">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-white text-lg mb-5">Follow Us</h3>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter, Linkedin].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-11 h-11 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition"
                >
                  <Icon size={20} className="text-white" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-800 pt-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>
            © {currentYear} Travel Mate. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            {["Privacy", "Terms", "Sitemap"].map((item) => (
              <a
                key={item}
                href="#"
                className="hover:text-orange-400 transition"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
