import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Maximize, Minimize, Edit3, Copy, Trash2 } from 'lucide-react';

const ChartCard = ({ 
  title, 
  children, 
  onFullscreen, 
  onRename, 
  onDuplicate, 
  onDelete,
  isFullscreen = false 
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const menuRef = useRef(null);
  const inputRef = useRef(null);

  // อัพเดทชื่อเมื่อ prop title เปลี่ยน
  useEffect(() => {
    setEditedTitle(title);
  }, [title]);

  // Focus input เมื่อเริ่ม edit
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // ปิดเมนูเมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  // จัดการการ rename
  const handleStartRename = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleSaveRename = () => {
    if (editedTitle.trim() && editedTitle !== title) {
      onRename?.(editedTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCancelRename = () => {
    setEditedTitle(title);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveRename();
    } else if (e.key === 'Escape') {
      handleCancelRename();
    }
  };

  // จัดการการลบ
  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setShowMenu(false);
  };

  const handleConfirmDelete = () => {
    onDelete?.();
    setShowDeleteModal(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const menuItems = [
    {
      icon: isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />,
      label: isFullscreen ? 'Exit full screen' : 'Full screen',
      onClick: () => {
        onFullscreen?.();
        setShowMenu(false);
      },
      hidden: !onFullscreen
    },
    {
      icon: <Edit3 size={16} />,
      label: 'Rename',
      onClick: handleStartRename,
      hidden: !onRename
    },
    {
      icon: <Copy size={16} />,
      label: 'Duplicate',
      onClick: () => {
        onDuplicate?.();
        setShowMenu(false);
      },
      hidden: !onDuplicate
    },
    {
      icon: <Trash2 size={16} />,
      label: 'Delete',
      onClick: handleDeleteClick,
      isDangerous: true,
      hidden: !onDelete
    }
  ];

  return (
    <>
      <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md ${
        isFullscreen ? 'fixed inset-4 z-50 overflow-auto' : ''
      }`}>
        <div className="flex justify-between items-center mb-6">
          {/* Title - แก้ไขได้แบบ inline */}
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleSaveRename}
              onKeyDown={handleKeyDown}
              className="text-lg font-semibold text-gray-900 border-b-2 border-blue-500 focus:outline-none bg-transparent px-1"
              style={{ width: `${Math.max(editedTitle.length * 10, 100)}px` }}
            />
          ) : (
            <h3 
              className="text-lg font-semibold text-gray-900 cursor-text hover:text-blue-600 transition-colors"
              onClick={handleStartRename}
              title="Click to edit"
            >
              {title}
            </h3>
          )}
          
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            >
              <MoreVertical size={20} />
            </button>
            
            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden animate-slideDown">
                {menuItems.filter(item => !item.hidden).map((item, index) => (
                  <React.Fragment key={index}>
                    <button
                      onClick={item.onClick}
                      className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left ${
                        item.isDangerous ? 'border-t border-gray-100' : ''
                      }`}
                    >
                      <span className={item.isDangerous ? 'text-red-600' : 'text-gray-600'}>
                        {item.icon}
                      </span>
                      <span className={`text-sm ${item.isDangerous ? 'text-red-600' : 'text-gray-700'}`}>
                        {item.label}
                      </span>
                    </button>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>
        {children}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-slideDown">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 size={24} className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Chart</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete <span className="font-semibold">"{title}"</span>? 
                This chart will be permanently removed.
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

export default ChartCard;