import React, { useState } from 'react';
import { X, Trash2, CheckCircle, Clock, Circle, AlertTriangle } from 'lucide-react';

const TaskModal = ({ 
  isOpen, 
  onClose, 
  tasks, 
  status, 
  onDeleteTask,
  onChangeStatus 
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  if (!isOpen) return null;

  const statusConfig = {
    'all': { title: 'All Tasks', color: 'blue' },
    'in-progress': { title: 'In Progress', color: 'orange' },
    'not-started': { title: 'Not Started', color: 'red' },
    'done': { title: 'Done', color: 'green' }
  };

  const config = statusConfig[status] || statusConfig['all'];

  const getStatusIcon = (taskStatus) => {
    switch(taskStatus) {
      case 'done': return <CheckCircle size={16} className="text-green-600" />;
      case 'in-progress': return <Clock size={16} className="text-orange-600" />;
      case 'not-started': return <Circle size={16} className="text-red-600" />;
      default: return <Circle size={16} className="text-gray-600" />;
    }
  };

  const getStatusBadge = (taskStatus) => {
    const badges = {
      'done': 'bg-green-100 text-green-700',
      'in-progress': 'bg-orange-100 text-orange-700',
      'not-started': 'bg-red-100 text-red-700'
    };
    return badges[taskStatus] || 'bg-gray-100 text-gray-700';
  };

  const handleDeleteClick = (task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      onDeleteTask(taskToDelete.id);
      setShowDeleteModal(false);
      setTaskToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col animate-slideDown">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{config.title}</h2>
                <p className="text-sm text-gray-500 mt-1">{tasks.length} task(s)</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Task List */}
          <div className="flex-1 overflow-y-auto p-6">
            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-2">
                  <Circle size={48} className="mx-auto opacity-20" />
                </div>
                <p className="text-gray-500">No tasks found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(task.status)}
                          <h3 className="font-medium text-gray-900">{task.title}</h3>
                        </div>
                        
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <span className="text-gray-400">Owner:</span>
                            <span>{task.owner}</span>
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(task.status)}`}>
                            {task.status.replace('-', ' ')}
                          </span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        {/* Change status button */}
                        <button
                          onClick={() => {
                            const nextStatus = 
                              task.status === 'not-started' ? 'in-progress' :
                              task.status === 'in-progress' ? 'done' : 'not-started';
                            onChangeStatus(task.id, nextStatus);
                          }}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                            task.status === 'not-started' ? 'bg-red-100 text-red-700 hover:bg-red-200' :
                            task.status === 'in-progress' ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' :
                            'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                          title="Change status"
                        >
                          Mark as {
                            task.status === 'not-started' ? 'In Progress' :
                            task.status === 'in-progress' ? 'Done' : 'Not Started'
                          }
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteClick(task)}
                          className="p-2 hover:bg-red-100 rounded transition-colors"
                          title="Delete task"
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && taskToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-slideDown">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle size={24} className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Task</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete <span className="font-semibold">"{taskToDelete.title}"</span>? This task will be moved to trash.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleCancelDelete}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskModal;