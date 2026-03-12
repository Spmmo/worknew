import React from 'react';
import { TrendingUp } from 'lucide-react';

const ProgressChart = ({ stats }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <TrendingUp className="w-6 h-6" />
        สรุปสถานะงานทั้งหมด
      </h2>
      
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-700 font-medium">Done</span>
            <span className="font-semibold text-green-600">
              {stats.completed} งาน ({Math.round((stats.completed / stats.total) * 100)}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-green-500 h-4 rounded-full transition-all duration-300"
              style={{ width: `${(stats.completed / stats.total) * 100}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-700 font-medium">กำลังทำ</span>
            <span className="font-semibold text-blue-600">
              {stats.inProgress} งาน ({Math.round((stats.inProgress / stats.total) * 100)}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-500 h-4 rounded-full transition-all duration-300"
              style={{ width: `${(stats.inProgress / stats.total) * 100}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-700 font-medium">รอดำเนินการ</span>
            <span className="font-semibold text-gray-600">
              {stats.pending} Task ({Math.round((stats.pending / stats.total) * 100)}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gray-500 h-4 rounded-full transition-all duration-300"
              style={{ width: `${(stats.pending / stats.total) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;