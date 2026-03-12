import React from 'react'
import { Clock, CheckCircle, TrendingUp } from 'lucide-react'

const styles = {
  header: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: '18px',
  },
  title: { fontSize: '26px', fontWeight: '800', color: '#1a1a2e', margin: 0 },
  subtitle: { fontSize: '13px', color: '#888', marginTop: '2px' },
  stats: { display: 'flex', gap: '14px' },
  statCard: {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '10px 18px', borderRadius: '50px',
    border: '2px solid', background: '#fff',
    transition: 'transform 0.2s',
  },
  statValue: { fontSize: '22px', fontWeight: '800' },
  statLabel: { fontSize: '10px', fontWeight: '600', letterSpacing: '1px', color: '#888' },
}

export default function ReviewStats({ stats }) {
  return (
    <div style={styles.header}>
      <div>
        <h1 style={styles.title}>Review Submissions</h1>
        <p style={styles.subtitle}>Manage your team's output and maintain quality standards.</p>
      </div>
      <div style={styles.stats}>
        <div style={{ ...styles.statCard, borderColor: '#ccc' }}>
          <Clock size={22} color="#888" />
          <div>
            <div style={{ ...styles.statValue, color: '#333' }}>{stats.pending}</div>
            <div style={styles.statLabel}>PENDING</div>
          </div>
        </div>
        <div style={{ ...styles.statCard, borderColor: '#4caf50' }}>
          <CheckCircle size={22} color="#4caf50" />
          <div>
            <div style={{ ...styles.statValue, color: '#333' }}>{stats.approved}</div>
            <div style={styles.statLabel}>APPOVED</div>
          </div>
        </div>
        <div style={{ ...styles.statCard, borderColor: '#5a5fff' }}>
          <TrendingUp size={22} color="#5a5fff" />
          <div>
            <div style={{ ...styles.statValue, color: '#333' }}>{stats.quality}%</div>
            <div style={styles.statLabel}>QUALITY</div>
          </div>
        </div>
      </div>
    </div>
  )
}
