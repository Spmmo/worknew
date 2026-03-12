import React, { useState, useEffect, useRef } from 'react'
import { supabase } from '../../supabaseClient'
import { ChevronDown, Check } from 'lucide-react'

const STATUS = {
  all:           { label: 'All Status',    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)', dot: '#6366f1' },
  'not-started': { label: 'Not Started',   gradient: 'linear-gradient(135deg, #f87171, #ef4444)', dot: '#f87171' },
  'working':     { label: 'Working on it', gradient: 'linear-gradient(135deg, #f59e0b, #f97316)', dot: '#f59e0b' },
  'done':        { label: 'Done',          gradient: 'linear-gradient(135deg, #10b981, #06b6d4)', dot: '#10b981' },
}
const STATUS_KEYS = ['all', 'not-started', 'working', 'done']

const StatusSlider = ({ value, onChange }) => {
  const idx = STATUS_KEYS.indexOf(value)
  const pct = (idx / (STATUS_KEYS.length - 1)) * 100
  const cfg = STATUS[value]
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        {STATUS_KEYS.map(k => (
          <button key={k} onClick={() => onChange(k)} style={{
            fontSize: 15, fontWeight: value === k ? 700 : 400,
            color: value === k ? STATUS[k].dot : '#9ca3af',
            background: 'none', border: 'none', cursor: 'pointer',
            transition: 'color 0.2s', padding: '2px 0', letterSpacing: '-0.2px',
          }}>{STATUS[k].label}</button>
        ))}
      </div>
      <div style={{ position: 'relative', height: 14, borderRadius: 999, background: '#f1f5f9', cursor: 'pointer' }}
        onClick={e => {
          const rect = e.currentTarget.getBoundingClientRect()
          const i = Math.round((e.clientX - rect.left) / rect.width * (STATUS_KEYS.length - 1))
          onChange(STATUS_KEYS[Math.max(0, Math.min(i, STATUS_KEYS.length - 1))])
        }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, borderRadius: 999, background: cfg.gradient, transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)' }} />
        <div style={{ position: 'absolute', top: '50%', left: `${pct}%`, transform: 'translate(-50%,-50%)', width: 22, height: 22, borderRadius: '50%', background: cfg.gradient, boxShadow: `0 0 0 3px white, 0 0 0 5px ${cfg.dot}44`, transition: 'left 0.3s cubic-bezier(0.4,0,0.2,1)', zIndex: 2 }} />
      </div>
    </div>
  )
}

