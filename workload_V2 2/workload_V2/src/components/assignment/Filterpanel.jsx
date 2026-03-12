import { X, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const PRIORITIES = [
  { key: 'high',     label: 'High Priority', chipClass: 'chip-high' },
  { key: 'low',      label: 'Low Priority',  chipClass: 'chip-low' },
  { key: 'revision', label: 'Needs Revision', chipClass: 'chip-revision' },
];

const DUE_OPTIONS = [
  { key: 'today', label: 'Due this day' },
  { key: 'week',  label: 'Due this week' },
  { key: 'month', label: 'Due this month' },
];

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="fp-section">
      <button className="fp-section-header" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <ChevronDown size={15} className={`fp-chevron ${open ? 'open' : ''}`} />
      </button>
      {open && <div className="fp-section-body">{children}</div>}
    </div>
  );
}

export default function FilterPanel({ groups, filters, onChange, onClear, onClose }) {
  const toggle = (key, value) => {
    const prev = filters[key] || [];
    const next = prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value];
    onChange({ ...filters, [key]: next });
  };

  const activeCount =
    (filters.priority?.length || 0) +
    (filters.dueDate?.length || 0) +
    (filters.group?.length || 0);

  return (
    <>
      <div className="fp-backdrop" onClick={onClose} />

      <div className="fp-panel">
        {/* Header */}
        <div className="fp-header">
          <div className="fp-header-left">
            <span className="fp-title">Filter</span>
            {activeCount > 0 && <span className="fp-count">{activeCount}</span>}
          </div>
          <div className="fp-header-right">
            {activeCount > 0 && (
              <button className="fp-clear" onClick={onClear}>Clear all</button>
            )}
            <button className="fp-close" onClick={onClose}><X size={16} /></button>
          </div>
        </div>

        <div className="fp-body">
          {/* Priority */}
          <Section title="Priority">
            <div className="fp-chips">
              {PRIORITIES.map(p => {
                const active = filters.priority?.includes(p.key);
                return (
                  <button
                    key={p.key}
                    className={`fp-chip ${active ? 'active' : ''} ${p.chipClass}`}
                    onClick={() => toggle('priority', p.key)}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </Section>

          {/* Due Date */}
          <Section title="Due Date">
            <div className="fp-options">
              {DUE_OPTIONS.map(opt => {
                const active = filters.dueDate?.includes(opt.key);
                return (
                  <label key={opt.key} className="fp-option">
                    <input
                      type="checkbox"
                      checked={!!active}
                      onChange={() => toggle('dueDate', opt.key)}
                    />
                    <span>{opt.label}</span>
                  </label>
                );
              })}
            </div>
          </Section>

          {/* Group */}
          <Section title="Group">
            <div className="fp-options">
              {groups.map(g => {
                const active = filters.group?.includes(g);
                return (
                  <label key={g} className="fp-option">
                    <input
                      type="checkbox"
                      checked={!!active}
                      onChange={() => toggle('group', g)}
                    />
                    <span>{g}</span>
                  </label>
                );
              })}
            </div>
          </Section>
        </div>
      </div>
    </>
  );
}