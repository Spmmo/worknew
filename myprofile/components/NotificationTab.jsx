"use client"

import { useState } from 'react';
import { X, Settings, MoreHorizontal, Search, Mail, Phone } from 'lucide-react';
import { UserIcon, CheckCircleIcon, BellIcon, KeyIcon } from './Sidebar';

const NotificationTab = ({ notifications, setNotifications, isMuted, muteEndTime, handleMute, handleUnmute }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const getRemainingMuteTime = () => {
    if (!muteEndTime) return '';
    const now = new Date();
    const diff = muteEndTime - now;
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'profile':
        return <UserIcon />;
      case 'status':
        return <CheckCircleIcon />;
      case 'password':
        return <KeyIcon />;
      default:
        return <BellIcon />;
    }
  };

  const getNotificationColor = (type) => {
    switch(type) {
      case 'profile':
        return 'bg-blue-50 border-blue-200';
      case 'status':
        return 'bg-green-50 border-green-200';
      case 'password':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (unreadOnly && notif.read) return false;
    if (searchQuery && !notif.message.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setShowMoreMenu(false);
  };

  const clearUnread = () => {
    setNotifications(notifications.filter(n => n.read));
    setShowMoreMenu(false);
  };

  const clearAll = () => {
    setNotifications([]);
    setShowMoreMenu(false);
  };

  const deleteReadNotifications = () => {
    setNotifications(notifications.filter(n => !n.read));
    setShowMoreMenu(false);
  };

  const MutedBadge = () => (
    <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 px-4 py-2 rounded-xl shadow-sm flex items-center gap-3">
      <div className="bg-orange-100 p-1.5 rounded-lg">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="text-orange-600">
          <path d="M10 2c-2.5 0-4 2-4 4v4l-2 2v1h12v-1l-2-2V6c0-2-1.5-4-4-4z"/>
          <path d="M8.5 17c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5"/>
          <line x1="2" y1="2" x2="18" y2="18" strokeLinecap="round"/>
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="text-orange-800 font-semibold text-sm">Notifications Muted</span>
        <span className="text-orange-600 text-xs font-medium">{getRemainingMuteTime()} remaining</span>
      </div>
    </div>
  );

  const SettingsMenu = () => (
    <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-20">
      <div className="p-2">
        <button className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-3">
          <Mail size={20} />
          <span>Email notifications</span>
        </button>
        <button className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-3">
          <Phone size={20} />
          <span>Push notifications</span>
        </button>
        <div className="border-t my-2"></div>
        {isMuted ? (
          <button 
            onClick={handleUnmute}
            className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-orange-600 font-medium flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 2c-2.5 0-4 2-4 4v4l-2 2v1h12v-1l-2-2V6c0-2-1.5-4-4-4z"/>
                  <path d="M8.5 17c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5"/>
                  <line x1="2" y1="2" x2="18" y2="18" strokeLinecap="round"/>
                </svg>
                Muted
              </span>
              <span className="text-sm text-gray-500">{getRemainingMuteTime()}</span>
            </div>
            <span className="text-xs text-gray-500">Click to unmute</span>
          </button>
        ) : (
          <button 
            onClick={handleMute}
            className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Mute for 1 hour
          </button>
        )}
      </div>
    </div>
  );

  const Header = ({ title }) => (
    <div className="p-6 border-b flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h2 className="text-3xl font-bold">{title}</h2>
        {isMuted && <MutedBadge />}
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <button 
            onClick={() => {
              setShowSettingsMenu(!showSettingsMenu);
              setShowMoreMenu(false);
            }}
            className="hover:bg-gray-100 p-2 rounded transition-colors"
          >
            <Settings size={24} className="text-gray-600" />
          </button>
          {showSettingsMenu && <SettingsMenu />}
        </div>
        
        <div className="relative">
          <button 
            onClick={() => {
              setShowMoreMenu(!showMoreMenu);
              setShowSettingsMenu(false);
            }}
            className="hover:bg-gray-100 p-2 rounded transition-colors"
          >
            <MoreHorizontal size={24} className="text-gray-600" />
          </button>
          
          {showMoreMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-300 rounded-lg shadow-lg z-20">
              <div className="p-2">
                <button 
                  onClick={markAllAsRead}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                >
                  Mark all as read
                </button>
                <button 
                  onClick={clearUnread}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Clear unread
                </button>
                <div className="border-t my-2"></div>
                <button 
                  onClick={clearAll}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors text-red-600"
                >
                  Clear all notifications
                </button>
                <button 
                  onClick={deleteReadNotifications}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 rounded-lg transition-colors text-red-600"
                >
                  Delete read notifications
                </button>
              </div>
            </div>
          )}
        </div>
        
        <button className="hover:bg-gray-100 p-2 rounded transition-colors">
          <X size={24} className="text-gray-600" />
        </button>
      </div>
    </div>
  );

  const TabBar = () => (
    <div className="border-b">
      <div className="flex gap-8 px-6">
        {['All', 'Mentioned', 'Teams'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab.toLowerCase())}
            className={`py-4 font-medium transition-colors ${
              activeFilter === tab.toLowerCase()
                ? 'border-b-2 border-black'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );

  const SearchBar = () => (
    <div className="flex items-center justify-between mb-6 gap-4">
      <div className="flex-1 flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-2">
        <Search size={20} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search notifications by people and boards"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 outline-none"
        />
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setUnreadOnly(!unreadOnly)}
          className={`w-12 h-6 rounded-full relative transition-colors ${
            unreadOnly ? 'bg-cyan-400' : 'bg-gray-300'
          }`}
        >
          <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
            unreadOnly ? 'translate-x-6' : 'translate-x-0.5'
          }`}></div>
        </button>
        <span className="text-sm whitespace-nowrap">Unread only</span>
      </div>
    </div>
  );

  if (activeFilter === 'teams') {
    return (
      <div className="flex-1 p-8">
        <div className="bg-white rounded-2xl shadow-sm max-w-4xl">
          <Header title="Notifications" />
          <TabBar />
          <div className="p-6">
            <SearchBar />
            <h3 className="text-xl font-bold mb-4">My Teams</h3>
            <div className="text-center py-12 text-gray-500">
              No team notifications yet. Team activities and updates will appear here.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeFilter === 'mentioned') {
    return (
      <div className="flex-1 p-8">
        <div className="bg-white rounded-2xl shadow-sm max-w-4xl">
          <Header title="Notifications" />
          <TabBar />
          <div className="p-6">
            <SearchBar />
            <h3 className="text-xl font-bold mb-4">Mentions</h3>
            <div className="text-center py-12 text-gray-500">
              No mentions yet. When someone mentions you, it will appear here.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      <div className="bg-white rounded-2xl shadow-sm max-w-4xl">
        <Header title="Notifications" />
        <TabBar />
        <div className="p-6">
          <SearchBar />
          <h3 className="text-xl font-bold mb-4">Today</h3>
          
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No notifications yet. Actions like editing your profile, changing status, or updating your password will appear here.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-lg border ${getNotificationColor(notif.type)} ${
                    notif.read ? 'opacity-60' : ''
                  } transition-all`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1 text-gray-600">
                        {getNotificationIcon(notif.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold capitalize">{notif.type}</span>
                          {!notif.read && (
                            <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-gray-700">{notif.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{notif.timestamp}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notif.read && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          className="text-xs text-cyan-500 hover:text-cyan-600 whitespace-nowrap"
                        >
                          Mark read
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notif.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationTab;