const MemberSlider = ({ members, value, onChange }) => {
  const all = [{ id: 'all', name: 'All Members' }, ...members]
  const idx = Math.max(0, all.findIndex(m => (value === null ? 'all' : value) === (m.id === 'all' ? 'all' : m.id)))
  const pct = all.length > 1 ? (idx / (all.length - 1)) * 100 : 0
  const gradient = 'linear-gradient(135deg, #3b82f6, #6366f1)'
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, gap: 4 }}>
        {all.map(m => (
          <button key={m.id} onClick={() => onChange(m.id === 'all' ? null : m.id)} style={{
            fontSize: 15, fontWeight: (value === null ? m.id === 'all' : value === m.id) ? 700 : 400,
            color: (value === null ? m.id === 'all' : value === m.id) ? '#3b82f6' : '#9ca3af',
            background: 'none', border: 'none', cursor: 'pointer',
            flex: 1, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{m.name.split(' ')[0]}</button>
        ))}
      </div>
      <div style={{ position: 'relative', height: 14, borderRadius: 999, background: '#f1f5f9', cursor: 'pointer' }}
        onClick={e => {
          const rect = e.currentTarget.getBoundingClientRect()
          const i = Math.round((e.clientX - rect.left) / rect.width * (all.length - 1))
          const m = all[Math.max(0, Math.min(i, all.length - 1))]
          onChange(m.id === 'all' ? null : m.id)
        }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct}%`, borderRadius: 999, background: gradient, transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)' }} />
        <div style={{ position: 'absolute', top: '50%', left: `${pct}%`, transform: 'translate(-50%,-50%)', width: 22, height: 22, borderRadius: '50%', background: gradient, boxShadow: '0 0 0 3px white, 0 0 0 5px rgba(59,130,246,0.3)', transition: 'left 0.3s cubic-bezier(0.4,0,0.2,1)', zIndex: 2 }} />
      </div>
    </div>
  )
}

const TEAM_COLORS = [
  'linear-gradient(135deg, #6366f1, #8b5cf6)',
  'linear-gradient(135deg, #f59e0b, #f97316)',
  'linear-gradient(135deg, #10b981, #06b6d4)',
  'linear-gradient(135deg, #f87171, #ef4444)',
  'linear-gradient(90deg, rgba(42,123,155,1) 0%, rgba(87,199,133,1) 100%)',
]

const TeamDropdown = ({ teams, selectedTeam, onChange }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        display: 'flex', alignItems: 'center', gap: 10,
        height: '2.6rem', padding: '0 18px', borderRadius: 10,
        border: `1.5px solid ${open ? '#2A7B9B' : '#e2e8f0'}`,
        background: selectedTeam
          ? 'linear-gradient(90deg, rgba(42,123,155,1) 0%, rgba(87,199,133,1) 100%)'
          : '#fff',
        color: selectedTeam ? '#fff' : '#374151',
        cursor: 'pointer', fontSize: 14, fontWeight: 600,
        boxShadow: open ? '0 0 0 3px rgba(42,123,155,0.2)' : '0 1px 4px rgba(0,0,0,0.06)',
        transition: 'all 0.2s',
      }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: selectedTeam ? 'rgba(255,255,255,0.7)' : '#cbd5e1' }} />
        {selectedTeam ? selectedTeam.name : 'All Teams'}
        <ChevronDown size={15} style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', opacity: 0.7 }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: 0,
          minWidth: 240, background: '#fff',
          border: '1.5px solid #e2e8f0', borderRadius: 12,
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          zIndex: 9999, overflow: 'hidden',
        }}>
          <style>{`@keyframes dropIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>

          {/* All Teams */}
          <button onClick={() => { onChange(null); setOpen(false) }} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 16px', border: 'none', cursor: 'pointer', textAlign: 'left',
            background: !selectedTeam ? '#f0fdf4' : '#fff',
            borderBottom: '1px solid #f1f5f9',
            fontSize: 14, fontWeight: !selectedTeam ? 700 : 500,
            color: !selectedTeam ? '#16a34a' : '#374151',
          }}>
            <span style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #94a3b8, #64748b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#fff', flexShrink: 0 }}>All</span>
            <span style={{ flex: 1 }}>All Teams</span>
            {!selectedTeam && <Check size={14} color="#16a34a" />}
          </button>

          {/* Each team */}
          {teams.map((team, i) => {
            const isActive = selectedTeam?.id === team.id
            return (
              <button key={team.id} onClick={() => { onChange(team); setOpen(false) }} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 16px', border: 'none', cursor: 'pointer', textAlign: 'left',
                background: isActive ? '#eff6ff' : '#fff',
                borderBottom: i < teams.length - 1 ? '1px solid #f1f5f9' : 'none',
                fontSize: 14, fontWeight: isActive ? 700 : 500,
                color: isActive ? '#2563eb' : '#374151',
              }}>
                <span style={{ width: 30, height: 30, borderRadius: '50%', background: TEAM_COLORS[i % TEAM_COLORS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                  {team.name.charAt(0).toUpperCase()}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{team.name}</p>
                  <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>{team.members.length} members</p>
                </div>
                {isActive && <Check size={14} color="#2563eb" />}
              </button>
            )
          })}

          {teams.length === 0 && (
            <div style={{ padding: 16, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>No teams found</div>
          )}
        </div>
      )}
    </div>
  )
}

