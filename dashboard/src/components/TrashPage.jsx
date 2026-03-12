import React, { useState, useEffect } from 'react';
import { X, Search, Trash2, AlertTriangle } from 'lucide-react';

const TrashPage = ({ isOpen, onClose, deletedTasks, onEmptyTrash }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [showEmptyTrashModal, setShowEmptyTrashModal] = useState(false);
  const [, setTick] = useState(0); // Force re-render

  // Real-time clock - อัปเดตทุก 1 นาที
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setTick(prev => prev + 1); // Force component to re-render
    }, 60000); // อัปเดตทุก 60 วินาที (1 นาที)

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter tasks by search query
  const filteredTasks = deletedTasks.filter(task => {
    return task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           task.owner.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedTasks(filteredTasks.map(task => task.id));
    } else {
      setSelectedTasks([]);
    }
  };

  const handleSelectTask = (taskId) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleEmptyTrashClick = () => {
    setShowEmptyTrashModal(true);
  };

  const handleConfirmEmptyTrash = () => {
    onEmptyTrash();
    setShowEmptyTrashModal(false);
    setSelectedTasks([]);
  };

  const handleCancelEmptyTrash = () => {
    setShowEmptyTrashModal(false);
  };

  // Real-time date formatting - คำนวณใหม่ทุกครั้งที่ render
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date(); // ใช้เวลาปัจจุบันจริงๆ
    const diffMs = now - date;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    // แสดงเวลาตามจริง
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes === 1) return '1 min ago';
    if (diffMinutes < 60) return `${diffMinutes} mins ago`;
    if (diffHours === 1) return '1 hr ago';
    if (diffHours < 24) return `${diffHours} hrs ago`;
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    }
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return months === 1 ? '1 month ago' : `${months} months ago`;
    }
    const years = Math.floor(diffDays / 365);
    return years === 1 ? '1 year ago' : `${years} years ago`;
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden animate-slideDown flex flex-col">
          {/* Header */}
          <div className="border-b border-gray-200">
            <div className="flex justify-between items-center px-6 py-4">
              <div className="flex items-center gap-3">
                <Trash2 size={24} className="text-gray-700" />
                <h2 className="text-2xl font-bold text-gray-900">Trash</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="px-6 py-6 border-b border-gray-200">
            <div className="flex items-center gap-4 flex-wrap">
              {/* Search */}
              <div className="relative flex-1 min-w-[250px] max-w-xs">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search deleted tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Results Count */}
              {searchQuery && (
                <div className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm">
                  Found {filteredTasks.length} task(s)
                </div>
              )}

              {/* Empty Trash Button */}
              {deletedTasks.length > 0 && (
                <button
                  onClick={handleEmptyTrashClick}
                  className="ml-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Empty Trash
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left w-12">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 cursor-pointer"
                      checked={filteredTasks.length > 0 && selectedTasks.length === filteredTasks.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Deleted from</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Deleted by</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center">
                      <div className="text-gray-400">
                        <Trash2 size={64} className="mx-auto mb-4 opacity-20" />
                        <p className="text-sm font-medium text-gray-500">Trash is empty</p>
                        <p className="text-xs mt-1 text-gray-400">Deleted items will appear here</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
                    <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 cursor-pointer"
                          checked={selectedTasks.includes(task.id)}
                          onChange={() => handleSelectTask(task.id)}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900 font-medium">{task.title}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>Item</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <span>Main Workspace</span>
                          <span className="text-gray-400">›</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span>My Group</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-sm">
                          <span className="text-white text-xs font-bold">{task.icon}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {formatDate(task.deletedAt)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer with info */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                {selectedTasks.length > 0 
                  ? `${selectedTasks.length} of ${filteredTasks.length} selected`
                  : filteredTasks.length > 0
                    ? `${filteredTasks.length} deleted item${filteredTasks.length !== 1 ? 's' : ''}`
                    : 'No items'
                }
              </span>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Empty Trash Confirmation Modal */}
      {showEmptyTrashModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-slideDown">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle size={24} className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Empty Trash</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to permanently delete all <span className="font-semibold">{deletedTasks.length} item{deletedTasks.length !== 1 ? 's' : ''}</span> in trash? This action is irreversible and all items will be removed forever.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleCancelEmptyTrash}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmEmptyTrash}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Empty Trash
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TrashPage;