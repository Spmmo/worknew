import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleExclamation, faFile } from '@fortawesome/free-solid-svg-icons'

const styles = {
  card: {
    background: '#fff', borderRadius: '14px', padding: '20px',
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', flex: '0 0 260px', textAlign: 'center', gap: '8px',
    transition: 'box-shadow 0.3s',
  },
  icon: {
    width: '48px', height: '48px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '4px',
  },
  title: { fontWeight: '800', fontSize: '15px', color: '#1a1a2e' },
  desc: { fontSize: '12px', color: '#999', lineHeight: '1.5' },
  link: {
    fontSize: '13px', color: '#5a5fff', fontWeight: '600',
    cursor: 'pointer', textDecoration: 'none', marginTop: '4px',
    background: 'none', border: 'none', padding: 0,
  },
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)', zIndex: 1000,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  modal: {
    background: '#fff', borderRadius: '16px', padding: '28px 32px',
    minWidth: '360px', maxWidth: '460px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  },
  modalTitle: { fontWeight: '800', fontSize: '18px', color: '#1a1a2e', marginBottom: '6px' },
  modalSubtitle: { fontSize: '13px', color: '#888', marginBottom: '20px' },
  bottleneckItem: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '12px', borderRadius: '10px', background: '#fff3f0',
    border: '1px solid #ffccbc', marginBottom: '10px',
  },
  itemIcon: { fontSize: '20px' },
  itemName: { fontWeight: '700', fontSize: '13px', color: '#2a2a4a' },
  itemDesc: { fontSize: '11px', color: '#888', marginTop: '2px' },
  closeBtn: {
    marginTop: '16px', padding: '10px 24px', borderRadius: '8px',
    background: '#5a5fff', color: '#fff', border: 'none',
    fontWeight: '700', fontSize: '14px', cursor: 'pointer', width: '100%',
  },
}

function formatHours(timestamp) {
  const h = Math.floor((Date.now() - timestamp) / 3600000)
  if (h < 24) return `${h} hours`
  return `${Math.floor(h / 24)} day(s)`
}

export default function ReviewBottleneck({ bottlenecks, showModal, setShowModal }) {
  const hasBottleneck = bottlenecks.length > 0
  const iconStyle = {
    ...styles.icon,
    background: hasBottleneck ? '#fff3e0' : '#e8f5e9',
    border: `3px solid ${hasBottleneck ? '#f44336' : '#4caf50'}`,
  }

  return (
    <>
      <div style={{
        ...styles.card,
        boxShadow: hasBottleneck ? '0 0 0 2px #f4433633' : 'none',
      }}>
        <div style={iconStyle}>
          {hasBottleneck
            ? <FontAwesomeIcon icon={faCircleExclamation} style={{ color: '#f44336', fontSize: '22px' }} />
            : '✅'}
        </div>
        <div style={styles.title}>
          {hasBottleneck ? 'Review Bottleneck' : 'All Caught Up!'}
        </div>
        <div style={styles.desc}>
          {hasBottleneck
            ? `${bottlenecks.length} submission${bottlenecks.length > 1 ? 's are' : ' is'} waiting for more than 24 hours.`
            : 'No submissions are waiting over 24 hours.'}
        </div>
        {hasBottleneck && (
          <button style={styles.link} onClick={() => setShowModal(true)}>
            View Bottlenecks
          </button>
        )}
      </div>

      {showModal && (
        <div style={styles.overlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalTitle}>
              <FontAwesomeIcon icon={faCircleExclamation} style={{ color: '#f44336', marginRight: '8px' }} />
              Bottleneck Alert
            </div>
            <div style={styles.modalSubtitle}>
              {bottlenecks.length} submission{bottlenecks.length > 1 ? 's have' : ' has'} been waiting over 24 hours — action needed!
            </div>
            {bottlenecks.map((s, i) => (
              <div key={i} style={styles.bottleneckItem}>
                <FontAwesomeIcon icon={faFile} style={{ color: '#5a5fff', fontSize: '20px' }} />
                <div>
                  <div style={styles.itemName}>{s.task} — {s.name}</div>
                  <div style={styles.itemDesc}>
                    Waiting {formatHours(s.submittedTimestamp)} • Status: <b>{s.status}</b>
                  </div>
                </div>
              </div>
            ))}
            <button style={styles.closeBtn} onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  )
}