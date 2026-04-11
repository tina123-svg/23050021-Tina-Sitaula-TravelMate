import React from "react";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-gray-400 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6 group cursor-pointer">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-all">
                <span className="text-white font-heading font-bold text-2xl">T</span>
              </div>
              <span className="font-heading font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                TravelMate
              </span>
            </div>
            <p className="leading-relaxed text-gray-400/90 text-sm">
              Your trusted partner for unforgettable travel experiences — from majestic mountains to hidden beaches. Explore the world with confidence.
            </p>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-heading font-semibold text-white text-lg mb-6">Company</h3>
            <ul className="space-y-4">
              {["About Us", "Contact", "Blog", "Careers"].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-transform duration-200 text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-heading font-semibold text-white text-lg mb-6">Legal</h3>
            <ul className="space-y-4">
              {[
                "Terms & Conditions",
                "Privacy Policy",
                "Refund Policy",
                "FAQ",
              ].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-transform duration-200 text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-heading font-semibold text-white text-lg mb-6">Follow Us</h3>

            {/** restore links like before */}
            {(() => {
              const socialLinks = [
                { Icon: Facebook, url: "https://facebook.com", label: "Facebook" },
                { Icon: Instagram, url: "https://instagram.com", label: "Instagram" },
                { Icon: Twitter, url: "https://twitter.com", label: "Twitter" },
                { Icon: Linkedin, url: "https://linkedin.com", label: "LinkedIn" }
              ];

              return (
                <div className="flex gap-4">
                  {socialLinks.map(({ Icon, url, label }, idx) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-10 h-10 bg-gray-900 border border-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 hover:-translate-y-1 transition-all duration-300 shadow-md group"
                    >
                      <Icon size={18} className="text-gray-400 group-hover:text-white transition-colors" />
                    </a>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800/60 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>
            © {currentYear} TravelMate. All rights reserved.
          </p>
          <div className="flex gap-8 mt-6 md:mt-0">
            {["Privacy", "Terms", "Sitemap"].map((item) => (
              <a
                key={item}
                href="#"
                className="hover:text-white transition-colors"
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
