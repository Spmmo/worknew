import React from 'react'
import { BarChart2 } from 'lucide-react'

const styles = {
  card: { background: '#fff', borderRadius: '14px', padding: '16px', flex: 1 },
  cardHeader: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: '14px',
  },
  cardTitle: {
    fontSize: '12px', fontWeight: '700',
    color: '#888', letterSpacing: '1px', textTransform: 'uppercase',
  },
  memberRow: { marginBottom: '12px' },
  memberLabel: {
    display: 'flex', justifyContent: 'space-between',
    marginBottom: '4px', fontSize: '13px', color: '#555', fontWeight: '500',
  },
  barBg: { background: '#e8eaf6', borderRadius: '10px', height: '8px', overflow: 'hidden' },
  bar: { height: '100%', borderRadius: '10px', transition: 'width 0.5s ease' },
}

function getBarColor(pct) {
  if (pct >= 80) return 'linear-gradient(90deg, #f44336, #ff7043)'
  if (pct >= 50) return 'linear-gradient(90deg, #ff9800, #ffb74d)'
  return 'linear-gradient(90deg, #6c7aff, #4fc3f7)'
}

export default function MemberWorkload({ workloads }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <span style={styles.cardTitle}>MEMBER WORKLOAD</span>
        <BarChart2 size={16} color="#bbb" />
      </div>
      {workloads.map((m, i) => (
        <div key={i} style={styles.memberRow}>
          <div style={styles.memberLabel}>
            <span>{m.name}</span>
            <span style={{ color: m.pct >= 80 ? '#f44336' : m.pct >= 50 ? '#ff9800' : '#555' }}>
              {m.pct}%
            </span>
          </div>
          <div style={styles.barBg}>
            <div
              style={{
                ...styles.bar,
                width: `${m.pct}%`,
                background: getBarColor(m.pct),
              }}
            />
          </div>
        </div>
      ))}
      <p style={{ fontSize: '11px', color: '#bbb', marginTop: '8px' }}>
        🔴 Red = has pending/revision tasks &nbsp;|&nbsp; 100% = fully loaded
      </p>
    </div>
  )
}
