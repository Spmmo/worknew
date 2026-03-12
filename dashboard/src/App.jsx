import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Plus, Search, Settings, MoreVertical, X, User, Trash2, Archive, Users, LogOut, Eye, Timer } from 'lucide-react';
import StatusCard from './components/StatusCard';
import PieChart from './components/PieChart';
import Legend from './components/Legend';
import BarChart from './components/BarChart';
import ChartCard from './components/ChartCard';
import TaskModal from './components/TaskModal';
import FocusSetupModal from './components/FocusSetupModal';
import FocusTimer from './components/FocusTimer';
import FocusCompletionModal from './components/FocusCompletionModal';
import ArchivePage from './components/ArchivePage';
import TrashPage from './components/TrashPage';
import logoImage from './assets/01.png';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [workingStatus, setWorkingStatus] = useState('on');
  const menuRef = useRef(null);
  
  // State สำหรับ modal
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  
  // State สำหรับจัดการ tasks - เริ่มต้นเป็น 0
  const [tasks, setTasks] = useState([]);
  
  // State สำหรับ Archive และ Trash
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [deletedTasks, setDeletedTasks] = useState([]);
  const [showArchivePage, setShowArchivePage] = useState(false);
  const [showTrashPage, setShowTrashPage] = useState(false);

  // State สำหรับ Focus Mode
  const [showFocusMode, setShowFocusMode] = useState(false);
  const [focusTime, setFocusTime] = useState(0); // เวลาที่เหลือ (วินาที)
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [targetDate, setTargetDate] = useState('');
  const [targetTime, setTargetTime] = useState('30'); // เริ่มต้นที่ 30 นาที
  const [initialFocusTime, setInitialFocusTime] = useState(0); // เก็บเวลาเริ่มต้นสำหรับ reset
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const timerRef = useRef(null);

  // State สำหรับจัดการ Charts
  const [charts, setCharts] = useState([
    { id: 'status', title: 'Tasks by status', type: 'pie', visible: true, isFullscreen: false },
    { id: 'owner', title: 'Tasks by owner', type: 'bar', visible: true, isFullscreen: false }
  ]);

  // State สำหรับ Clear All Tasks modal
  const [showClearAllModal, setShowClearAllModal] = useState(false);

  // อัพเดท icon ให้กับ tasks เก่าที่ไม่มี icon
  useEffect(() => {
    const ownerIconMap = {
      'John Doe': 'JD',
      'Jane Smith': 'JS',
      'Alex Johnson': 'AJ',
      'Emily Davis': 'ED',
      'Michael Brown': 'MB'
    };

    const hasTaskWithoutIcon = tasks.some(task => !task.icon);
    if (hasTaskWithoutIcon) {
      const updatedTasks = tasks.map(task => ({
        ...task,
        icon: task.icon || ownerIconMap[task.owner] || task.owner.split(' ').map(n => n[0]).join('')
      }));
      setTasks(updatedTasks);
    }
  }, []); // run only once on mount

  // ปิด dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  // Timer countdown effect
  useEffect(() => {
    if (isRunning && focusTime > 0) {
      timerRef.current = setInterval(() => {
        setFocusTime((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setShowCompletionModal(true);
            // เล่นเสียงหรือแจ้งเตือนเมื่อหมดเวลา
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Focus Time Complete!', {
                body: `Great job completing: ${selectedTask?.title || 'your task'}!`,
                icon: '⏰'
              });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, focusTime, selectedTask]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // ฟังก์ชันสำหรับ Focus Mode
  const handleStartFocus = () => {
    if (!selectedTask) {
      alert('Please select a task to focus on!');
      return;
    }
    if (!targetDate && !targetTime) {
      alert('Please select a target time!');
      return;
    }

    let seconds = 0;
    
    if (targetDate) {
      // ใช้ target date
      const now = new Date();
      const target = new Date(targetDate);
      seconds = Math.floor((target - now) / 1000);
    } else {
      // ใช้ target time (นาที)
      seconds = parseInt(targetTime) * 60;
    }

    if (seconds <= 0) {
      alert('Target time must be in the future!');
      return;
    }

    setFocusTime(seconds);
    setInitialFocusTime(seconds); // เก็บเวลาเริ่มต้นไว้สำหรับ reset
    setIsRunning(true);
    setShowFocusMode(false);
  };

  const handlePauseResume = () => {
    setIsRunning(!isRunning);
  };

  const handleStopFocus = () => {
    setIsRunning(false);
    setFocusTime(0);
    setSelectedTask(null);
    setTargetDate('');
    setTargetTime('30');
  };

  const formatTimeDisplay = (seconds) => {
    if (seconds <= 0) return '00:00:00';
    
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const mins = Math.floor((seconds % (60 * 60)) / 60);
    const secs = seconds % 60;

    if (days > 0) {
      return `${days}d ${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // คำนวณข้อมูลจาก tasks จริง
  const statusCounts = useMemo(() => {
    const counts = {
      all: tasks.length,
      'in-progress': tasks.filter(t => t.status === 'in-progress').length,
      'not-started': tasks.filter(t => t.status === 'not-started').length,
      done: tasks.filter(t => t.status === 'done').length,
    };
    return counts;
  }, [tasks]);

  // คำนวณเปอร์เซ็นต์จากข้อมูลจริง
  const pieChartData = useMemo(() => {
    const total = tasks.length || 1;
    return [
      { 
        label: 'Working on it', 
        value: statusCounts['in-progress'], 
        color: '#ffc570', 
        percentage: total > 0 ? ((statusCounts['in-progress'] / total) * 100).toFixed(1) : 0
      },
      { 
        label: 'Done', 
        value: statusCounts.done, 
        color: '#70e0a4', 
        percentage: total > 0 ? ((statusCounts.done / total) * 100).toFixed(1) : 0
      },
      { 
        label: 'Not started', 
        value: statusCounts['not-started'], 
        color: '#ff7373', 
        percentage: total > 0 ? ((statusCounts['not-started'] / total) * 100).toFixed(1) : 0
      }
    ];
  }, [tasks, statusCounts]);

  // คำนวณข้อมูล owner
  const barChartData = useMemo(() => {
    const ownerData = {};
    tasks.forEach(task => {
      if (!ownerData[task.owner]) {
        ownerData[task.owner] = {
          count: 0,
          icon: task.icon || '👤' // ใช้ icon จาก task หรือ default
        };
      }
      ownerData[task.owner].count += 1;
    });
    
    return Object.entries(ownerData).map(([owner, data]) => ({
      label: owner,
      value: data.count,
      icon: data.icon
    }));
  }, [tasks]);

  // ข้อมูล status cards
  const statusData = [
    { title: 'All Tasks', count: statusCounts.all, color: '#a8c8ff', icon: <div className="text-[120px]">📋</div> },
    { title: 'In progress', count: statusCounts['in-progress'], color: '#ffc570', icon: <div className="text-[120px]">⏳</div> },
    { title: 'Not started', count: statusCounts['not-started'], color: '#ff7373', icon: <div className="text-[120px]">🔴</div> },
    { title: 'Done', count: statusCounts.done, color: '#70e0a4', icon: <div className="text-[120px]">✅</div> }
  ];

  // ฟังก์ชันกรองข้อมูล
  const filteredTasks = useMemo(() => {
    if (!searchQuery) return tasks;
    return tasks.filter(task => 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.owner.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tasks, searchQuery]);

  // รายการงานที่สามารถเลือกได้ (In Progress และ Not Started)
  const availableTasks = useMemo(() => {
    return tasks.filter(task => task.status === 'in-progress' || task.status === 'not-started');
  }, [tasks]);

  // ฟังก์ชันเพิ่ม task
  const addNewTask = () => {
    const ownerData = [
      { name: 'John Doe', icon: 'JD' },
      { name: 'Jane Smith', icon: 'JS' },
      { name: 'Alex Johnson', icon: 'AJ' },
      { name: 'Emily Davis', icon: 'ED' },
      { name: 'Michael Brown', icon: 'MB' }
    ];
    const randomOwnerData = ownerData[Math.floor(Math.random() * ownerData.length)];
    
    const newTask = {
      id: Date.now(),
      title: `New Task ${tasks.length + 1}`,
      status: 'not-started',
      owner: randomOwnerData.name,
      icon: randomOwnerData.icon
    };
    setTasks([...tasks, newTask]);
  };

  // ฟังก์ชันดูรายละเอียด tasks ทั้งหมด
  const handleViewAllDetails = () => {
    setSelectedStatus('all');
    setShowTaskModal(true);
  };

  // ฟังก์ชันเคลียร์ tasks ทั้งหมด
  const handleClearAllTasks = () => {
    setShowClearAllModal(true);
  };

  const handleConfirmClearAll = () => {
    // ย้ายทุก task ไป trash
    const now = new Date().toISOString();
    const tasksToDelete = tasks.map(task => ({
      ...task,
      deletedAt: now
    }));
    setDeletedTasks([...deletedTasks, ...tasksToDelete]);
    setTasks([]);
    setShowClearAllModal(false);
  };

  const handleCancelClearAll = () => {
    setShowClearAllModal(false);
  };

  // ฟังก์ชันลบ task เดียว - ย้ายไป Trash แทนการลบถาวร
  const handleDeleteTask = (taskId) => {
    const taskToDelete = tasks.find(task => task.id === taskId);
    if (taskToDelete) {
      setDeletedTasks([...deletedTasks, { ...taskToDelete, deletedAt: new Date().toISOString() }]);
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  // ฟังก์ชัน Archive task
  const handleArchiveTask = (taskId) => {
    const taskToArchive = tasks.find(task => task.id === taskId);
    if (taskToArchive) {
      setArchivedTasks([...archivedTasks, { ...taskToArchive, archivedAt: new Date().toISOString() }]);
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  // ฟังก์ชัน Restore task จาก Archive
  const handleRestoreFromArchive = (taskId) => {
    const taskToRestore = archivedTasks.find(task => task.id === taskId);
    if (taskToRestore) {
      const { archivedAt, ...restoredTask } = taskToRestore;
      setTasks([...tasks, restoredTask]);
      setArchivedTasks(archivedTasks.filter(task => task.id !== taskId));
    }
  };

  // ฟังก์ชัน Restore task จาก Trash
  const handleRestoreFromTrash = (taskId) => {
    const taskToRestore = deletedTasks.find(task => task.id === taskId);
    if (taskToRestore) {
      const { deletedAt, ...restoredTask } = taskToRestore;
      setTasks([...tasks, restoredTask]);
      setDeletedTasks(deletedTasks.filter(task => task.id !== taskId));
    }
  };

  // ฟังก์ชันลบถาวรจาก Archive
  const handleDeletePermanentlyFromArchive = (taskId) => {
    setArchivedTasks(archivedTasks.filter(task => task.id !== taskId));
  };

  // ฟังก์ชันลบถาวรจาก Trash
  const handleDeletePermanentlyFromTrash = (taskId) => {
    setDeletedTasks(deletedTasks.filter(task => task.id !== taskId));
  };

  // ฟังก์ชัน Empty Trash
  const handleEmptyTrash = () => {
    setDeletedTasks([]);
  };

  // ฟังก์ชันเปลี่ยน status ของ task
  const handleChangeStatus = (taskId, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  // กรอง tasks ตาม status ที่เลือก
  const getFilteredTasks = () => {
    if (selectedStatus === 'all') return tasks;
    return tasks.filter(task => task.status === selectedStatus);
  };

  // ฟังก์ชันรีเซ็ต Focus Time
  const handleResetFocusTime = () => {
    setIsRunning(false);
    setFocusTime(initialFocusTime); // reset กลับไปเวลาเริ่มต้น
  };

  // ฟังก์ชันปิด Completion Modal
  const handleCloseCompletionModal = () => {
    setShowCompletionModal(false);
    setSelectedTask(null);
    setTargetDate('');
    setTargetTime('30');
  };

  // ฟังก์ชันสำหรับจัดการ Charts
  const handleChartFullscreen = (chartId) => {
    setCharts(charts.map(chart => 
      chart.id === chartId 
        ? { ...chart, isFullscreen: !chart.isFullscreen }
        : chart
    ));
  };

  const handleChartRename = (chartId, newName) => {
    setCharts(charts.map(c => 
      c.id === chartId 
        ? { ...c, title: newName }
        : c
    ));
  };

  const handleChartDuplicate = (chartId) => {
    const chart = charts.find(c => c.id === chartId);
    if (chart) {
      const newChart = {
        ...chart,
        id: `${chart.id}_${Date.now()}`,
        title: `${chart.title} (Copy)`,
        isFullscreen: false
      };
      setCharts([...charts, newChart]);
    }
  };

  const handleChartDelete = (chartId) => {
    setCharts(charts.filter(c => c.id !== chartId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gray-900 text-white px-8 py-4">
        <h1 className="text-xl font-light tracking-wide">Dashboard</h1>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Dashboard and reporting</h2>
            <div className="flex items-center gap-3 relative">
              {/* Settings Menu Button */}
              <div className="relative" ref={menuRef}>
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Settings"
                >
                  <Settings size={20} className="text-gray-600" />
                </button>
                
                {/* Settings Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-slideDown">
                    {/* Team Info */}
                    <div className="p-4 border-b border-gray-200 flex items-center gap-3 bg-gradient-to-r from-blue-50 to-white">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden">
                        <img 
                          src={logoImage} 
                          alt="Team Logo" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Tham Kap phuean's Team</h3>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left">
                        <User size={18} className="text-gray-600" />
                        <span className="text-gray-700">My profile</span>
                      </button>
                      
                      <button 
                        onClick={() => {
                          setShowTrashPage(true);
                          setShowProfileMenu(false);
                        }}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                      >
                        <Trash2 size={18} className="text-gray-600" />
                        <span className="text-gray-700">Trash</span>
                        {deletedTasks.length > 0 && (
                          <span className="ml-auto text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                            {deletedTasks.length}
                          </span>
                        )}
                      </button>
                      
                      <button 
                        onClick={() => {
                          setShowArchivePage(true);
                          setShowProfileMenu(false);
                        }}
                        className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                      >
                        <Archive size={18} className="text-gray-600" />
                        <span className="text-gray-700">Archive</span>
                        {archivedTasks.length > 0 && (
                          <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                            {archivedTasks.length}
                          </span>
                        )}
                      </button>
                      
                      <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left">
                        <Users size={18} className="text-gray-600" />
                        <span className="text-gray-700">Teams</span>
                      </button>
                      
                      <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left">
                        <LogOut size={18} className="text-gray-600" />
                        <span className="text-gray-700">Log out</span>
                      </button>
                    </div>

                    {/* Working Status */}
                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                      <p className="text-sm font-medium text-gray-700 mb-3">Working status</p>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="status"
                            value="do-not-disturb"
                            checked={workingStatus === 'do-not-disturb'}
                            onChange={(e) => setWorkingStatus(e.target.value)}
                          />
                          <span className="text-sm text-gray-700">Do not disturb</span>
                        </label>
                        
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="status"
                            value="on"
                            checked={workingStatus === 'on'}
                            onChange={(e) => setWorkingStatus(e.target.value)}
                          />
                          <span className="text-sm text-gray-700">On</span>
                        </label>
                        
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="status"
                            value="off"
                            checked={workingStatus === 'off'}
                            onChange={(e) => setWorkingStatus(e.target.value)}
                          />
                          <span className="text-sm text-gray-700">Off</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* จุดสามจุด - เพิ่มเมนูดูรายละเอียดและเคลียร์งาน */}
              <div className="relative">
                <button 
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
                  onClick={(e) => {
                    e.currentTarget.nextElementSibling.classList.toggle('hidden');
                  }}
                >
                  <MoreVertical size={20} className="text-gray-600" />
                </button>
                
                {/* Dropdown Menu สำหรับจุดสามจุด */}
                <div className="hidden absolute right-0 top-12 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden animate-slideDown">
                  <button
                    onClick={(e) => {
                      e.currentTarget.parentElement.classList.add('hidden');
                      handleViewAllDetails();
                    }}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <Eye size={16} className="text-gray-600" />
                    <span className="text-sm text-gray-700">View all details</span>
                  </button>
                  
                  {tasks.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.currentTarget.parentElement.classList.add('hidden');
                        handleClearAllTasks();
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50 transition-colors text-left border-t border-gray-100"
                    >
                      <Trash2 size={16} className="text-red-600" />
                      <span className="text-sm text-red-600">Clear all tasks</span>
                    </button>
                  )}
                </div>
              </div>
              
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* Focus Timer Display Component */}
          <FocusTimer
            focusTime={focusTime}
            isRunning={isRunning}
            selectedTask={selectedTask}
            targetDate={targetDate}
            formatTimeDisplay={formatTimeDisplay}
            onPauseResume={handlePauseResume}
            onReset={handleResetFocusTime}
            onStop={handleStopFocus}
          />

          {/* Action Bar */}
          <div className="flex gap-4 mb-8">
            <button 
              onClick={() => setShowFocusMode(true)}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Timer size={18} />
              Focus Mode
            </button>
            
            {/* ปุ่ม Add Task ใหม่ */}
            <button 
              onClick={addNewTask}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
            >
              <Plus size={18} />
              Add Task
            </button>
            
            <div className="relative flex-1 max-w-xs">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Type to filter"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            {searchQuery && (
              <div className="flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm">
                <span>Found {filteredTasks.length} task(s)</span>
              </div>
            )}
          </div>

          {/* Status Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statusData.map((item, index) => (
              <StatusCard key={index} {...item} />
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {charts.filter(chart => chart.visible).map(chart => (
              <ChartCard 
                key={chart.id}
                title={chart.title}
                isFullscreen={chart.isFullscreen}
                onFullscreen={() => handleChartFullscreen(chart.id)}
                onRename={(newName) => handleChartRename(chart.id, newName)}
                onDuplicate={() => handleChartDuplicate(chart.id)}
                onDelete={() => handleChartDelete(chart.id)}
              >
                {chart.type === 'pie' ? (
                  <div className="flex flex-col lg:flex-row items-center gap-8">
                    <div className="w-full lg:w-1/2">
                      <PieChart data={pieChartData} />
                    </div>
                    <div className="w-full lg:w-1/2">
                      <Legend data={pieChartData} />
                    </div>
                  </div>
                ) : (
                  <BarChart data={barChartData} />
                )}
              </ChartCard>
            ))}
          </div>
        </div>
      </div>

      {/* Focus Mode Setup Modal Component */}
      <FocusSetupModal
        isOpen={showFocusMode}
        onClose={() => setShowFocusMode(false)}
        availableTasks={availableTasks}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
        targetDate={targetDate}
        setTargetDate={setTargetDate}
        targetTime={targetTime}
        setTargetTime={setTargetTime}
        onStartFocus={handleStartFocus}
        onAddNewTask={addNewTask}
        formatTimeDisplay={formatTimeDisplay}
      />

      {/* Completion Modal Component */}
      <FocusCompletionModal
        isOpen={showCompletionModal}
        onClose={handleCloseCompletionModal}
        selectedTask={selectedTask}
      />

      {/* Task Modal */}
      <TaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        tasks={getFilteredTasks()}
        status={selectedStatus}
        onDeleteTask={handleDeleteTask}
        onArchiveTask={handleArchiveTask}
        onChangeStatus={handleChangeStatus}
      />

      {/* Archive Page */}
      <ArchivePage
        isOpen={showArchivePage}
        onClose={() => setShowArchivePage(false)}
        archivedTasks={archivedTasks}
        onRestoreTask={handleRestoreFromArchive}
        onDeletePermanently={handleDeletePermanentlyFromArchive}
      />

      {/* Trash Page */}
      <TrashPage
        isOpen={showTrashPage}
        onClose={() => setShowTrashPage(false)}
        deletedTasks={deletedTasks}
        onRestoreTask={handleRestoreFromTrash}
        onDeletePermanently={handleDeletePermanentlyFromTrash}
        onEmptyTrash={handleEmptyTrash}
      />

      {/* Clear All Tasks Confirmation Modal */}
      {showClearAllModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-slideDown">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Clear All Tasks</h3>
                  <p className="text-sm text-gray-500">Tasks will be moved to Trash</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to move all tasks to Trash? You currently have <span className="font-semibold">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</span>. You can restore them from Trash later.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleCancelClearAll}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmClearAll}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Move to Trash
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;