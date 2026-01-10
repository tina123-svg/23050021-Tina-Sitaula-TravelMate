import React from "react";
import AgencySidebar from "./AgencySidebar";
import AgencyHeader from "./AgencyHeader";

const AgencyLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AgencyHeader />

      <div className="flex">
        {/* Sidebar */}
        <AgencySidebar />

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AgencyLayout;