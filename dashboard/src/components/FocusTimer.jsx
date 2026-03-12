import React, { useState } from 'react';
import { Timer, Play, Pause, RotateCcw, X, AlertTriangle } from 'lucide-react';

const FocusTimer = ({ 
  focusTime,
  isRunning,
  selectedTask,
  formatTimeDisplay,
  onPauseResume,
  onReset,
  onStop
}) => {
  const [showStopModal, setShowStopModal] = useState(false);

  if (focusTime <= 0) return null;

  const handleStopClick = () => {
    setShowStopModal(true);
  };

  const handleConfirmStop = () => {
    onStop();
    setShowStopModal(false);
  };

  const handleCancelStop = () => {
    setShowStopModal(false);
  };

  return (
    <>
      <div className="mb-8 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-6 animate-slideDown">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
              <Timer size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Focus Session Active</h3>
              <p className="text-sm text-gray-600">
                Working on: <span className="font-medium text-purple-700">{selectedTask?.title}</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-4xl font-bold font-mono text-gray-900">
                {formatTimeDisplay(focusTime)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Time remaining</p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={onPauseResume}
                className="p-2 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
                title={isRunning ? 'Pause' : 'Resume'}
              >
                {isRunning ? <Pause size={20} className="text-purple-700" /> : <Play size={20} className="text-purple-700" />}
              </button>
              <button
                onClick={onReset}
                className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                title="Reset"
              >
                <RotateCcw size={20} className="text-gray-600" />
              </button>
              <button
                onClick={handleStopClick}
                className="p-2 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                title="Stop"
              >
                <X size={20} className="text-red-600" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-1000"
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* Stop Confirmation Modal */}
      {showStopModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-slideDown">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle size={24} className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Stop Focus Session</h3>
                  <p className="text-sm text-gray-500">End the current session</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to stop the focus session? Your progress will be lost.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleCancelStop}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmStop}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Stop
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FocusTimer;