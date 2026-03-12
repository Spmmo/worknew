import React from 'react';

const StatusCard = ({ title, count, color, icon }) => (
  <div 
    className="rounded-xl p-6 relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
    style={{ backgroundColor: color }}
  >
    <div className="flex justify-between items-start mb-8">
      <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">{title}</h3>
    </div>
    <div className="text-5xl font-bold text-gray-900">{count}</div>
    <div className="absolute -right-4 -bottom-4 opacity-10">
      {icon}
    </div>
  </div>
);

export default StatusCard;