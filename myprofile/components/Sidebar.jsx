"use client"

// Icon Components
export const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="10" cy="7" r="3"/>
    <path d="M4 18c0-3 2.5-5 6-5s6 2 6 5"/>
  </svg>
);

export const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="10" cy="10" r="8"/>
    <path d="M7 10l2 2 4-4"/>
  </svg>
);

export const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10 2c-2.5 0-4 2-4 4v4l-2 2v1h12v-1l-2-2V6c0-2-1.5-4-4-4z"/>
    <path d="M8.5 17c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5"/>
  </svg>
);

export const KeyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="7" cy="13" r="4"/>
    <path d="M10.5 10.5l6-6M14 7l2-2M16 5l1-1"/>
  </svg>
);

const Sidebar = ({ activeTab, setActiveTab, unreadCount }) => {
  const menuItems = [
    { id: 'personal', icon: UserIcon, label: 'Personal Info' },
    { id: 'status', icon: CheckCircleIcon, label: 'Status' },
    { id: 'notification', icon: BellIcon, label: 'Notification', badge: unreadCount },
    { id: 'password', icon: KeyIcon, label: 'Password' },
  ];

  return (
    <div className="w-64 bg-gray-100 p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${
                activeTab === item.id
                  ? 'bg-cyan-400 text-black'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon />
              <span>{item.label}</span>
              {item.badge > 0 && (
                <span className="absolute right-3 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
