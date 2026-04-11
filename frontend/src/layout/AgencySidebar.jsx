// components/agency/AgencySidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Package, BookOpen,
  Star, Settings, Users
} from "lucide-react";

const AgencySidebar = () => {
  const navItems = [
    { path: "/agency-dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/agency-packages", icon: Package, label: "Packages" },
    { path: "/agency-booking", icon: BookOpen, label: "Bookings" },
    { path: "/agency-Review", icon: Users, label: "Customers & Reviews" },
    { path: "/agency-profile", icon: Settings, label: "Agency Profile" }
  ];

  return (
    <aside className="w-64 bg-slate-900 min-h-[calc(100vh-57px)] flex flex-col">
      {/* Background image overlay */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400')`,
          backgroundSize: 'cover',
          width: '256px',
          minHeight: 'calc(100vh - 57px)'
        }}
      />

      <div className="relative p-5 flex flex-col h-full">
        {/* Agency Info Card */}
        <div className="mb-6 p-4 bg-white/5 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              A
            </div>
            <div>
              <div className="text-sm font-semibold text-white leading-tight">My Agency</div>
              <div className="text-xs text-white/50">Travel Agency</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-teal-500/20 rounded-lg w-fit">
            <Star size={11} className="fill-teal-400 text-teal-400" />
            <span className="text-xs text-teal-300 font-medium">Verified Partner</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 flex-1">
          <div className="text-xs font-semibold text-white/30 uppercase tracking-widest px-3 mb-3">Menu</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm ${isActive
                    ? "bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/30"
                    : "text-white/60 hover:bg-white/5 hover:text-white/90"
                  }`
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer hint */}
        <div className="pt-4 border-t border-white/10">
          <p className="text-xs text-white/25 text-center">TravelMate Agency Portal</p>
        </div>
      </div>
    </aside>
  );
};

export default AgencySidebar;