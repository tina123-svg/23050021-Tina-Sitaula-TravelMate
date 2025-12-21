import React from "react";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-1200 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-xl">TM</span>
              </div>
              <span className="font-bold text-2xl text-white">Travel Mate</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Your trusted partner for unforgettable Nepal travel experiences — from Himalayas to heritage.
            </p>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-bold text-white text-lg mb-5">Company</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-bold text-white text-lg mb-5">Legal</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Refund Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-bold text-white text-lg mb-5">Follow Us</h3>
            <div className="flex gap-5">
              <a
                href="#"
                className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition"
              >
                <Facebook size={20} className="text-white" />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition"
              >
                <Instagram size={20} className="text-white" />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition"
              >
                <Twitter size={20} className="text-white" />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition"
              >
                <Linkedin size={20} className="text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>
            © {currentYear} Travel Mate. All rights reserved. Made with ❤️ for Nepal adventurers.
          </p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <a href="#" className="hover:text-orange-400 transition">
              Privacy
            </a>
            <a href="#" className="hover:text-orange-400 transition">
              Terms
            </a>
            <a href="#" className="hover:text-orange-400 transition">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}