const TaskRow = ({ task }) => {
  const [hovered, setHovered] = useState(false)
  const s = STATUS[task.status] || STATUS['not-started']
  const owners = Array.isArray(task.owner) ? task.owner : (task.owner ? [task.owner] : [])
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px',
      background: hovered ? '#f8faff' : '#fff',
      border: '1px solid', borderColor: hovered ? '#c7d2fe' : '#e5e7eb',
      borderRadius: 12, transition: 'all 0.15s',
      boxShadow: hovered ? '0 4px 12px rgba(99,102,241,0.08)' : '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      <div style={{ width: 10, height: 10, borderRadius: '50%', flexShrink: 0, background: s.gradient, boxShadow: `0 0 6px ${s.dot}66` }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{task.task}</p>
        {task.tableName && <p style={{ margin: '2px 0 0', fontSize: 12, color: '#94a3b8' }}>in {task.tableName}</p>}
      </div>
      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
        {owners.length === 0
          ? <span style={{ fontSize: 12, color: '#cbd5e1' }}>Unassigned</span>
          : owners.slice(0, 3).map((name, i) => (
              <div key={i} title={name} style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', border: '2px solid white' }}>
                {name.charAt(0).toUpperCase()}
              </div>
            ))
        }
      </div>
      <div style={{ flexShrink: 0 }}>
        {task.dueDate
          ? <span style={{ fontSize: 12, color: '#64748b', background: '#f1f5f9', padding: '3px 8px', borderRadius: 6 }}>{task.dueDate}</span>
          : <span style={{ fontSize: 12, color: '#cbd5e1' }}>No due date</span>}
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, padding: '4px 10px', borderRadius: 999, background: s.gradient, color: '#fff', flexShrink: 0, boxShadow: `0 2px 6px ${s.dot}44` }}>
        {s.label}
      </span>
    </div>
  )
}

