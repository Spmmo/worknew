import React, { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFile } from '@fortawesome/free-solid-svg-icons'
import FilterPanel from './Filterpanel'

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

const styles = {
  card: { background: '#fff', borderRadius: '14px', padding: '16px', position: 'relative' },
  toolbar: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' },
  searchBox: {
    flex: 1, display: 'flex', alignItems: 'center', gap: '8px',
    background: '#f5f5f5', borderRadius: '8px', padding: '8px 12px',
    border: '1.5px solid transparent', transition: 'border-color 0.2s',
  },
  searchInput: {
    border: 'none', background: 'transparent', outline: 'none',
    fontSize: '13px', color: '#333', flex: 1,
  },
  btn: {
    display: 'flex', alignItems: 'center', gap: '5px',
    padding: '8px 14px', borderRadius: '8px', border: '1px solid #ddd',
    background: '#fff', fontSize: '13px', cursor: 'pointer', color: '#555', fontWeight: '500',
    transition: 'all 0.15s',
  },
  tableHeader: {
    display: 'grid', gridTemplateColumns: '120px 1fr 130px 130px',
    padding: '6px 10px', fontSize: '11px', fontWeight: '700', color: '#aaa',
    letterSpacing: '0.5px', textTransform: 'uppercase',
    borderBottom: '1px solid #f0f0f0', marginBottom: '4px',
  },
  row: {
    display: 'grid', gridTemplateColumns: '120px 1fr 130px 130px',
    padding: '10px 10px', alignItems: 'center',
    borderBottom: '1px solid #f8f8f8', cursor: 'pointer', borderRadius: '8px',
    transition: 'background 0.12s',
  },
  avatar: {
    width: '30px', height: '30px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '700', fontSize: '13px', color: '#fff', flexShrink: 0,
  },
  taskName: { fontWeight: '600', fontSize: '13px', color: '#2a2a4a' },
  fileName: {
    fontSize: '11px', color: '#999', marginTop: '2px',
    display: 'flex', alignItems: 'center', gap: '4px',
  },
  badge: {
    display: 'inline-block', padding: '4px 12px',
    borderRadius: '20px', fontSize: '11px', fontWeight: '600',
  },
  loadMore: {
    textAlign: 'center', padding: '12px', fontSize: '13px',
    color: '#888', cursor: 'pointer', borderTop: '1px solid #f0f0f0', marginTop: '6px',
  },
  chip: {
    display: 'inline-flex', alignItems: 'center', gap: '5px',
    padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '600',
    background: '#f0f0ff', color: '#5a5fff', border: '1px solid #e0e0ff',
  },
}

const AVATAR_COLORS = [
  '#5a5fff', '#7c4dff', '#26c6da', '#ef5350', '#ab47bc',
  '#5c6bc0', '#26a69a', '#ff7043', '#42a5f5', '#66bb6a',
  '#ffa726', '#ec407a', '#8d6e63', '#78909c',
]
const colorCache = {}
const getAvatarColor = (name = '') => {
  if (!colorCache[name]) {
    let h = 0
    for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
    colorCache[name] = AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
  }
  return colorCache[name]
}

function statusStyle(status) {
  if (status === 'Approved')        return { color: '#4caf50', background: '#e8f5e9' }
  if (status === 'Revision Needed') return { color: '#f44336', background: '#fce4ec' }
  return                                   { color: '#ff9800', background: '#fff3e0' }
}

const PRIORITY_TO_STATUS = {
  high:     'Pending',
  low:      'Approved',
  revision: 'Revision Needed',
}
const PRIORITY_LABEL = { high: 'High Priority', low: 'Low Priority', revision: 'Needs Revision' }
const DUE_LABEL      = { today: 'Due today', week: 'Due this week', month: 'Due this month' }

