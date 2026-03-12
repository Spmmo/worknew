import React from 'react';

const Legend = ({ data }) => (
  <div className="space-y-3">
    {data.map((item, index) => (
      <div key={index} className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: item.color }}
          />
          <span className="text-gray-700">{item.label}</span>
        </div>
        <span className="font-semibold text-gray-900">{item.percentage}%</span>
      </div>
    ))}
  </div>
);

export default Legend;