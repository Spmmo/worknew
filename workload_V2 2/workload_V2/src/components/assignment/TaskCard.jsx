import { Calendar, Play, Eye, FileCheck, RotateCcw } from 'lucide-react';

const STATUS_CONFIG = {
  'not-started':      { label: 'Not Started',        color: '#6b7280', bg: '#f3f4f6' },
  'in-progress':      { label: 'In Progress',         color: '#f97316', bg: '#fff7ed' },
  'late-in-progress': { label: 'Late – In Progress',  color: '#ef4444', bg: '#fef2f2' },
  'pending-approval': { label: 'Pending Approval',    color: '#8b5cf6', bg: '#f5f3ff' },
  'needs-revision':   { label: 'Needs Revision',      color: '#f59e0b', bg: '#fffbeb' },
  overdue:            { label: 'Overdue',             color: '#ef4444', bg: '#fef2f2' },
  done:               { label: 'Completed',           color: '#22c55e', bg: '#f0fdf4' },
};

const PRIORITY_CONFIG = {
  high: { label: 'HIGH PRIORITY', color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
  low:  { label: 'LOW PRIORITY',  color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe' },
};

export default function TaskCard({ task, tab, onViewDetail, onStartTask, onStartNow }) {
  const priority  = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.low;
  const statusCfg = STATUS_CONFIG[task.statusKey]  || STATUS_CONFIG['not-started'];

  const isOverdueStatus   = task.statusKey === 'overdue' || task.statusKey === 'late-in-progress';
  const isNeedsRevision   = task.statusKey === 'needs-revision';

  return (
    <div className={`task-card ${isNeedsRevision ? 'task-card-revision' : ''}`}>
      <div className="task-card-left">
        <div className="task-card-badges-row">
          <div
            className="priority-badge"
            style={{ color: priority.color, background: priority.bg, border: `1px solid ${priority.border}` }}
          >
            {priority.label}
          </div>
          {isNeedsRevision && (
            <div className="revision-badge">
              <RotateCcw size={11} /> Returned by Manager
            </div>
          )}
        </div>

        <h3 className="task-card-title">{task.title}</h3>

        <p className="task-card-meta">
          Assigned by <strong>{task.assignedBy}</strong>
          &nbsp;&nbsp;Group: <strong>{task.group}</strong>
        </p>

        {/* Revision feedback snippet on the card */}
        {isNeedsRevision && task.revisionFeedback && (
          <p className="revision-snippet">
            <RotateCcw size={11} />
            "{task.revisionFeedback.slice(0, 80)}{task.revisionFeedback.length > 80 ? '…' : ''}"
          </p>
        )}

        <div className="task-card-due">
          <Calendar size={13} strokeWidth={2} />
          <span style={{ color: isOverdueStatus ? '#ef4444' : undefined }}>
            {isOverdueStatus ? 'Overdue:' : tab === 'Completed' ? 'Submitted:' : 'Due'}{' '}
            {tab === 'Completed' ? task.submittedAt?.split('·')[0].trim() : task.dueDate}
          </span>
          <span className="status-chip" style={{ color: statusCfg.color, background: statusCfg.bg }}>
            • {statusCfg.label}
          </span>
          {task.statusKey === 'pending-approval' && (
            <span className="pending-ext-note">Extension pending</span>
          )}
        </div>
      </div>

      <div className="task-card-right">
        {task.assignees && (
          <div className="assignee-stack">
            {task.assignees.map((a, i) => (
              <div key={i} className="avatar-xs" style={{ background: a.color, zIndex: task.assignees.length - i }}>
                {a.initials}
              </div>
            ))}
            {task.extraCount && <div className="avatar-xs avatar-count">+{task.extraCount}</div>}
          </div>
        )}

        {tab === 'Upcoming' && (
          <>
            <button className="btn-view-details" onClick={() => onViewDetail(task)}>
              <Eye size={14} /> View Details
            </button>
            {task.statusKey === 'not-started' && (
              <button className="btn-start-task" onClick={() => { onStartTask(task); onViewDetail({ ...task, statusKey: 'in-progress' }); }}>
                <Play size={13} /> Start Task
              </button>
            )}
            {task.statusKey === 'in-progress' && (
              <button className="btn-continue-task" onClick={() => onViewDetail(task)}>
                Continue
              </button>
            )}
            {task.statusKey === 'needs-revision' && (
              <button className="btn-revise-task" onClick={() => onViewDetail(task)}>
                <RotateCcw size={13} /> Revise
              </button>
            )}
          </>
        )}

        {tab === 'Overdue' && (
          <>
            <button className="btn-view-details" onClick={() => onViewDetail(task)}>
              <Eye size={14} /> View Details
            </button>
            {task.statusKey === 'overdue' && (
              <button className="btn-start-now-card" onClick={() => onStartNow(task)}>
                Start Now
              </button>
            )}
            {task.statusKey === 'late-in-progress' && (
              <button className="btn-continue-task" onClick={() => onViewDetail(task)}>
                Continue
              </button>
            )}
            {task.statusKey === 'pending-approval' && (
              <button className="btn-pending-card" onClick={() => onViewDetail(task)}>
                View Request
              </button>
            )}
          </>
        )}

        {tab === 'Completed' && (
          <button className="btn-view-submission" onClick={() => onViewDetail(task)}>
            <FileCheck size={14} /> View Submission
          </button>
        )}
      </div>
    </div>
  );
}