"use client"

import { useState } from 'react';
import { ChevronDown, ChevronUp, X, ChevronRight, ChevronLeft } from 'lucide-react';

const StatusTab = ({ addNotification, status, setStatus, unavailableDates, setUnavailableDates }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCalendar, setShowCalendar] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0, 1));

  const statusOptions = [
    { value: 'offline', label: 'offline' },
    { value: 'online', label: 'online' },
    { value: 'dnd', label: 'Do not disturb' }
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

  const handleStatusChange = (newStatus) => {
    const newStatusLabel = statusOptions.find(s => s.value === newStatus)?.label;
    setStatus(newStatus);
    setShowDropdown(false);
    addNotification('status', `Status changed to "${newStatusLabel}"`);
  };

  const toggleDate = (day) => {
    if (unavailableDates.includes(day)) {
      setUnavailableDates(unavailableDates.filter(d => d !== day));
    } else {
      setUnavailableDates([...unavailableDates, day]);
    }
  };

  const clearAllDates = () => {
    const count = unavailableDates.length;
    setUnavailableDates([]);
    if (count > 0) {
      addNotification('status', `Cleared ${count} unavailable date${count > 1 ? 's' : ''}`);
    }
  };

  const removeDate = (day) => {
    setUnavailableDates(unavailableDates.filter(d => d !== day));
  };

  const changeMonth = (delta) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + delta);
    setCurrentMonth(newDate);
  };

  return (
    <div className="flex-1 p-8">
      <h2 className="text-3xl font-bold mb-2">Working status</h2>
      <p className="text-gray-500 mb-6">Let everyone know your status</p>
      
      <div className="max-w-md space-y-6">
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
          >
            <span>{statusOptions.find(s => s.value === status)?.label}</span>
            {showDropdown ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          
          {showDropdown && (
            <div className="absolute w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStatusChange(option.value)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors ${
                    status === option.value ? 'bg-cyan-100' : ''
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    status === option.value ? 'border-cyan-400' : 'border-gray-300'
                  }`}>
                    {status === option.value && <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>}
                  </span>
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Unavailable Dates</label>
          <button 
            onClick={() => setShowCalendar(!showCalendar)}
            className="w-full border border-gray-300 rounded-lg p-3 bg-cyan-50 hover:bg-cyan-100 transition-colors"
          >
            <div className="flex items-center justify-between">
              {unavailableDates.length > 0 ? (
                <span className="text-gray-700">
                  {unavailableDates.sort((a, b) => a - b).map((day, index) => (
                    <span key={day}>
                      {day} ม.ค.{index < unavailableDates.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </span>
              ) : (
                <span className="text-gray-400">Select dates</span>
              )}
              {showCalendar ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </button>
        </div>

        {showCalendar && (
          <div className="bg-gray-100 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={() => changeMonth(-1)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg">
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <ChevronDown size={20} />
              </div>
              <button 
                onClick={() => changeMonth(1)}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center mb-4">
              {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
                <div key={day} className="text-sm font-medium text-gray-600 py-2">{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2 text-center mb-6">
              {Array.from({ length: startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1 }, (_, i) => (
                <div key={`empty-${i}`} className="h-12 flex items-center justify-center text-gray-400">
                  {new Date(currentMonth.getFullYear(), currentMonth.getMonth(), -startingDayOfWeek + i + 2).getDate()}
                </div>
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const isSelected = unavailableDates.includes(day);
                return (
                  <button
                    key={day}
                    onClick={() => toggleDate(day)}
                    className={`h-12 flex items-center justify-center rounded-2xl transition-all font-medium ${
                      isSelected
                        ? 'bg-cyan-400 text-black shadow-md scale-105'
                        : 'hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
              {Array.from({ length: 7 - ((startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1) + daysInMonth) % 7 }, (_, i) => {
                if (((startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1) + daysInMonth) % 7 === 0) return null;
                return (
                  <div key={`next-${i}`} className="h-12 flex items-center justify-center text-gray-400">
                    {i + 1}
                  </div>
                );
              })}
            </div>

            {unavailableDates.length > 0 && (
              <div className="border-t border-gray-300 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-base font-medium text-gray-900">Unavailable dates ({unavailableDates.length})</span>
                  <button 
                    onClick={clearAllDates}
                    className="text-red-500 text-sm font-medium hover:text-red-600 transition-colors"
                  >
                    Clear all
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {unavailableDates.sort((a, b) => a - b).map((day) => (
                    <span 
                      key={day}
                      className="bg-cyan-100 text-cyan-900 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2"
                    >
                      {day} ม.ค. 2569
                      <X 
                        size={16} 
                        className="cursor-pointer hover:text-cyan-950 transition-colors" 
                        onClick={() => removeDate(day)}
                      />
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusTab;
