import React from 'react'
import { Bell, UserPlus, Search, User } from 'lucide-react'
import { useRole } from '../../App'

const styles = {
  navbar: {
    background: '#ffffff',
    padding: '10px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #e8eaf6',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  icons: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    color: '#7c8fff',
  },
  icon: { cursor: 'pointer', opacity: 0.8 },
  divider: { width: '1px', height: '24px', background: '#e0e0e0' },
  account: {
    display: 'flex', alignItems: 'center', gap: '8px',
    color: '#555', fontSize: '14px', cursor: 'pointer', fontWeight: '500',
  },
  accountIcon: {
    width: '34px', height: '34px', borderRadius: '50%',
    background: '#f0f1ff', display: 'flex', alignItems: 'center',
    justifyContent: 'center', border: '2px solid #c5caff',
  },
}

export default function Navbar() {
  const { role } = useRole()

  const badgeStyle = {
    borderRadius: '20px',
    padding: '3px 12px',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '1px',
    transition: 'all 0.3s',
    ...(role === 'admin'
      ? {
          background: 'transparent',
          border: '2px solid #f59e0b',
          color: '#f59e0b',
        }
      : {
          background: 'transparent',
          border: '2px solid #8b5cf6',
          color: '#8b5cf6',
        }),
  }

  return (
    <nav style={styles.navbar}>
      <div style={styles.logoContainer}>
        <img
          src="/02.png"
          alt="ThamKap Phuean"
          style={{ height: '44px', width: 'auto', objectFit: 'contain' }}
        />
        <span style={badgeStyle}>
          {role === 'admin' ? '👑 LEADER DASHBOARD' : '👤 MEMBER VIEW'}
        </span>
      </div>
      <div style={styles.icons}>
        <Bell size={20} style={styles.icon} />
        <UserPlus size={20} style={styles.icon} />
        <Search size={20} style={styles.icon} />
        <div style={styles.divider} />
        <div style={styles.account}>
          <span>Account</span>
          <div style={styles.accountIcon}>
            <User size={18} color="#7c8fff" />
          </div>
        </div>
      </div>
    </nav>
  )
}