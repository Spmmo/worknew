import { useState } from 'react';
import { X, Calendar, MessageSquare } from 'lucide-react';

export default function ExtensionModal({ task, onClose, onSubmit }) {
  const [newDeadline, setNewDeadline] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!newDeadline) { setError('Please select a new deadline.'); return; }
    if (!reason.trim()) { setError('Please provide a reason.'); return; }
    onSubmit({ newDeadline, reason });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Request Extension</h3>
            <p className="modal-subtitle">for: <strong>{task.title}</strong></p>
          </div>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div className="modal-field">
            <label className="modal-label">
              <Calendar size={14} /> New Deadline
            </label>
            <input
              type="date"
              className="modal-input"
              value={newDeadline}
              onChange={(e) => { setNewDeadline(e.target.value); setError(''); }}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">
              <MessageSquare size={14} /> Reason for Extension
            </label>
            <textarea
              className="modal-textarea"
              placeholder="Explain why you need more time..."
              value={reason}
              onChange={(e) => { setReason(e.target.value); setError(''); }}
              rows={4}
            />
          </div>

          {error && <p className="modal-error">{error}</p>}
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn-modal-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-modal-submit" onClick={handleSubmit}>
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
}