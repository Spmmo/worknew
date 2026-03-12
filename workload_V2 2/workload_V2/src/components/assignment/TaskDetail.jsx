import { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft, Calendar, User, Folder, Flag, Activity,
  Paperclip, Smile, Download, AlertTriangle, Clock,
  CheckCircle, Play, Upload, X, FileCheck, Star, RotateCcw,
} from 'lucide-react';
import ExtensionModal from './ExtensionModal';

const PRIORITY_CONFIG = {
  high:   { label: 'HIGH PRIORITY', color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
  medium: { label: 'MED PRIORITY',  color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
  low:    { label: 'LOW PRIORITY',  color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe' },
};

const STATUS_META = {
  'not-started':      { label: 'Not Started',       color: '#6b7280', pct: 0   },
  'in-progress':      { label: 'In Progress',        color: '#f97316', pct: 40  },
  'late-in-progress': { label: 'Late – In Progress', color: '#ef4444', pct: 40  },
  'pending-approval': { label: 'Pending Approval',   color: '#8b5cf6', pct: 0   },
  'needs-revision':   { label: 'Needs Revision',     color: '#f59e0b', pct: 60  },
  overdue:            { label: 'Overdue',            color: '#ef4444', pct: 0   },
  done:               { label: 'Completed',          color: '#22c55e', pct: 100 },
};

function InfoRow({ icon, label, value, valueColor, bold }) {
  return (
    <div className="info-row">
      <div className="info-row-label">{icon}<span>{label}</span></div>
      <div className="info-row-value" style={{ color: valueColor }}>
        {bold ? <strong>{value}</strong> : value}
      </div>
    </div>
  );
}

function AttachmentIcon({ type, color }) {
  return (
    <div style={{ color }}>
      {type === 'pdf' ? (
        <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM8 17.5v-1h8v1H8zm0-3v-1h8v1H8zm0-3v-1h5v1H8z"/>
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z"/>
        </svg>
      )}
    </div>
  );
}

export default function TaskDetail({
  task, onBack,
  onStartTask, onStartNow,
  onRequestExtension, onApproveExtension,
  onSubmitWork, onReturnForRevision,
  toast, showToast,
  fetchComments,
  addComment,
}) {
  const [comments, setComments]           = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentInput, setCommentInput]   = useState('');
  const [showExtModal, setShowExtModal]   = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const isRevision = task.statusKey === 'needs-revision';

  // ctaPhase: 'start' | 'continue' | 'submit' | 'resubmit' | 'none'
  const [ctaPhase, setCtaPhase] = useState(() => {
    const s = task.statusKey;
    if (s === 'needs-revision')  return 'resubmit';
    if (s === 'in-progress' || s === 'late-in-progress') return 'continue';
    if (s === 'done' || s === 'overdue' || s === 'pending-approval') return 'none';
    return 'start';
  });

  const fileInputRef = useRef(null);

  const isOverdue  = task.statusKey === 'overdue';
  const isLateIP   = task.statusKey === 'late-in-progress';
  const isPending  = task.statusKey === 'pending-approval';
  const isDone     = task.statusKey === 'done';

  const showUploadSection = ['continue', 'submit', 'resubmit'].includes(ctaPhase);
  const statusInfo = STATUS_META[task.statusKey] || STATUS_META['not-started'];
  const priorityCfg = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.low;

  // โหลด comments จาก Supabase
  useEffect(() => {
    if (!fetchComments || !task?.id) return;
    setCommentsLoading(true);
    fetchComments(task.id)
      .then(data => setComments(data || []))
      .catch(() => setComments([]))
      .finally(() => setCommentsLoading(false));
  }, [task?.id]); // eslint-disable-line

  const handleSend = async () => {
    if (!commentInput.trim()) return;
    const text = commentInput.trim();
    setCommentInput('');
    if (addComment) {
      const newComment = await addComment(task.id, text);
      if (newComment) { setComments(prev => [...prev, newComment]); return; }
    }
    // fallback optimistic
    setComments(prev => [...prev, {
      id: Date.now(), initials: 'ME', name: 'Me', time: 'JUST NOW',
      text, color: '#86efac', textBg: '#f0fdf4',
    }]);
  };
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const mapped = files.map(f => ({
      name: f.name,
      size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
      type: f.name.split('.').pop().toLowerCase(),
      iconColor: f.name.toLowerCase().endsWith('.pdf') ? '#ef4444' : '#22c55e',
    }));
    setUploadedFiles(prev => {
      const next = [...prev, ...mapped];
      if (next.length > 0) {
        setCtaPhase(isRevision ? 'resubmit' : 'submit');
      }
      return next;
    });
    e.target.value = '';
  };

  const removeFile = (idx) => {
    setUploadedFiles(prev => {
      const next = prev.filter((_, i) => i !== idx);
      if (next.length === 0) setCtaPhase(isRevision ? 'resubmit' : 'continue');
      return next;
    });
  };

  const handleStartTask = () => { onStartTask(task); setCtaPhase('continue'); };
  const handleStartNow  = () => { onStartNow(task);  setCtaPhase('continue'); };

  const handleSubmit = () => {
    if (uploadedFiles.length === 0) {
      showToast('Please add at least one file before submitting.', 'warning');
      return;
    }
    onSubmitWork(task.id, uploadedFiles);
  };

  const handleExtSubmit = (data) => {
    onRequestExtension(task.id, data);
    showToast('Extension request sent to Manager.', 'info');
  };

  /* ── CTA button ── */
  const renderCTAButton = () => {
    if (isDone) return null;
    if (isPending) return (
      <button className="btn-cta btn-cta-purple" disabled>
        <Clock size={17}/> Pending Approval
      </button>
    );
    if (isOverdue && ctaPhase !== 'continue' && ctaPhase !== 'submit') return (
      <button className="btn-cta btn-cta-red" onClick={handleStartNow}>
        <Clock size={17}/> Start Now
      </button>
    );
    if (ctaPhase === 'start') return (
      <button className="btn-cta btn-cta-indigo" onClick={handleStartTask}>
        <Play size={16}/> Start Task
      </button>
    );
    if (ctaPhase === 'continue') return (
      <button className="btn-cta btn-cta-orange" onClick={() => fileInputRef.current?.click()}>
        Continue Task
      </button>
    );
    if (ctaPhase === 'submit') return (
      <button className="btn-cta btn-cta-green" onClick={handleSubmit}>
        <CheckCircle size={17}/> Submit
      </button>
    );
    if (ctaPhase === 'resubmit') return (
      <button
        className={`btn-cta ${uploadedFiles.length > 0 ? 'btn-cta-amber' : 'btn-cta-amber-outline'}`}
        onClick={uploadedFiles.length > 0 ? handleSubmit : () => fileInputRef.current?.click()}
      >
        <RotateCcw size={16}/>
        {uploadedFiles.length > 0 ? 'Re-submit' : 'Upload Revised Files'}
      </button>
    );
    return null;
  };

  /* ════════════════════════════════════
     COMPLETED VIEW
  ════════════════════════════════════ */
  if (isDone) return (
    <div className="detail-page">
      {toast && <div className={`toast toast-${toast.type}`}><CheckCircle size={16}/> {toast.msg}</div>}
      <button className="btn-back" onClick={onBack}><ArrowLeft size={16}/> Back</button>
      <h1 className="detail-page-heading">Assignment</h1>
      <div className="detail-layout">
        <div className="detail-left">
          <div className="detail-card">
            <div className="detail-card-header">
              <h2 className="detail-title">{task.title}</h2>
              <span className="badge-done">✓ Completed</span>
            </div>
            <p className="detail-description">{task.description}</p>
            <div className="submission-meta-row">
              <CheckCircle size={15} color="#22c55e"/>
              <span>Submitted on <strong>{task.submittedAt}</strong></span>
            </div>
          </div>

          <div className="detail-card">
            <div className="attachments-header">
              <div className="attachments-title"><FileCheck size={18}/><span>Submitted Files ({task.submittedFiles?.length || 0})</span></div>
            </div>
            {task.submittedFiles?.length > 0 ? (
              <div className="attachments-grid">
                {task.submittedFiles.map((f, i) => (
                  <div key={i} className="attachment-item">
                    <AttachmentIcon type={f.type} color={f.iconColor}/>
                    <div className="attachment-info">
                      <span className="attachment-name">{f.name}</span>
                      <span className="attachment-meta">{f.size}</span>
                    </div>
                    <button className="btn-download"><Download size={15}/></button>
                  </div>
                ))}
              </div>
            ) : <p className="no-attachments">No files submitted.</p>}
          </div>

          {task.feedback ? (
            <div className="detail-card">
              <div className="feedback-header">
                <Star size={18} color="#f59e0b" fill="#f59e0b"/>
                <span className="feedback-title">Manager Feedback</span>
                {task.grade && <span className="feedback-grade">{task.grade}</span>}
              </div>
              <p className="feedback-body">{task.feedback}</p>
            </div>
          ) : (
            <div className="detail-card feedback-pending-card">
              <div className="feedback-header">
                <Clock size={18} color="#9ca3af"/>
                <span className="feedback-title" style={{ color:'#9ca3af' }}>Feedback Pending</span>
              </div>
              <p style={{ fontSize:13.5, color:'#9ca3af', marginTop:8 }}>
                Your manager has not left feedback yet.
              </p>
            </div>
          )}
        </div>

        <div className="detail-right">
          <div className="info-card">
            <h4 className="info-card-title">Submission Summary</h4>
            <InfoRow icon={<Calendar size={16} strokeWidth={1.8}/>} label="ORIGINAL DUE" value={task.dueDate}/>
            <InfoRow icon={<CheckCircle size={16} strokeWidth={1.8}/>} label="SUBMITTED" value={task.submittedAt} valueColor="#22c55e"/>
            <div className="info-row">
              <div className="info-row-label"><User size={16} strokeWidth={1.8}/><span>ASSIGNED BY</span></div>
              <div className="info-row-value assigned-by">
                <div className="avatar-xs" style={{ background:'#93c5fd', width:24, height:24, fontSize:10 }}>SC</div>
                <strong>{task.assignedBy}</strong>
              </div>
            </div>
            <InfoRow icon={<Folder size={16} strokeWidth={1.8}/>} label="GROUP" value={task.group} bold/>
            <InfoRow icon={<Activity size={16} strokeWidth={1.8}/>} label="STATUS" value="✓ Completed" valueColor="#22c55e"/>
          </div>
        </div>
      </div>
    </div>
  );

  /* ════════════════════════════════════
     NORMAL / REVISION / WORK VIEW
  ════════════════════════════════════ */
  return (
    <div className="detail-page">
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === 'success' && <CheckCircle size={16}/>}
          {toast.type === 'warning' && <AlertTriangle size={16}/>}
          {toast.msg}
        </div>
      )}
      {showExtModal && (
        <ExtensionModal task={task} onClose={() => setShowExtModal(false)} onSubmit={handleExtSubmit}/>
      )}

      <button className="btn-back" onClick={onBack}><ArrowLeft size={16}/> Back</button>
      <h1 className="detail-page-heading">Assignment</h1>

      {/* ── NEEDS REVISION BANNER ── */}
      {isRevision && (
        <div className="revision-banner">
          <div className="revision-banner-left">
            <RotateCcw size={18}/>
            <div>
              <p className="banner-title">Returned for Revision</p>
              <p className="banner-sub">Returned on {task.revisionReturnedAt}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── OVERDUE / PENDING BANNER ── */}
      {(isOverdue || isLateIP || isPending) && (
        <div className={`overdue-banner ${isPending ? 'banner-pending' : ''}`}>
          <div className="overdue-banner-left">
            <AlertTriangle size={18}/>
            <div>
              <p className="banner-title">
                {isPending ? 'Extension Requested – Awaiting Manager Approval'
                  : isLateIP ? 'This task is overdue – currently in progress'
                  : 'This task is overdue'}
              </p>
              <p className="banner-sub">
                {isPending
                  ? `New deadline: ${task.pendingDeadline}  ·  Reason: "${task.extensionReason}"`
                  : `Original deadline was ${task.dueDate}. Please take action.`}
              </p>
            </div>
          </div>
          <div className="overdue-banner-actions">
            {(isOverdue || isLateIP) && (
              <button className="btn-request-ext" onClick={() => setShowExtModal(true)}>
                Request Extension
              </button>
            )}
            {isPending && (
              <div className="pending-waiting-badge">
                <Clock size={14}/> Waiting for Manager
              </div>
            )}
          </div>
        </div>
      )}

      <div className="detail-layout">
        <div className="detail-left">

          {/* Title */}
          <div className="detail-card">
            <div className="detail-card-header">
              <h2 className="detail-title">{task.title}</h2>
              <span
                className="detail-priority-badge"
                style={{ color: priorityCfg.color, background: priorityCfg.bg, border: `1px solid ${priorityCfg.border}` }}
              >
                {priorityCfg.label}
              </span>
            </div>
            <p className="detail-description">{task.description}</p>
          </div>

          {/* Manager's Revision Feedback */}
          {isRevision && task.revisionFeedback && (
            <div className="detail-card revision-feedback-card">
              <div className="feedback-header">
                <RotateCcw size={17} color="#f59e0b"/>
                <span className="feedback-title" style={{ color:'#92400e' }}>Manager's Revision Notes</span>
              </div>
              <p className="revision-feedback-body">{task.revisionFeedback}</p>
            </div>
          )}

          {/* Previously submitted files (for revision) */}
          {isRevision && task.submittedFiles?.length > 0 && (
            <div className="detail-card">
              <div className="attachments-header">
                <div className="attachments-title">
                  <FileCheck size={18} color="#f59e0b"/>
                  <span>Your Previous Submission</span>
                </div>
              </div>
              <p className="prev-submission-note">Review your previous files before uploading revised versions.</p>
              <div className="attachments-grid">
                {task.submittedFiles.map((f, i) => (
                  <div key={i} className="attachment-item attachment-item-prev">
                    <AttachmentIcon type={f.type} color={f.iconColor}/>
                    <div className="attachment-info">
                      <span className="attachment-name">{f.name}</span>
                      <span className="attachment-meta">{f.size}</span>
                    </div>
                    <button className="btn-download"><Download size={15}/></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reference Attachments */}
          <div className="detail-card">
            <div className="attachments-header">
              <div className="attachments-title">
                <Paperclip size={18} strokeWidth={2.5}/>
                <span>Attachments ({task.attachments?.length || 0})</span>
              </div>
            </div>
            {task.attachments?.length > 0 ? (
              <div className="attachments-grid">
                {task.attachments.map((att, i) => (
                  <div key={i} className="attachment-item">
                    <AttachmentIcon type={att.type} color={att.iconColor}/>
                    <div className="attachment-info">
                      <span className="attachment-name">{att.name}</span>
                      <span className="attachment-meta">{att.size} • {att.added}</span>
                    </div>
                    <button className="btn-download"><Download size={15}/></button>
                  </div>
                ))}
              </div>
            ) : <p className="no-attachments">No reference files attached.</p>}
          </div>

          {/* Upload Work */}
          {showUploadSection && (
            <div className={`detail-card upload-work-card ${isRevision ? 'upload-work-card-revision' : ''}`}>
              <div className="attachments-header">
                <div className="attachments-title">
                  <Upload size={18}/>
                  <span>{isRevision ? 'Upload Revised Files' : 'Upload Your Work'}</span>
                </div>
                <button className="btn-upload-new" onClick={() => fileInputRef.current?.click()}>
                  + Add File
                </button>
              </div>
              <input ref={fileInputRef} type="file" multiple style={{ display:'none' }} onChange={handleFileChange}/>
              {uploadedFiles.length === 0 ? (
                <div className="upload-dropzone" onClick={() => fileInputRef.current?.click()}>
                  <Upload size={28} color="#9ca3af"/>
                  <p>{isRevision ? 'Upload your revised files here' : 'Click to upload or drag & drop'}</p>
                  <span>PDF, DOCX, XLSX, PNG, etc.</span>
                </div>
              ) : (
                <div className="uploaded-list">
                  {uploadedFiles.map((f, i) => (
                    <div key={i} className="uploaded-item">
                      <AttachmentIcon type={f.type} color={f.iconColor}/>
                      <div className="attachment-info">
                        <span className="attachment-name">{f.name}</span>
                        <span className="attachment-meta">{f.size}</span>
                      </div>
                      <button className="btn-remove-file" onClick={() => removeFile(i)}><X size={14}/></button>
                    </div>
                  ))}
                  <button className="btn-add-more" onClick={() => fileInputRef.current?.click()}>
                    + Add more files
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Comments */}
          <div className="detail-card">
            <div className="comments-title-row">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <span className="comments-heading">Comments</span>
            </div>
            <div className="comments-list">
              {commentsLoading ? (
                <p style={{ textAlign: 'center', padding: '20px 0', color: '#9ca3af', fontSize: 13 }}>Loading comments...</p>
              ) : comments.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '20px 0', color: '#9ca3af', fontSize: 13 }}>No comments yet.</p>
              ) : (
                comments.map(c => (
                  <div key={c.id} className="comment-row">
                    <div className="comment-avatar" style={{ background: c.color }}>{c.initials}</div>
                    <div className="comment-body">
                      <div className="comment-meta">
                        <span className="comment-name">{c.name}</span>
                        <span className="comment-time">{c.time}</span>
                      </div>
                      <div className="comment-bubble" style={{ background: c.textBg }}>{c.text}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="comment-input-box">
              <textarea
                className="comment-textarea"
                placeholder="Write a comment..."
                value={commentInput}
                onChange={e => setCommentInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
                rows={3}
              />
              <div className="comment-input-footer">
                <div className="comment-input-icons">
                  <button className="icon-btn-sm"><Smile size={18}/></button>
                  <button className="icon-btn-sm"><Paperclip size={18}/></button>
                </div>
                <button className="btn-send" onClick={handleSend}>Send</button>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="detail-right">
          {renderCTAButton()}

          <div className="info-card">
            <h4 className="info-card-title">Task Information</h4>

            <div className="info-row">
              <div className="info-row-label"><Calendar size={16} strokeWidth={1.8}/><span>DUE DATE</span></div>
              <div className={`info-row-value ${isOverdue || isLateIP ? 'due-overdue' : ''}`}>
                {task.dueDate}
                {(isOverdue || isLateIP) && <span className="overdue-tag">Overdue</span>}
                {isPending && task.pendingDeadline && <span className="pending-tag">→ {task.pendingDeadline}</span>}
              </div>
            </div>

            <div className="info-row">
              <div className="info-row-label"><User size={16} strokeWidth={1.8}/><span>ASSIGNED BY</span></div>
              <div className="info-row-value assigned-by">
                <div className="avatar-xs" style={{ background:'#93c5fd', width:24, height:24, fontSize:10 }}>SC</div>
                <strong>{task.assignedBy}</strong>
              </div>
            </div>

            <div className="info-row">
              <div className="info-row-label"><Folder size={16} strokeWidth={1.8}/><span>GROUP</span></div>
              <div className="info-row-value"><strong>{task.group}</strong></div>
            </div>

            <div className="info-row">
              <div className="info-row-label"><Flag size={16} strokeWidth={1.8}/><span>PRIORITY</span></div>
              <div className="info-row-value priority-val">High Priority</div>
            </div>

            <div className="info-row">
              <div className="info-row-label"><Activity size={16} strokeWidth={1.8}/><span>STATUS</span></div>
              <div className="info-status-col">
                <div className="status-val-label">
                  <span style={{ color: statusInfo.color, fontWeight:700, fontSize:13.5 }}>{statusInfo.label}</span>
                  {statusInfo.pct > 0 && <span className="status-pct">{statusInfo.pct}%</span>}
                </div>
                {statusInfo.pct > 0 && (
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width:`${statusInfo.pct}%`, background: statusInfo.color }}/>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}