const TasksView = () => {
  const [allTasks, setAllTasks]     = useState([])
  const [allMembers, setAllMembers] = useState([])
  const [teams, setTeams]           = useState([])
  const [selectedTeam,   setSelectedTeam]   = useState(null)
  const [filterStatus,   setFilterStatus]   = useState('all')
  const [selectedMember, setSelectedMember] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      const [
        { data: tasksData },
        { data: membersData },
        { data: tablesData },
        { data: teamsData },
      ] = await Promise.all([
        supabase.from('myteam_tasks').select('*').eq('is_archived', false).eq('is_trashed', false),
        supabase.from('team_members').select('id, name, email, role, team_id'),
        supabase.from('myteam_tables').select('id, name'),
        supabase.from('teams').select('id, name, team_members(id, name, email, role)').order('created_at', { ascending: true }),
      ])

      const nameMap = {}
      ;(tablesData || []).forEach(t => { nameMap[t.id] = t.name })
      setAllMembers(membersData || [])
      setTeams((teamsData || []).map(t => ({ id: t.id, name: t.name, members: t.team_members || [] })))
      setAllTasks((tasksData || []).map(t => ({
        ...t,
        dueDate: t.due_date || t.dueDate || '',
        tableName: nameMap[t.table_id] || '',
      })))
      setLoading(false)
    }
    fetchAll()
  }, [])

  const handleTeamChange = (team) => {
    setSelectedTeam(team)
    setSelectedMember(null)
    setFilterStatus('all')
  }

  const teamMemberNames = selectedTeam ? selectedTeam.members.map(m => m.name) : null
  const visibleMembers  = selectedTeam ? selectedTeam.members : allMembers
  const visibleTasks    = selectedTeam
    ? allTasks.filter(t => {
        const owners = Array.isArray(t.owner) ? t.owner : (t.owner ? [t.owner] : [])
        return owners.some(o => teamMemberNames.includes(o))
      })
    : allTasks

  const selectedMemberData = visibleMembers.find(m => m.id === selectedMember)
  const filtered = visibleTasks.filter(t => {
    const statusOk = filterStatus === 'all' || t.status === filterStatus
    const memberOk = !selectedMember || (
      Array.isArray(t.owner) ? t.owner.includes(selectedMemberData?.name) : t.owner === selectedMemberData?.name
    )
    return statusOk && memberOk
  })

  const counts = {
    all: visibleTasks.length,
    'not-started': visibleTasks.filter(t => t.status === 'not-started').length,
    'working':     visibleTasks.filter(t => t.status === 'working').length,
    'done':        visibleTasks.filter(t => t.status === 'done').length,
  }
  const memberTasks = selectedMember
    ? visibleTasks.filter(t => Array.isArray(t.owner) ? t.owner.includes(selectedMemberData?.name) : t.owner === selectedMemberData?.name)
    : visibleTasks

  return (
    <div style={{ padding: '24px 28px', fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif' }}>

      {/* Filter Panel */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', padding: '28px 32px', marginBottom: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>

        {/* Team row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid #f1f5f9' }}>
          <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1e293b', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Team</p>
          <TeamDropdown teams={teams} selectedTeam={selectedTeam} onChange={handleTeamChange} />
          {selectedTeam && (
            <span style={{ fontSize: 13, color: '#94a3b8' }}>
              {visibleTasks.length} tasks · {visibleMembers.length} members
            </span>
          )}
        </div>

        {/* Sliders */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1e293b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Filter by Status</p>
              <span style={{ fontSize: 13, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: STATUS[filterStatus].gradient, color: '#fff' }}>{counts[filterStatus]} tasks</span>
            </div>
            <StatusSlider value={filterStatus} onChange={setFilterStatus} />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1e293b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Filter by Member</p>
              <span style={{ fontSize: 13, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#fff' }}>{memberTasks.length} tasks</span>
            </div>
            <MemberSlider members={visibleMembers} value={selectedMember} onChange={setSelectedMember} />
          </div>
        </div>

        {/* Active filters */}
        {(filterStatus !== 'all' || selectedMember || selectedTeam) && (
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14, color: '#94a3b8' }}>Showing:</span>
            {selectedTeam && <span style={{ fontSize: 14, fontWeight: 600, padding: '2px 10px', borderRadius: 999, background: 'linear-gradient(90deg, rgba(42,123,155,1) 0%, rgba(87,199,133,1) 100%)', color: '#fff' }}>{selectedTeam.name}</span>}
            {filterStatus !== 'all' && <span style={{ fontSize: 14, fontWeight: 600, padding: '2px 10px', borderRadius: 999, background: STATUS[filterStatus].gradient, color: '#fff' }}>{STATUS[filterStatus].label}</span>}
            {selectedMemberData && <span style={{ fontSize: 14, fontWeight: 600, padding: '2px 10px', borderRadius: 999, background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: '#fff' }}>{selectedMemberData.name}</span>}
            <button onClick={() => { setSelectedTeam(null); setFilterStatus('all'); setSelectedMember(null) }}
              style={{ fontSize: 14, color: '#94a3b8', background: 'none', border: '1px solid #e2e8f0', borderRadius: 999, padding: '2px 10px', cursor: 'pointer', marginLeft: 'auto' }}>
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Member spotlight */}
      {selectedMemberData && (
        <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)', borderRadius: 16, padding: '20px 24px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20, color: '#fff', boxShadow: '0 8px 24px rgba(99,102,241,0.25)' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', border: '2px solid rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700 }}>
            {selectedMemberData.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{selectedMemberData.name}</p>
            <p style={{ margin: '2px 0 0', fontSize: 14, opacity: 0.75 }}>{selectedMemberData.email}</p>
          </div>
          {['done','working','not-started'].map(s => (
            <div key={s} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '8px 16px' }}>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>{memberTasks.filter(t => t.status === s).length}</p>
              <p style={{ margin: '2px 0 0', fontSize: 11, opacity: 0.8 }}>{STATUS[s].label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Results header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1e293b' }}>{filtered.length} task{filtered.length !== 1 ? 's' : ''} found</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          {['not-started','working','done'].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: STATUS[s].gradient }} />
              <span style={{ fontSize: 14, color: '#64748b' }}>{filtered.filter(t => t.status === s).length} {STATUS[s].label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Task list */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
          <div style={{ width: 32, height: 32, border: '3px solid #e5e7eb', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          Loading tasks...
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb', color: '#94a3b8' }}>
          <p style={{ margin: 0, fontWeight: 600, fontSize: 16 }}>No tasks found</p>
          <p style={{ margin: '6px 0 0', fontSize: 13 }}>Try adjusting filters or selecting a different team</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered.map(task => <TaskRow key={task.id} task={task} />)}
        </div>
      )}
    </div>
  )
}

export default TasksView