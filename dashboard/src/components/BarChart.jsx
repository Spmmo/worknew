import React from 'react';

const BarChart = ({ data }) => {
  // 1. ตรวจสอบกรณีไม่มีข้อมูล
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-sm font-medium">No tasks found</p>
        </div>
      </div>
    );
  }

  // 2. คำนวณหาค่าสูงสุดเพื่อกำหนด Scale
  const realMax = Math.max(...data.map(d => d.value));
  // กำหนดให้เพดานกราฟขั้นต่ำคือ 5 (ถ้างานน้อยกว่า 5 แท่งจะไม่สูงปรี๊ด) 
  // และให้เพดานสูงกว่าค่าจริง 1 หน่วยเสมอเพื่อให้มี Space ด้านบน
  const chartMax = Math.max(5, realMax + 1);

  return (
    <div className="h-64 flex items-end justify-center gap-4 px-2">
      
      {/* 3. ส่วนแสดงแกน Y (ตัวเลขบอกจำนวน) */}
      <div className="flex flex-col justify-between h-48 text-[10px] text-gray-400 pb-2 mb-11">
        <span>{chartMax}</span>
        <span>{Math.floor(chartMax / 2)}</span>
        <span>0</span>
      </div>

      {data.map((item, index) => {
        // คำนวณความสูงเป็น % เทียบกับ chartMax
        const heightPercentage = (item.value / chartMax) * 100;

        return (
          <div key={index} className="flex flex-col items-center gap-3 flex-1 max-w-[80px]">
            {/* 4. Container ของแท่งกราฟ */}
            <div className="w-full h-48 bg-gray-50 rounded-lg flex items-end p-1 relative shadow-inner">
              
              {/* ตัวเลขจำนวน Task บนหัวแท่ง */}
              <div 
                className="absolute left-1/2 transform -translate-x-1/2 text-[11px] font-bold text-blue-600 transition-all duration-500"
                style={{ bottom: `calc(${heightPercentage}% + 8px)` }}
              >
                {item.value}
              </div>

              {/* แท่งกราฟหลัก */}
              <div 
                className="w-full bg-blue-500 rounded-t-md transition-all duration-700 ease-out hover:bg-blue-600 cursor-pointer relative group shadow-sm"
                style={{ height: `${heightPercentage}%` }}
              >
                {/* Tooltip เมื่อเอาเมาส์ไปชี้ */}
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                  {item.label}: {item.value} tasks
                </div>
              </div>
            </div>
            
            {/* 5. ส่วนข้อมูลเจ้าของงาน (Icon & Name) */}
            <div className="flex flex-col items-center gap-1 w-full">
              <div className="w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center text-[10px] text-white font-bold shadow-sm border border-white">
                {item.icon}
              </div>
              <span className="text-[10px] text-gray-600 font-medium truncate w-full text-center">
                {item.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BarChart;