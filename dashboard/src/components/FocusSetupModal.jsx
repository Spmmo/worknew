import React from 'react';
import { X, Timer, Clock, Target, Calendar, Play, CheckCircle, User as UserIcon } from 'lucide-react';

const FocusSetupModal = ({ 
  isOpen, 
  onClose, 
  availableTasks,
  selectedTask,
  setSelectedTask,
  targetDate,
  setTargetDate,
  targetTime,
  setTargetTime,
  onStartFocus,
  formatTimeDisplay
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-slideDown">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Timer size={28} />
              <h2 className="text-2xl font-bold">Setup Focus Mode</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Select Task */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center gap-2">
                <Clock size={16} />
                Select Task to Focus On
              </div>
            </label>
            <select
              value={selectedTask?.id || ''}
              onChange={(e) => {
                const task = availableTasks.find(t => t.id === parseInt(e.target.value));
                setSelectedTask(task);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white appearance-none cursor-pointer"
            >
              <option value="">-- Choose a task --</option>
              {availableTasks.map(task => (
                <option key={task.id} value={task.id}>
                  {task.title} ({task.status === 'in-progress' ? 'In Progress' : 'Not Started'})
                </option>
              ))}
            </select>
          </div>

          {/* Time Selection - แบ่งเป็น 2 คอลัม */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Quick Duration */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center gap-2">
                  <Target size={16} />
                  Quick Focus Duration
                </div>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['15', '30', '45', '60', '90', '120'].map((minutes) => (
                  <button
                    key={minutes}
                    onClick={() => {
                      setTargetTime(minutes);
                      setTargetDate('');
                    }}
                    className={`py-2 rounded-lg text-sm font-medium transition-all ${
                      targetTime === minutes && !targetDate
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {minutes} min
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Date & Time */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  Custom Date & Time
                </div>
              </label>
              <input
                type="datetime-local"
                value={targetDate}
                onChange={(e) => {
                  setTargetDate(e.target.value);
                  setTargetTime('');
                }}
                min={new Date().toISOString().slice(0, 16)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent cursor-pointer"
              />
            </div>
          </div>

          {/* Custom Minutes Input */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Or Set Custom Minutes (1-480)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                max="480"
                value={targetTime}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  // จำกัดค่าระหว่าง 1-480
                  if (value >= 1 && value <= 480) {
                    setTargetTime(e.target.value);
                    setTargetDate('');
                  } else if (value > 480) {
                    setTargetTime('480');
                    setTargetDate('');
                  } else if (e.target.value === '') {
                    setTargetTime('');
                    setTargetDate('');
                  }
                }}
                onBlur={(e) => {
                  // เมื่อออกจาก input ถ้าค่าว่างให้ตั้งเป็น 30
                  if (!e.target.value || parseInt(e.target.value) < 1) {
                    setTargetTime('30');
                  }
                }}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-center text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="30"
              />
              <span className="text-gray-600 font-medium">minutes</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Enter between 1-480 minutes (up to 8 hours)
            </p>
          </div>

          {/* Preview */}
          {(selectedTask && (targetTime || targetDate)) && (
            <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg">
              <p className="text-sm font-medium text-purple-900 mb-3 flex items-center gap-2">
                <Timer size={16} />
                Session Preview:
              </p>
              <div className="space-y-2 text-sm text-purple-800">
                <div className="flex items-center gap-2">
                  <span className="w-20 text-purple-600">
                    <CheckCircle size={14} className="inline mr-1 text-green-600" />
                    Task:
                  </span>
                  <span className="font-medium">{selectedTask.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-20 text-purple-600">
                    <UserIcon size={14} className="inline mr-1 text-blue-600" />
                    Owner:
                  </span>
                  <span className="font-medium">{selectedTask.owner}</span>
                </div>
                {targetDate ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="w-20 text-purple-600">
                        <Clock size={14} className="inline mr-1 text-purple-600" />
                        Until:
                      </span>
                      <span className="font-medium">{new Date(targetDate).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-20 text-purple-600">
                        <Timer size={14} className="inline mr-1 text-orange-600" />
                        Duration:
                      </span>
                      <span className="font-medium">
                        {(() => {
                          const diff = Math.floor((new Date(targetDate) - new Date()) / 1000);
                          return formatTimeDisplay(diff);
                        })()}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-purple-600">
                      <Timer size={14} className="inline mr-1 text-orange-600" />
                      Duration:
                    </span>
                    <span className="font-medium">{targetTime} minutes</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Start Button */}
          <button
            onClick={onStartFocus}
            disabled={!selectedTask || (!targetDate && !targetTime)}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
              selectedTask && (targetDate || targetTime)
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-md hover:shadow-lg transform hover:scale-105'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Play size={20} />
            Start Focus Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default FocusSetupModal;