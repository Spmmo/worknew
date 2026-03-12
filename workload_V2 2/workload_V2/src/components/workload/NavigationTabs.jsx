import React, { useState } from 'react';

const allTabs = [
  { id: 'tasks',       label: 'All Tasks' },
  { id: 'assignments', label: 'Assignments' },
];

const TabBtn = React.forwardRef(({ tab, active, onClick }, ref) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        height: '3rem',
        padding: '0 2rem',
        borderRadius: '1.5rem',
        background: active || hovered ? '#2A7B9B' : '#f1f5f9',
        color: active || hovered ? '#fff' : '#6b7280',
        border: 'none',
        cursor: 'pointer',
        fontSize: 14,
        fontWeight: 400,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        transition: 'background 0.3s, color 0.3s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100%', height: '100%',
        borderRadius: 'inherit',
        background: 'linear-gradient(90deg, rgba(42,123,155,1) 0%, rgba(87,199,133,1) 100%)',
        transform: active || hovered ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: '0 50%',
        transition: 'transform 0.475s',
        zIndex: 0,
      }} />
      <span style={{ position: 'relative', zIndex: 1 }}>{tab.label}</span>
    </button>
  );
});

const NavigationTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div style={{
      background: '#ffffff',
      borderBottom: '1px solid #ebebeb',
      boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      padding: '12px 28px',
      display: 'flex',
      gap: 12,
    }}>
      {allTabs.map(tab => (
        <TabBtn key={tab.id} tab={tab} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} />
      ))}
    </div>
  );
};

export default NavigationTabs;