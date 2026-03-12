import React from 'react';

const FocusCompletionModal = ({ 
  isOpen, 
  onClose, 
  selectedTask 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-slideDown">
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-5xl">🎉</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Time's Up!</h2>
          <p className="text-lg text-gray-600 mb-6">
            Great job completing your focus session
          </p>
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 mb-6">
            <p className="text-xl font-semibold text-purple-900">
              {selectedTask?.title}
            </p>
            <p className="text-sm text-purple-600 mt-1">
              Status updated to: <span className="font-bold">In Progress</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FocusCompletionModal;