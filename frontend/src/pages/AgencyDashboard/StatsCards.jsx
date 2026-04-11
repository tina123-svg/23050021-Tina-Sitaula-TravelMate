import React from 'react';

const StatsCard = ({ title, value, color, change, suffix = '', description }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">{title}</p>
          <div className="flex items-end mt-2">
            <div className="text-3xl font-bold text-gray-900">{value}</div>
            {suffix && <span className="text-lg text-gray-500 ml-1">{suffix}</span>}
          </div>
        </div>
        {/* <div className={`${color} p-3 rounded-lg`}>
          <Icon size={24} className="text-white" />
        </div> */}
      </div>

      {description && (
        <div className="text-sm text-gray-500 mb-2">{description}</div>
      )}

      {change && (
        <div className="flex items-center text-sm">
          <span className={`px-2 py-1 rounded ${color.includes('green') ? 'bg-green-100 text-green-800' : color.includes('blue') ? 'bg-blue-100 text-blue-800' : color.includes('yellow') ? 'bg-yellow-100 text-yellow-800' : 'bg-purple-100 text-purple-800'}`}>
            {change}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;