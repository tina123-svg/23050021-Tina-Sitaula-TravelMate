// components/agency/AgencySidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Package, BookOpen, Users,
  Star, Settings
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
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)]">
      <div className="p-6">
        {/* Agency Info */}
        <div className="mb-8 p-4 bg-green-50 rounded-lg">
          <div className="text-sm text-green-800 mb-1">Himalayan Adventures</div>
          <div className="text-xs text-green-600">Verified Agency</div>
          <div className="flex items-center mt-2">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            <span className="text-xs ml-1 font-medium">4.8/5 (42 reviews)</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive
                    ? "bg-green-50 text-green-700 font-medium border-l-4 border-green-600"
                    : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                <Icon size={20} className="mr-3" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default AgencySidebar;