import React from "react";

const StatsCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>

      <div className="text-2xl font-bold text-gray-800 mb-1">{value}</div>
      <div className="text-gray-600">{title}</div>
    </div>
  );
};

export default StatsCard;