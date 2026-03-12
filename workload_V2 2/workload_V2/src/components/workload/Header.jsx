import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Search, X, CheckSquare, Calendar, User, Clock, Tag, ChevronRight, AlertCircle } from 'lucide-react'
import NotificationBell from './NotificationBell'
import { supabase } from '../../supabaseClient'

// ── Styles ────────────────────────────────────────────────────────────────────
const S = {
  navbar: {
    background: '#ffffff',
    color: '#1a1a1a',
    height: 70,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 28px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 1px 8px rgba(0,0,0,0.07)',
    borderBottom: '1px solid #ebebeb',
    overflow: 'visible',
  },
  logo: { display: 'flex', alignItems: 'center' },
  logoImg: { height: 52, objectFit: 'contain' },
  navActions: { display: 'flex', alignItems: 'center', gap: 6 },
  iconBtn: {
    background: 'none', border: 'none', color: '#555',
    cursor: 'pointer', padding: 7, display: 'flex', alignItems: 'center',
    borderRadius: 8, transition: 'background 0.15s',
  },
  divider: { width: 1, height: 28, background: '#e4e4e4', margin: '0 8px' },
  accountLabel: { fontSize: 13, color: '#666', fontWeight: 500 },
  avatarCircle: {
    width: 36, height: 36, borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', cursor: 'pointer', marginLeft: 4,
    boxShadow: '0 2px 8px rgba(102,126,234,0.4)',
  },
}

const STATUS_CFG = {
  'done':        { bg: '#dcfce7', color: '#16a34a', label: 'Done',         dot: '#22c55e' },
  'working':     { bg: '#fef3c7', color: '#d97706', label: 'Working on it', dot: '#f59e0b' },
  'not-started': { bg: '#f3f4f6', color: '#6b7280', label: 'Not started',  dot: '#9ca3af' },
}

// ── User Icon ──────────────────────────────────────────────────────────────────
const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
  </svg>
)

