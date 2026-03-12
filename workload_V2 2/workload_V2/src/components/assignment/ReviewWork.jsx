import React from 'react'
import { Eye, Download, Send, CheckCircle, Paperclip } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile } from '@fortawesome/free-regular-svg-icons'

const styles = {
  card: {
    background: '#fff', borderRadius: '14px', padding: '22px',
    width: '280px', minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '16px',
  },
  titleBlock: { display: 'flex', flexDirection: 'column', gap: '4px' },
  title: {
    fontWeight: '800', fontSize: '22px', color: '#1a1a2e',
    fontFamily: "'Segoe UI', sans-serif", letterSpacing: '-0.3px', lineHeight: 1.2,
  },
  submissionId: {
    fontSize: '12px', color: '#b0b8cc',
    fontFamily: "'Segoe UI', sans-serif", fontWeight: '400',
  },
  noSelection: { textAlign: 'center', color: '#bbb', padding: '40px 0', fontSize: '14px' },
  statusBadge: {
    padding: '6px 14px', borderRadius: '20px', fontSize: '12px',
    fontWeight: '600', display: 'inline-block',
    fontFamily: "'Segoe UI', sans-serif", letterSpacing: '0.2px',
    alignSelf: 'flex-start',
  },
  filesSection: { display: 'flex', flexDirection: 'column', gap: '8px' },
  filesLabel: {
    fontSize: '12px', fontWeight: '600', color: '#aab0c0',
    letterSpacing: '0.3px', fontFamily: "'Segoe UI', sans-serif",
    textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px',
  },
  noFiles: {
    fontSize: '13px', color: '#ccc', textAlign: 'center',
    padding: '12px', background: '#f8f9ff', borderRadius: '10px',
    border: '1px dashed #e0e4f0',
  },
  fileCard: {
    background: '#f8f9ff', borderRadius: '12px', padding: '12px',
    display: 'flex', flexDirection: 'column', gap: '8px',
    border: '1px solid #e8eaf6',
  },
  fileTop: { display: 'flex', alignItems: 'center', gap: '10px' },
  fileIcon: {
    width: '36px', height: '42px', background: '#5a5fff',
    borderRadius: '8px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '16px', flexShrink: 0,
  },
  fileInfo: { display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, minWidth: 0 },
  fileName: {
    fontWeight: '700', fontSize: '13px', color: '#2a2a4a',
    fontFamily: "'Segoe UI', sans-serif", lineHeight: 1.3,
    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
  },
  fileMeta: {
    fontSize: '11px', color: '#aab0c0',
    fontFamily: "'Segoe UI', sans-serif", fontWeight: '400',
  },
  fileActions: { display: 'flex', gap: '6px' },
  fileBtn: {
    display: 'flex', alignItems: 'center', gap: '4px',
    padding: '6px 10px', borderRadius: '8px', border: '1.5px solid #e0e4f0',
    background: '#fff', fontSize: '11px', cursor: 'pointer',
    color: '#555', fontWeight: '500', flex: 1, justifyContent: 'center',
    fontFamily: "'Segoe UI', sans-serif", whiteSpace: 'nowrap',
    textDecoration: 'none',
  },
  feedbackSection: { display: 'flex', flexDirection: 'column', gap: '8px' },
  feedbackLabel: {
    fontSize: '12px', fontWeight: '600', color: '#aab0c0',
    letterSpacing: '0.3px', fontFamily: "'Segoe UI', sans-serif",
    textTransform: 'uppercase',
  },
  feedbackBox: {
    width: '100%', borderRadius: '10px', border: '1.5px solid #e8eaf6',
    padding: '10px 12px', fontSize: '13px', color: '#333',
    resize: 'none', outline: 'none', height: '90px',
    fontFamily: "'Segoe UI', sans-serif", background: '#fafbff',
    lineHeight: '1.5', transition: 'border-color 0.2s', boxSizing: 'border-box',
  },
  approveBtn: {
    background: '#3a3fff', color: '#fff', border: 'none',
    borderRadius: '50px', padding: '13px 16px', fontWeight: '700',
    fontSize: '14px', cursor: 'pointer', display: 'flex',
    alignItems: 'center', justifyContent: 'center', gap: '8px',
    fontFamily: "'Segoe UI', sans-serif", letterSpacing: '0.2px',
  },
  revisionBtn: {
    background: '#fff', color: '#f44336', border: '1.5px solid #f44336',
    borderRadius: '50px', padding: '11px 16px', fontWeight: '700',
    fontSize: '14px', cursor: 'pointer', display: 'flex',
    alignItems: 'center', justifyContent: 'center', gap: '8px',
    fontFamily: "'Segoe UI', sans-serif", letterSpacing: '0.2px',
  },
}

