"use client"

import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import PersonalInfo from './PersonalInfo';
import StatusTab from './StatusTab';
import NotificationTab from './NotificationTab';

// Password Component
const PasswordTab = ({ addNotification }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    if (newPassword && newPassword === confirmPassword) {
      setShowSuccess(true);
      addNotification('password', 'Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleReset = () => {
    addNotification('password', 'Password reset link sent to your email');
  };

  return (
    <div className="flex-1 p-8">
      <h2 className="text-3xl font-bold mb-8">Password</h2>
      
      {showSuccess && (
        <div className="max-w-xl mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          Password updated successfully!
        </div>
      )}
      
      <div className="max-w-xl space-y-6">
        <div>
          <label className="block font-semibold mb-2">Current password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <div className="mt-2">
            <p className="text-sm text-gray-600">Forgot your password?</p>
            <button 
              onClick={handleReset}
              className="text-cyan-400 text-sm hover:text-cyan-500 transition-colors"
            >
              Reset password via email
            </button>
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-2">New password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Confirm new password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          {confirmPassword && newPassword !== confirmPassword && (
            <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
          )}
        </div>

        <button 
          onClick={handleSave}
          disabled={!currentPassword || !newPassword || newPassword !== confirmPassword}
          className="w-full bg-cyan-400 text-black font-semibold py-3 rounded-lg hover:bg-cyan-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Save
        </button>
      </div>
    </div>
  );
};

// Main App Component
const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [notifications, setNotifications] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [muteEndTime, setMuteEndTime] = useState(null);
  const [status, setStatus] = useState('online');
  const [profileData, setProfileData] = useState({
    name: 'Tommy',
    title: 'Add Title',
    email: 'yourname@gmail.com',
    phone: '080 999 9999',
    birthday: '22 Oct 2004',
    location: 'Thailand, Bangkok'
  });
  const [unavailableDates, setUnavailableDates] = useState([]);

  // Check if mute has expired
  useEffect(() => {
    if (isMuted && muteEndTime) {
      const checkInterval = setInterval(() => {
        if (new Date() >= muteEndTime) {
          setIsMuted(false);
          setMuteEndTime(null);
        }
      }, 1000);
      
      return () => clearInterval(checkInterval);
    }
  }, [isMuted, muteEndTime]);

  const handleMute = () => {
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + 1);
    setIsMuted(true);
    setMuteEndTime(endTime);
  };

  const handleUnmute = () => {
    setIsMuted(false);
    setMuteEndTime(null);
  };

  const addNotification = (type, message) => {
    // Don't add notification if muted
    if (isMuted && type !== 'notification') {
      return;
    }
    
    const newNotification = {
      id: Date.now(),
      type,
      message,
      timestamp: new Date().toLocaleString('th-TH', { 
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} unreadCount={unreadCount} />
      {activeTab === 'personal' && (
        <PersonalInfo 
          addNotification={addNotification} 
          status={status} 
          profileData={profileData}
          setProfileData={setProfileData}
        />
      )}
      {activeTab === 'status' && (
        <StatusTab 
          addNotification={addNotification} 
          status={status} 
          setStatus={setStatus}
          unavailableDates={unavailableDates}
          setUnavailableDates={setUnavailableDates}
        />
      )}
      {activeTab === 'notification' && (
        <NotificationTab 
          notifications={notifications} 
          setNotifications={setNotifications}
          isMuted={isMuted}
          muteEndTime={muteEndTime}
          handleMute={handleMute}
          handleUnmute={handleUnmute}
        />
      )}
      {activeTab === 'password' && <PasswordTab addNotification={addNotification} />}
    </div>
  );
};

export default ProfilePage;