// ── Task Detail Modal ─────────────────────────────────────────────────────────
const TaskDetailModal = ({ task, onClose }) => {
  if (!task) return null

  const s = STATUS_CFG[task.status] || STATUS_CFG['not-started']
  const owners = Array.isArray(task.owner) ? task.owner : (task.owner ? [task.owner] : [])
  const comments = Array.isArray(task.comments) ? task.comments : []
  const progressVal = task.checked ? 100 : (task.status === 'working' ? 50 : 0)

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 999999,
        background: 'rgba(0,0,0,0.45)',
        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
        animation: 'fadeIn 0.15s ease',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: '#fff',
        borderRadius: 20,
        boxShadow: '0 24px 80px rgba(0,0,0,0.18)',
        width: '100%', maxWidth: 560,
        overflow: 'hidden',
        animation: 'slideUp 0.2s ease',
        maxHeight: '90vh',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header strip */}
        <div style={{
          background: `linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%)`,
          borderBottom: '1px solid #e8edf5',
          padding: '20px 24px 16px',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Status badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '4px 12px', borderRadius: 999,
                background: s.bg, color: s.color,
                fontSize: 15, fontWeight: 600,
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: s.dot }} />
                {s.label}
              </span>
              {task.tableName && (
                <span style={{
                  fontSize: 12, color: '#94a3b8',
                  background: '#f1f5f9', padding: '3px 10px', borderRadius: 999,
                  fontWeight: 500,
                }}>
                   {task.tableName}
                </span>
              )}
            </div>
            {/* Title */}
            <h2 style={{
              margin: 0, fontSize: 20, fontWeight: 700, color: '#0f172a',
              lineHeight: 1.3,
              textDecoration: task.checked ? 'line-through' : 'none',
              color: task.checked ? '#94a3b8' : '#0f172a',
            }}>
              {task.task}
            </h2>
          </div>
          <button onClick={onClose} style={{
            background: '#f1f5f9', border: 'none', borderRadius: 10,
            width: 34, height: 34, display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
            transition: 'background 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
            onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
          >
            <X size={16} color="#64748b" />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>

          {/* Progress bar */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Progress</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#2A7B9B' }}>{progressVal}%</span>
            </div>
            <div style={{ height: 8, background: '#e2e8f0', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 999,
                width: `${progressVal}%`,
                background: progressVal === 100
                  ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                  : 'linear-gradient(90deg, #2A7B9B, #57c785)',
                transition: 'width 0.6s ease',
              }} />
            </div>
          </div>

          {/* Info grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: 12, marginBottom: 20,
          }}>
            {/* Owner */}
            <InfoCard
              icon={<User size={14} />}
              label="Owner"
              value={owners.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {owners.map((o, i) => (
                    <span key={i} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      padding: '3px 10px', borderRadius: 999,
                      background: '#ede9fe', color: '#7c3aed',
                      fontSize: 12, fontWeight: 600,
                    }}>
                      <span style={{
                        width: 20, height: 20, borderRadius: '50%',
                        background: '#7c3aed', color: '#fff',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 10, fontWeight: 700,
                      }}>{o.charAt(0).toUpperCase()}</span>
                      {o}
                    </span>
                  ))}
                </div>
              ) : <span style={{ color: '#cbd5e1', fontSize: 12 }}>Unassigned</span>}
            />

            {/* Checked */}
            <InfoCard
              icon={<CheckSquare size={14} />}
              label="Completed"
              value={
                <span style={{
                  padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                  background: task.checked ? '#dcfce7' : '#f3f4f6',
                  color: task.checked ? '#16a34a' : '#6b7280',
                }}>
                  {task.checked ? '✓ Yes' : '✗ No'}
                </span>
              }
            />

            {/* Create date */}
            <InfoCard
              icon={<Calendar size={14} />}
              label="Created"
              value={<DateVal date={task.create_date} fallback="Not set" />}
            />

            {/* Due date */}
            <InfoCard
              icon={<Clock size={14} />}
              label="Due date"
              value={
                task.due_date ? (
                  <DueDateVal date={task.due_date} done={task.checked || task.status === 'done'} />
                ) : (
                  <span style={{ color: '#cbd5e1', fontSize: 12 }}>Not set</span>
                )
              }
            />

            {/* Pre-conditions */}
            {task.pre_conditions && (
              <div style={{ gridColumn: '1 / -1' }}>
                <InfoCard
                  icon={<Tag size={14} />}
                  label="Pre-conditions"
                  value={<span style={{ fontSize: 13, color: '#475569' }}>{task.pre_conditions}</span>}
                />
              </div>
            )}
          </div>

          {/* Comments */}
          {comments.length > 0 && (
            <div>
              <p style={{
                fontSize: 12, fontWeight: 600, color: '#64748b',
                textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10,
              }}>
                💬 Comments ({comments.length})
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {comments.map((c, i) => (
                  <div key={c.id || i} style={{
                    background: '#f8faff', borderRadius: 12,
                    padding: '10px 14px',
                    border: '1px solid #e8edf5',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: '50%',
                        background: 'linear-gradient(135deg,#667eea,#764ba2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: 10, fontWeight: 700,
                      }}>
                        {(c.author || 'U').charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{c.author || 'Unknown'}</span>
                      <span style={{ fontSize: 11, color: '#9ca3af', marginLeft: 'auto' }}>{c.timestamp || ''}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 13, color: '#475569', paddingLeft: 28, lineHeight: 1.5 }}>
                      {c.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          background: '#f8faff',
          borderTop: '1px solid #e8edf5',
          display: 'flex', justifyContent: 'flex-end',
        }}>
          <button onClick={onClose} style={{
            padding: '8px 20px', borderRadius: 10, border: 'none',
            background: 'linear-gradient(90deg, #2A7B9B, #57c785)',
            color: '#fff', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', transition: 'opacity 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

// small helper components
const InfoCard = ({ icon, label, value }) => (
  <div style={{
    background: '#f8faff', borderRadius: 12,
    padding: '12px 14px',
    border: '1px solid #e8edf5',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#94a3b8', marginBottom: 6 }}>
      {icon}
      <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
    </div>
    <div>{value}</div>
  </div>
)

const DateVal = ({ date, fallback }) => {
  if (!date) return <span style={{ color: '#cbd5e1', fontSize: 12 }}>{fallback}</span>
  return <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{date}</span>
}

const DueDateVal = ({ date, done }) => {
  const isOverdue = !done && new Date(date) < new Date()
  return (
    <span style={{
      fontSize: 13, fontWeight: 600,
      color: done ? '#16a34a' : isOverdue ? '#ef4444' : '#374151',
      display: 'flex', alignItems: 'center', gap: 4,
    }}>
      {isOverdue && <AlertCircle size={12} color="#ef4444" />}
      {date}
    </span>
  )
}

// ── Search Modal ──────────────────────────────────────────────────────────────
const SearchModal = ({ onClose }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') { if (selectedTask) setSelectedTask(null); else onClose() } }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, selectedTask])

  const doSearch = useCallback(async (q) => {
    if (!q.trim()) { setResults([]); return }
    setLoading(true)
    try {
      const { data } = await supabase
        .from('myteam_tasks')
        .select('id, task, status, owner, due_date, create_date, checked, pre_conditions, comments, table_id')
        .ilike('task', `%${q}%`)
        .eq('is_archived', false)
        .eq('is_trashed', false)
        .limit(20)

      const tableIds = [...new Set((data || []).map(t => t.table_id).filter(Boolean))]
      let tableNames = {}
      if (tableIds.length) {
        const { data: tables } = await supabase
          .from('myteam_tables').select('id, name').in('id', tableIds)
        tables?.forEach(t => { tableNames[t.id] = t.name })
      }
      setResults((data || []).map(t => ({ ...t, tableName: tableNames[t.table_id] || '' })))
    } finally { setLoading(false) }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => doSearch(query), 250)
    return () => clearTimeout(timer)
  }, [query, doSearch])

  if (selectedTask) {
    return <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} />
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, display: 'flex',
        alignItems: 'flex-start', justifyContent: 'center',
        paddingTop: 96, background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', zIndex: 999999,
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: '#fff', borderRadius: 18,
        boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
        width: '100%', maxWidth: 540, margin: '0 16px', overflow: 'hidden',
      }}>
        {/* Input */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '14px 16px', borderBottom: '1px solid #f3f4f6',
        }}>
          <Search size={18} color="#9ca3af" style={{ flexShrink: 0 }} />
          <input
            ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search tasks..."
            style={{
              flex: 1, fontSize: 14, color: '#1a1a1a',
              border: 'none', outline: 'none', background: 'transparent', fontFamily: 'inherit',
            }}
          />
          {loading && (
            <span style={{
              width: 16, height: 16, border: '2px solid #2A7B9B',
              borderTopColor: 'transparent', borderRadius: '50%',
              animation: 'spin 0.6s linear infinite', flexShrink: 0,
            }} />
          )}
          <button onClick={onClose} style={{ ...S.iconBtn, padding: 4 }}>
            <X size={16} color="#9ca3af" />
          </button>
        </div>

        {/* Results */}
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          {!query.trim() && (
            <div style={{ padding: '40px 16px', textAlign: 'center' }}>
              <Search size={28} color="#e5e7eb" style={{ margin: '0 auto 8px', display: 'block' }} />
              <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>Type to search tasks</p>
              <p style={{ fontSize: 12, color: '#d1d5db', marginTop: 4 }}>Click a result to view details</p>
            </div>
          )}
          {query.trim() && !loading && results.length === 0 && (
            <div style={{ padding: '40px 16px', textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>
                No tasks found for "<strong>{query}</strong>"
              </p>
            </div>
          )}
          {results.map(task => {
            const s = STATUS_CFG[task.status] || STATUS_CFG['not-started']
            return <SearchResultRow key={task.id} task={task} s={s} onSelect={() => setSelectedTask(task)} />
          })}
        </div>

        {results.length > 0 && (
          <div style={{
            padding: '10px 16px', borderTop: '1px solid #f3f4f6',
            background: '#fafafa', fontSize: 12, color: '#9ca3af',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span>{results.length} task{results.length > 1 ? 's' : ''} found</span>
            <span style={{ fontSize: 11, color: '#cbd5e1' }}>Click to view details</span>
          </div>
        )}
      </div>
    </div>
  )
}

const SearchResultRow = ({ task, s, onSelect }) => {
  const [hovered, setHovered] = useState(false)
  const owners = Array.isArray(task.owner) ? task.owner : (task.owner ? [task.owner] : [])

  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        width: '100%', padding: '12px 16px',
        background: hovered ? '#f0f7ff' : '#fff',
        border: 'none', borderBottom: '1px solid #f9fafb',
        cursor: 'pointer', textAlign: 'left', transition: 'background 0.12s',
      }}
    >
      {/* Status dot */}
      <div style={{
        width: 10, height: 10, borderRadius: '50%',
        background: s.dot, flexShrink: 0,
        boxShadow: `0 0 0 3px ${s.bg}`,
      }} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: 13, color: '#1a1a1a', fontWeight: 600, margin: 0,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          textDecoration: task.checked ? 'line-through' : 'none',
          color: task.checked ? '#94a3b8' : '#1a1a1a',
        }}>
          {task.task}
        </p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 3 }}>
          {task.tableName && (
            <span style={{ fontSize: 11, color: '#9ca3af' }}>📋 {task.tableName}</span>
          )}
          {owners.length > 0 && (
            <span style={{ fontSize: 11, color: '#9ca3af' }}>👤 {owners.join(', ')}</span>
          )}
          {task.due_date && (
            <span style={{ fontSize: 11, color: new Date(task.due_date) < new Date() && !task.checked ? '#ef4444' : '#9ca3af' }}>
              📅 {task.due_date}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <span style={{
          fontSize: 11, padding: '3px 10px', borderRadius: 999,
          fontWeight: 600, background: s.bg, color: s.color,
        }}>
          {s.label}
        </span>
        <ChevronRight size={14} color="#cbd5e1" />
      </div>
    </button>
  )
}

// ── Header ────────────────────────────────────────────────────────────────────
const Header = ({ stats }) => {
  const [showSearch, setShowSearch] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [inlineResults, setInlineResults] = useState([])
  const [inlineLoading, setInlineLoading] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  // Ctrl+K เปิด Search Modal
  useEffect(() => {
    const handler = e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setShowSearch(true) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus()
    else { setQuery(''); setInlineResults([]) }
  }, [searchOpen])

  // ── inline search query ─────────────────────────────────────────────────
  const doInlineSearch = useCallback(async (q) => {
    if (!q.trim()) { setInlineResults([]); return }
    setInlineLoading(true)
    try {
      const { data } = await supabase
        .from('myteam_tasks')
        .select('id, task, status, owner, due_date, create_date, checked, pre_conditions, comments, table_id')
        .ilike('task', `%${q}%`)
        .eq('is_archived', false)
        .eq('is_trashed', false)
        .limit(8)

      const tableIds = [...new Set((data || []).map(t => t.table_id).filter(Boolean))]
      let tableNames = {}
      if (tableIds.length) {
        const { data: tables } = await supabase.from('myteam_tables').select('id, name').in('id', tableIds)
        tables?.forEach(t => { tableNames[t.id] = t.name })
      }
      setInlineResults((data || []).map(t => ({ ...t, tableName: tableNames[t.table_id] || '' })))
    } finally { setInlineLoading(false) }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => doInlineSearch(query), 250)
    return () => clearTimeout(timer)
  }, [query, doInlineSearch])

  // close dropdown on outside click
  useEffect(() => {
    const handler = e => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setSearchOpen(false)
        setQuery('')
        setInlineResults([])
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { transform: translateY(16px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>

      {/* ── Navbar ── */}
      <nav style={S.navbar}>
        <div style={S.logo}>
          <img src="/logo.png" alt="ThamKap Phuean" style={S.logoImg} />
        </div>

        <div style={S.navActions}>
          <NotificationBell />

          {/* Inline search with dropdown */}
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              background: searchOpen ? '#f7f7f7' : 'none',
              borderRadius: 8, transition: 'all 0.2s ease',
              border: searchOpen ? '1.5px solid #c7d7e8' : '1.5px solid transparent',
            }}>
              <button
                style={S.iconBtn}
                title="Search (Ctrl+K)"
                onClick={() => setSearchOpen(o => !o)}
              >
                <Search size={20} color="#555" />
              </button>
              <div style={{ width: searchOpen ? 220 : 0, overflow: 'hidden', transition: 'width 0.2s ease' }}>
                <input
                  ref={inputRef} value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Escape') { setSearchOpen(false); setQuery(''); setInlineResults([]) } }}
                  placeholder="Search tasks..."
                  style={{
                    border: 'none', outline: 'none', background: 'transparent',
                    fontSize: 14, color: '#1a1a1a', fontFamily: 'inherit',
                    width: 200, padding: '0 8px 0 0',
                  }}
                />
              </div>
              {inlineLoading && searchOpen && (
                <span style={{
                  width: 14, height: 14, border: '2px solid #2A7B9B',
                  borderTopColor: 'transparent', borderRadius: '50%',
                  animation: 'spin 0.6s linear infinite', marginRight: 8, flexShrink: 0,
                }} />
              )}
            </div>

            {/* Inline dropdown results */}
            {searchOpen && query.trim() && (
              <div style={{
                position: 'absolute', top: '110%', right: 0,
                background: '#fff', borderRadius: 14,
                boxShadow: '0 12px 40px rgba(0,0,0,0.14)',
                border: '1px solid #e8edf5',
                width: 360, zIndex: 99999,
                overflow: 'hidden',
                animation: 'slideUp 0.15s ease',
              }}>
                {!inlineLoading && inlineResults.length === 0 && (
                  <div style={{ padding: '20px 16px', textAlign: 'center' }}>
                    <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>No results for "{query}"</p>
                  </div>
                )}
                {inlineResults.map(task => {
                  const s = STATUS_CFG[task.status] || STATUS_CFG['not-started']
                  const owners = Array.isArray(task.owner) ? task.owner : (task.owner ? [task.owner] : [])
                  return (
                    <InlineResultRow
                      key={task.id} task={task} s={s} owners={owners}
                      onSelect={() => {
                        setSelectedTask(task)
                        setSearchOpen(false)
                        setQuery('')
                        setInlineResults([])
                      }}
                    />
                  )
                })}
                {inlineResults.length > 0 && (
                  <div style={{
                    padding: '8px 14px', borderTop: '1px solid #f1f5f9',
                    background: '#fafbff', fontSize: 11, color: '#94a3b8',
                    display: 'flex', justifyContent: 'space-between',
                  }}>
                    <span>{inlineResults.length} result{inlineResults.length > 1 ? 's' : ''}</span>
                    <button
                      onClick={() => { setShowSearch(true); setSearchOpen(false) }}
                      style={{
                        background: 'none', border: 'none', color: '#2A7B9B',
                        fontSize: 11, fontWeight: 600, cursor: 'pointer', padding: 0,
                      }}
                    >
                      Open full search →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={S.divider} />
          <span style={S.accountLabel}>Account</span>
          <div style={S.avatarCircle}><UserIcon /></div>
        </div>
      </nav>

      {/* Full Search Modal (Ctrl+K) */}
      {showSearch && <SearchModal onClose={() => setShowSearch(false)} />}

      {/* Task Detail Modal */}
      {selectedTask && <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} />}
    </>
  )
}

const InlineResultRow = ({ task, s, owners, onSelect }) => {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        width: '100%', padding: '10px 14px',
        background: hovered ? '#f0f7ff' : '#fff',
        border: 'none', borderBottom: '1px solid #f9fafb',
        cursor: 'pointer', textAlign: 'left', transition: 'background 0.1s',
      }}
    >
      <div style={{
        width: 9, height: 9, borderRadius: '50%', background: s.dot,
        flexShrink: 0, boxShadow: `0 0 0 3px ${s.bg}`,
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: 13, fontWeight: 600, margin: 0,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          color: task.checked ? '#94a3b8' : '#1a1a1a',
          textDecoration: task.checked ? 'line-through' : 'none',
        }}>{task.task}</p>
        <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
          {task.tableName && <span style={{ fontSize: 11, color: '#9ca3af' }}>{task.tableName}</span>}
          {owners.length > 0 && <span style={{ fontSize: 11, color: '#9ca3af' }}>· {owners[0]}</span>}
        </div>
      </div>
      <span style={{
        fontSize: 11, padding: '2px 8px', borderRadius: 999,
        background: s.bg, color: s.color, fontWeight: 600, flexShrink: 0,
      }}>{s.label}</span>
    </button>
  )
}

export default Header