import React from 'react';

const MemberStatsCard = ({ member }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{member.avatar}</div>
          <div>
            <h3 className="font-semibold text-gray-900">{member.name}</h3>
            <p className="text-sm text-gray-600">{member.role}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold" style={{ color: member.color }}>
            {member.totalTasks}
          </p>
          <p className="text-xs text-gray-600">งานทั้งหมด</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">ความคืบหน้าเฉลี่ย</span>
          <span className="font-semibold" style={{ color: member.color }}>
            {member.avgProgress}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="h-3 rounded-full transition-all duration-300"
            style={{
              width: `${member.avgProgress}%`,
              backgroundColor: member.color,
            }}
          />
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center p-2 bg-green-50 rounded">
          <p className="text-lg font-bold text-green-600">{member.completed}</p>
          <p className="text-xs text-gray-600">Done</p>
        </div>
        <div className="text-center p-2 bg-blue-50 rounded">
          <p className="text-lg font-bold text-blue-600">{member.inProgress}</p>
          <p className="text-xs text-gray-600">Working on it</p>
        </div>
        <div className="text-center p-2 bg-gray-50 rounded">
          <p className="text-lg font-bold text-gray-600">{member.pending}</p>
          <p className="text-xs text-gray-600">Not Started</p>
        </div>
      </div>
    </div>
  );
};

export default MemberStatsCard;