function getFileIconColor(fileName) {
  const ext = (fileName || '').split('.').pop().toLowerCase()
  const map = {
    pdf:  '#e53935',
    doc:  '#1565c0', docx: '#1565c0',
    xls:  '#2e7d32', xlsx: '#2e7d32',
    png:  '#6a1b9a', jpg: '#6a1b9a', jpeg: '#6a1b9a',
    zip:  '#f57f17',
    txt:  '#546e7a',
  }
  return map[ext] || '#5a5fff'
}

function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function FileItem({ file }) {
  const color = getFileIconColor(file.name)

  return (
    <div style={styles.fileCard}>
      <div style={styles.fileTop}>
        <div style={{ ...styles.fileIcon, background: color }}>
          <FontAwesomeIcon icon={faFile} style={{ color: '#fff', fontSize: '18px' }} />
        </div>
        <div style={styles.fileInfo}>
          <div style={styles.fileName} title={file.name}>{file.name}</div>
          <div style={styles.fileMeta}>
            {formatFileSize(file.size)}
            {file.uploadedBy ? ` • ${file.uploadedBy}` : ''}
          </div>
        </div>
      </div>
      <div style={styles.fileActions}>
        <a href={file.url} target="_blank" rel="noopener noreferrer" style={styles.fileBtn}>
          <Eye size={11} /> Preview
        </a>
        <a href={file.url} download={file.name} style={styles.fileBtn}>
          <Download size={11} /> Download
        </a>
      </div>
    </div>
  )
}

export default function ReviewWork({ submission, onApprove, onRevision, feedback, setFeedback }) {
  if (!submission) {
    return (
      <div style={styles.card}>
        <div style={styles.noSelection}>Select a submission to review</div>
      </div>
    )
  }

  const fbKey = submission.id
  const currentFeedback = feedback[fbKey] || ''
  const files = submission.files || []

  const statusColors = {
    'Approved':        { color: '#4caf50', bg: '#e8f5e9' },
    'Revision Needed': { color: '#f44336', bg: '#fce4ec' },
    'Pending':         { color: '#ff9800', bg: '#fff3e0' },
  }
  const sc = statusColors[submission.status] || statusColors['Pending']

  return (
    <div style={styles.card}>
      <div style={styles.titleBlock}>
        <div style={styles.title}>Review Work</div>
        <div style={styles.submissionId}>Submission ID: #{submission.id}</div>
      </div>

      <span style={{ ...styles.statusBadge, color: sc.color, background: sc.bg }}>
        {submission.status}
      </span>

      <div style={styles.filesSection}>
        <div style={styles.filesLabel}>
          <Paperclip size={12} />
          Attached Files
          {files.length > 0 && (
            <span style={{
              background: '#5a5fff', color: '#fff',
              borderRadius: '10px', fontSize: '10px',
              padding: '1px 6px', fontWeight: '700',
            }}>
              {files.length}
            </span>
          )}
        </div>
        {files.length === 0 ? (
          <div style={styles.noFiles}>No files attached</div>
        ) : (
          files.map(file => <FileItem key={file.id} file={file} />)
        )}
      </div>

      <div style={styles.feedbackSection}>
        <div style={styles.feedbackLabel}>Feedback & Comments</div>
        <textarea
          style={styles.feedbackBox}
          placeholder="Provide constructive feedback to your team member..."
          value={currentFeedback}
          onChange={(e) => setFeedback({ ...feedback, [fbKey]: e.target.value })}
        />
      </div>

      <button
        style={{
          ...styles.approveBtn,
          opacity: submission.status === 'Approved' ? 0.5 : 1,
          cursor: submission.status === 'Approved' ? 'not-allowed' : 'pointer',
        }}
        onClick={() => onApprove(submission.id)}
        disabled={submission.status === 'Approved'}
      >
        <CheckCircle size={18} />
        {submission.status === 'Approved' ? 'Already Approved' : 'Approve Submission'}
      </button>

      <button
        style={{
          ...styles.revisionBtn,
          opacity: submission.status === 'Revision Needed' ? 0.5 : 1,
          cursor: submission.status === 'Revision Needed' ? 'not-allowed' : 'pointer',
        }}
        onClick={() => onRevision(submission.id)}
        disabled={submission.status === 'Revision Needed'}
      >
        <Send size={16} />
        Request Revision
      </button>
    </div>
  )
}