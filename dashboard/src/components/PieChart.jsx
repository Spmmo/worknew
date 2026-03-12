import React from 'react';

const PieChart = ({ data }) => {
  // กรองข้อมูลที่มี value > 0
  const validData = data.filter(item => item.value > 0);
  const total = validData.reduce((sum, item) => sum + item.value, 0);
  
  // ถ้าไม่มีข้อมูลเลย แสดงวงกลมเทา
  if (total === 0) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full max-w-[280px] mx-auto">
        <circle cx="50" cy="50" r="40" fill="#e5e7eb" />
        <text x="50" y="50" textAnchor="middle" dy=".3em" className="text-xs fill-gray-500">
          No data
        </text>
      </svg>
    );
  }
  
  // ถ้ามีข้อมูลแค่อันเดียว แสดงวงกลมเต็มสีเดียว
  if (validData.length === 1) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full max-w-[280px] mx-auto">
        <circle 
          cx="50" 
          cy="50" 
          r="40" 
          fill={validData[0].color}
          className="transition-all duration-300 hover:opacity-80 cursor-pointer"
        />
      </svg>
    );
  }
  
  let currentAngle = -90;

  const createSlice = (percentage, color) => {
    const angle = (percentage / 100) * 360;
    const endAngle = currentAngle + angle;
    const largeArc = angle > 180 ? 1 : 0;

    const startX = 50 + 40 * Math.cos((Math.PI * currentAngle) / 180);
    const startY = 50 + 40 * Math.sin((Math.PI * currentAngle) / 180);
    const endX = 50 + 40 * Math.cos((Math.PI * endAngle) / 180);
    const endY = 50 + 40 * Math.sin((Math.PI * endAngle) / 180);

    const path = `M 50 50 L ${startX} ${startY} A 40 40 0 ${largeArc} 1 ${endX} ${endY} Z`;
    
    currentAngle = endAngle;
    return path;
  };

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full max-w-[280px] mx-auto">
      {validData.map((item, index) => {
        const percentage = (item.value / total) * 100;
        return (
          <path
            key={index}
            d={createSlice(percentage, item.color)}
            fill={item.color}
            className="transition-all duration-300 hover:opacity-80 cursor-pointer"
            style={{ transformOrigin: '50% 50%' }}
          />
        );
      })}
    </svg>
  );
};

export default PieChart;