export default function SubmissionTable({ submissions = [], selectedId, onSelectRow }) {
  const [search, setSearch]         = useState('')
  const [showFilter, setShowFilter] = useState(false)
  const [filters, setFilters]       = useState({ priority: [], dueDate: [], group: [] })

  const groups = [...new Set(submissions.map(s => s.name).filter(Boolean))].sort()

  const activeCount =
    (filters.priority?.length || 0) +
    (filters.dueDate?.length  || 0) +
    (filters.group?.length    || 0)

  const activeStatuses = (filters.priority || []).map(k => PRIORITY_TO_STATUS[k]).filter(Boolean)
  const activeMembers  = filters.group || []

  const filtered = submissions.filter(s => {
    const q = search.trim().toLowerCase()
    const matchSearch = !q ||
      s.name?.toLowerCase().includes(q) ||
      s.task?.toLowerCase().includes(q) ||
      (s.file || '').toLowerCase().includes(q)
    const matchStatus = !activeStatuses.length || activeStatuses.includes(s.status)
    const matchMember = !activeMembers.length  || activeMembers.includes(s.name)
    return matchSearch && matchStatus && matchMember
  })

  const removeFilter = (key, value) =>
    setFilters(f => ({ ...f, [key]: (f[key] || []).filter(v => v !== value) }))

  const clearAll = () => setFilters({ priority: [], dueDate: [], group: [] })

  return (
    <div style={styles.card}>
      <div style={styles.toolbar}>
        <div style={{ ...styles.searchBox, borderColor: search ? '#5a5fff' : 'transparent' }}>
          <Search size={14} color={search ? '#5a5fff' : '#aaa'} />
          <input
            style={styles.searchInput}
            placeholder="Search submission, member, or task"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: '#aaa', padding: 0 }}>
              <X size={13} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilter(o => !o)}
          style={{
            ...styles.btn,
            borderColor: showFilter || activeCount > 0 ? '#5a5fff' : '#ddd',
            color:        activeCount > 0 ? '#5a5fff' : '#555',
            background:   activeCount > 0 ? '#f0f0ff' : '#fff',
          }}
        >
          <Filter size={14} />
          Filter
          {activeCount > 0 && (
            <span style={{ background: '#5a5fff', color: '#fff', borderRadius: 20, fontSize: 10, fontWeight: 700, padding: '1px 6px', marginLeft: 2 }}>
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {activeCount > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
          {(filters.priority || []).map(k => (
            <span key={k} style={styles.chip}>
              {PRIORITY_LABEL[k]}
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: '#5a5fff', padding: 0 }} onClick={() => removeFilter('priority', k)}>
                <X size={11} />
              </button>
            </span>
          ))}
          {(filters.dueDate || []).map(k => (
            <span key={k} style={styles.chip}>
              {DUE_LABEL[k]}
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: '#5a5fff', padding: 0 }} onClick={() => removeFilter('dueDate', k)}>
                <X size={11} />
              </button>
            </span>
          ))}
          {(filters.group || []).map(g => (
            <span key={g} style={styles.chip}>
              👤 {g}
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', color: '#5a5fff', padding: 0 }} onClick={() => removeFilter('group', g)}>
                <X size={11} />
              </button>
            </span>
          ))}
          <button onClick={clearAll} style={{ fontSize: 11, color: '#aaa', background: 'none', border: 'none', cursor: 'pointer', padding: '3px 6px' }}>
            Clear all
          </button>
        </div>
      )}

      <div style={styles.tableHeader}>
        <span>MEMBER</span>
        <span>TASK / FILE</span>
        <span>SUBMITTED</span>
        <span>STATUS</span>
      </div>

      {filtered.map((s, i) => (
        <div
          key={s.id}
          style={{
            ...styles.row,
            background: selectedId === s.id ? '#f0f1ff' : i % 2 === 0 ? 'transparent' : '#fafafa',
          }}
          onClick={() => onSelectRow(s.id)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ ...styles.avatar, background: getAvatarColor(s.name) }}>
              {(s.initials || s.name?.charAt(0) || '?').toUpperCase()}
            </div>
            <span style={{ fontSize: '13px', fontWeight: '500', color: '#444' }}>{s.name}</span>
          </div>

          <div>
            <div style={styles.taskName}>{s.task}</div>
            <div style={styles.fileName}>
              <FontAwesomeIcon icon={faFile} style={{ color: getFileIconColor(s.file), fontSize: '11px' }} />
              <span>{s.file || '—'}</span>
              {s.size && s.size !== '—' && (
                <><span style={{ color: '#ccc' }}>•</span><span>{s.size}</span></>
              )}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '12px', color: '#555' }}>{s.submittedAgo}</div>
            <div style={{ fontSize: '11px', color: '#bbb' }}>{s.submittedDate}</div>
          </div>

          <span style={{ ...styles.badge, ...statusStyle(s.status) }}>
            {s.status === 'Approved' ? '✓ Approved' : s.status}
          </span>
        </div>
      ))}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '32px 20px' }}>
          <Search size={28} style={{ margin: '0 auto 8px', display: 'block', color: '#ddd' }} />
          <p style={{ fontSize: 13, fontWeight: 600, color: '#bbb', margin: 0 }}>No results found</p>
          {(search || activeCount > 0) && (
            <button onClick={() => { setSearch(''); clearAll() }}
              style={{ marginTop: 8, fontSize: 12, color: '#5a5fff', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              Clear search & filters
            </button>
          )}
        </div>
      )}

      <div style={{ ...styles.loadMore, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, color: '#ccc' }}>
          {filtered.length} / {submissions.length} result{submissions.length !== 1 ? 's' : ''}
        </span>
        <span>Load more submissions</span>
        <span style={{ width: 80 }} />
      </div>

      {showFilter && (
        <FilterPanel
          groups={groups}
          filters={filters}
          onChange={setFilters}
          onClear={clearAll}
          onClose={() => setShowFilter(false)}
        />
      )}
    </div>
  )
}