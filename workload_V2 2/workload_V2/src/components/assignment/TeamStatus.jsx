import React from 'react'

const styles = {
  sidebar: {
    background: '#dde3f8',
    borderRadius: '16px',
    padding: '20px',
    width: '220px',
    minWidth: '220px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: '13px',
    fontWeight: '700',
    color: '#6c7aff',
    letterSpacing: '1.5px',
    marginBottom: '6px',
    textDecoration: 'underline',
    textDecorationColor: '#6c7aff',
  },
  memberRow: {
    display: 'flex', alignItems: 'center',
    gap: '10px', padding: '4px 0',
  },
  dot: { width: '14px', height: '14px', borderRadius: '50%', flexShrink: 0 },
  memberName: { fontWeight: '700', fontSize: '16px', color: '#2a2a4a', flex: 1 },
  status: { fontSize: '12px', color: '#888' },
  divider: { height: '1px', background: '#c5cadf', margin: '6px 0' },
  recentTitle: { textAlign: 'center', fontSize: '13px', fontWeight: '700', color: '#6c7aff', letterSpacing: '1.5px', marginTop: '4px' },
  activityTitle: { textAlign: 'center', fontSize: '13px', fontWeight: '700', color: '#6c7aff', letterSpacing: '1.5px', marginBottom: '8px' },
  activityList: { display: 'flex', flexDirection: 'column', gap: '0px' },
  activityItem: { display: 'flex', gap: '10px', alignItems: 'flex-start', position: 'relative' },
  timelineLine: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  timelineDot: {
    width: '12px', height: '12px', borderRadius: '50%',
    background: '#5a5fff', flexShrink: 0, marginTop: '3px', zIndex: 1,
  },
  timelineConnector: { width: '2px', flex: 1, background: '#b0b8e8', minHeight: '30px' },
  activityContent: { paddingBottom: '16px' },
  activityName: { fontWeight: '700', fontSize: '13px', color: '#2a2a4a' },
  activityDesc: { fontSize: '11px', color: '#666', marginTop: '1px' },
  activityTime: { fontSize: '11px', color: '#999', marginTop: '1px' },
}

// Derive activity feed from submissions
function getActivities(submissions) {
  return submissions
    .slice()
    .sort((a, b) => b.submittedTimestamp - a.submittedTimestamp)
    .slice(0, 3)
    .map((s) => {
      const hoursAgo = Math.floor((Date.now() - s.submittedTimestamp) / 3600000)
      const timeStr = hoursAgo < 1 ? 'Just now' : hoursAgo < 24 ? `${hoursAgo} h ago` : 'Yesterday'
      let desc = 'uploaded a new file'
      if (s.status === 'Approved') desc = `completed ${s.task}`
      else if (s.status === 'Revision Needed') desc = 'replied to new file'
      return { name: s.name, desc, time: timeStr }
    })
}

export default function TeamStatus({ memberStatuses, submissions }) {
  const activities = getActivities(submissions)

  return (
    <aside style={styles.sidebar}>
      <div style={styles.sectionTitle}>TEAM STATUS</div>

      {memberStatuses.map((m, i) => (
        <div key={i} style={styles.memberRow}>
          <div style={{ ...styles.dot, background: m.color }} />
          <span style={styles.memberName}>{m.name}</span>
          <span style={styles.status}>{m.status}</span>
        </div>
      ))}

      <div style={styles.divider} />
      <div style={styles.recentTitle}>RECENT</div>
      <div style={styles.activityTitle}>ACTIVETY</div>

      <div style={styles.activityList}>
        {activities.map((a, i) => (
          <div key={i} style={styles.activityItem}>
            <div style={styles.timelineLine}>
              <div style={styles.timelineDot} />
              {i < activities.length - 1 && <div style={styles.timelineConnector} />}
            </div>
            <div style={styles.activityContent}>
              <div style={styles.activityName}>{a.name}</div>
              <div style={styles.activityDesc}>{a.desc}</div>
              <div style={styles.activityTime}>{a.time}</div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}
