import React, { useState, useMemo, useEffect, useCallback, createContext, useContext } from 'react';
import { Shield, User } from 'lucide-react';
import Header from './components/workload/Header';
import NavigationTabs from './components/workload/NavigationTabs';
import TasksView from './components/workload/TasksView';
import { supabase } from './supabaseClient';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Admin assignment components
import TeamStatus from './components/assignment/TeamStatus';
import ReviewStats from './components/assignment/ReviewStats';
import MemberWorkload from './components/assignment/MemberWorkload';
import ReviewBottleneck from './components/assignment/ReviewBottleneck';
import SubmissionTable from './components/assignment/SubmissionTable';
import ReviewWork from './components/assignment/ReviewWork';
import { useAppStore } from './store/useAppStore';

// Member assignment components
import AssignmentPage from './components/assignment/Assignmentpage';
import TaskDetail from './components/assignment/TaskDetail';
import { useTasks } from './hooks/useTasks';

// ── Role Context ───────────────────────────────────────────────────────────────
export const RoleContext = createContext({ role: 'admin', setRole: () => {} });
export const useRole = () => useContext(RoleContext);

// ── อ่าน teamId จาก URL (ส่งมาจาก myteam) ────────────────────────────────────
function getTeamIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('teamId') || null;
}

const mapStatus = (s) => {
  if (s === 'done')    return 'completed';
  if (s === 'working') return 'in-progress';
  return 'pending';
};

const assignmentStyles = {
  body:        { display: 'flex', gap: '16px', padding: '20px 24px', flex: 1 },
  contentArea: { background: '#edf0fc', borderRadius: '20px', padding: '22px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' },
  topRow:      { display: 'flex', gap: '14px' },
}

// ── Team Dropdown ──────────────────────────────────────────────────────────────
const TEAM_COLORS = ['#8b5cf6','#f59e0b','#10b981','#3b82f6','#ef4444','#ec4899']

function TeamDropdown({ teams, selectedTeamId, onChange }) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef(null)

  React.useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selectedTeam = teams.find(t => t.id === selectedTeamId)
  const selectedColor = selectedTeam ? TEAM_COLORS[teams.indexOf(selectedTeam) % TEAM_COLORS.length] : '#9ca3af'

  return (
    <div style={{ padding: '10px 24px', background: '#fff', borderBottom: '1px solid #ebebeb', display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: '#6b7280' }}>View team:</span>
      <div ref={ref} style={{ position: 'relative' }}>
        <button onClick={() => setOpen(o => !o)} style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', borderRadius: 12,
          border: `2px solid ${open ? selectedColor : '#e5e7eb'}`, background: '#fff', cursor: 'pointer',
          fontFamily: 'inherit', minWidth: 160, transition: 'all 0.2s',
          boxShadow: open ? `0 0 0 3px ${selectedColor}22` : 'none',
        }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: selectedColor, flexShrink: 0 }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: '#374151', flex: 1, textAlign: 'left' }}>
            {selectedTeam ? selectedTeam.name : 'All Teams'}
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', flexShrink: 0 }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        {open && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 8px)', left: 0, background: '#fff', borderRadius: 16,
            boxShadow: '0 12px 40px rgba(0,0,0,0.15)', border: '1px solid #f3f4f6',
            minWidth: 220, zIndex: 9999, overflow: 'hidden',
          }}>
            <button onClick={() => { onChange(null); setOpen(false) }} style={{
              display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '12px 16px',
              background: !selectedTeamId ? '#f0fdf4' : '#fff', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', borderBottom: '1px solid #f9fafb', transition: 'background 0.15s',
            }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #9ca3af, #6b7280)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>All</div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: !selectedTeamId ? '#16a34a' : '#374151' }}>All Teams</div>
              </div>
              {!selectedTeamId && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
            </button>
            {teams.map((team, i) => {
              const color = TEAM_COLORS[i % TEAM_COLORS.length]
              const isSelected = selectedTeamId === team.id
              return (
                <button key={team.id} onClick={() => { onChange(team.id); setOpen(false) }} style={{
                  display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: '12px 16px',
                  background: isSelected ? '#f5f3ff' : '#fff', border: 'none', cursor: 'pointer',
                  fontFamily: 'inherit', borderBottom: i < teams.length - 1 ? '1px solid #f9fafb' : 'none',
                  transition: 'background 0.15s',
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{team.name.charAt(0).toUpperCase()}</div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: isSelected ? color : '#374151' }}>{team.name}</div>
                    {team.memberCount != null && <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 1 }}>{team.memberCount} members</div>}
                  </div>
                  {isSelected && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Admin Assignments View ─────────────────────────────────────────────────────
function AdminAssignmentsView() {
  const urlTeamId = getTeamIdFromUrl()
  const [teams, setTeams] = useState([])
  const [selectedTeamId, setSelectedTeamId] = useState(urlTeamId)

  useEffect(() => {
    const fetchTeams = async () => {
      const { data: teamsData } = await supabase.from('teams').select('id, name').order('created_at')
      if (!teamsData) return
      const teamsWithCount = await Promise.all(teamsData.map(async team => {
        const { count } = await supabase
          .from('team_members').select('id', { count: 'exact', head: true }).eq('team_id', team.id)
        return { ...team, memberCount: count || 0 }
      }))
      setTeams(teamsWithCount)
    }
    fetchTeams()
  }, [])

  const store = useAppStore(selectedTeamId)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <TeamDropdown teams={teams} selectedTeamId={selectedTeamId} onChange={id => setSelectedTeamId(id)} />
      {store.loading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 36, height: 36, border: '3px solid #6c7aff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 10px' }} />
            <p style={{ fontSize: 13, color: '#999' }}>Loading submissions...</p>
          </div>
        </div>
      ) : (
        <div style={assignmentStyles.body}>
          <TeamStatus memberStatuses={store.memberStatuses} submissions={store.submissions} />
          <div style={assignmentStyles.contentArea}>
            <ReviewStats stats={store.stats} />
            <div style={assignmentStyles.topRow}>
              <MemberWorkload workloads={store.workloads} />
              <ReviewBottleneck bottlenecks={store.bottlenecks} showModal={store.showBottleneckModal} setShowModal={store.setShowBottleneckModal} />
            </div>
            <SubmissionTable submissions={store.submissions} selectedId={store.selectedId} onSelectRow={store.setSelectedId} onBatchApprove={store.batchApprove} />
          </div>
          <ReviewWork
            submission={store.selectedSubmission} onApprove={store.approveSubmission}
            onRevision={store.requestRevision} feedback={store.feedback} setFeedback={store.setFeedback}
          />
        </div>
      )}
    </div>
  )
}

// ── Member Assignments View ────────────────────────────────────────────────────
function MemberAssignmentsView() {
  const urlTeamId = getTeamIdFromUrl()
  const {
    tasks, loading, error,
    handleStartTask, handleSubmitWork, handleStartNow,
    handleRequestExtension, handleApproveExtension,
    handleReturnForRevision, fetchComments, addComment,
  } = useTasks(urlTeamId)

  const [teams, setTeams] = useState([])
  const [selectedTeamId, setSelectedTeamId] = useState(urlTeamId)
  const [selectedTask, setSelectedTask] = useState(null)
  const [activeTab, setActiveTab] = useState('Upcoming')
  const [toast, setToast] = useState(null)

  useEffect(() => {
    const fetchTeams = async () => {
      const { data } = await supabase.from('teams').select('id, name').order('created_at')
      setTeams(data || [])
    }
    fetchTeams()
  }, [])

  const showToast = (msg, type = 'info') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const onStartTask = async (task) => {
    await handleStartTask(task)
    showToast('Task started! Status: In Progress.', 'success')
    setSelectedTask(prev => prev?.id === task.id ? { ...prev, statusKey: 'in-progress' } : prev)
  }

  const onSubmitWork = async (taskId, submittedFiles) => {
    await handleSubmitWork(taskId, submittedFiles)
    setSelectedTask(null)
    setActiveTab('Completed')
    showToast('Work submitted successfully!', 'success')
  }

  const onStartNow = async (task) => {
    await handleStartNow(task)
    showToast('Task started late. Status: Late – In Progress.', 'warning')
    setSelectedTask(prev => prev?.id === task.id ? { ...prev, statusKey: 'late-in-progress' } : prev)
  }

  const onRequestExtension = async (taskId, data) => {
    await handleRequestExtension(taskId, data)
    showToast('Extension request sent to Manager.', 'info')
  }

  const onApproveExtension = async (taskId) => {
    await handleApproveExtension(taskId)
    setSelectedTask(null)
    setActiveTab('Upcoming')
    showToast('Extension approved! Task moved back to Upcoming.', 'success')
  }

  const onReturnForRevision = async (taskId, revisionFeedback) => {
    await handleReturnForRevision(taskId, revisionFeedback)
    setSelectedTask(null)
    setActiveTab('Upcoming')
    showToast('Task returned for revision and moved to Upcoming.', 'warning')
  }

  const allTasks = [...tasks.Upcoming, ...tasks.Overdue, ...tasks.Completed]
  const currentTask = selectedTask ? allTasks.find(t => t.id === selectedTask.id) || selectedTask : null

  const handleTeamChange = (teamId) => {
    setSelectedTeamId(teamId)
    const url = new URL(window.location.href)
    if (teamId) url.searchParams.set('teamId', teamId)
    else url.searchParams.delete('teamId')
    window.history.pushState({}, '', url)
    window.location.reload()
  }

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 36, height: 36, border: '3px solid #6366f1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 10px' }} />
        <p style={{ fontSize: 13, color: '#999' }}>Loading tasks...</p>
      </div>
    </div>
  )

  if (error) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60 }}>
      <p style={{ color: '#ef4444' }}>Failed to load tasks: {error}</p>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <TeamDropdown teams={teams} selectedTeamId={selectedTeamId} onChange={handleTeamChange} />
      <main className="main-content">
        {currentTask ? (
          <TaskDetail
            task={currentTask}
            onBack={() => setSelectedTask(null)}
            onStartTask={onStartTask}
            onStartNow={onStartNow}
            onRequestExtension={onRequestExtension}
            onApproveExtension={onApproveExtension}
            onSubmitWork={onSubmitWork}
            onReturnForRevision={onReturnForRevision}
            toast={toast}
            showToast={showToast}
            fetchComments={fetchComments}
            addComment={addComment}
          />
        ) : (
          <AssignmentPage
            tasks={tasks}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onViewDetail={(task) => setSelectedTask(task)}
            onStartTask={onStartTask}
            onStartNow={onStartNow}
            toast={toast}
          />
        )}
      </main>
    </div>
  )
}

// ── Assignments View — switches by role ────────────────────────────────────────
function AssignmentsView() {
  const { role } = useRole()
  return role === 'admin' ? <AdminAssignmentsView /> : <MemberAssignmentsView />
}

// ── Role Toggle ────────────────────────────────────────────────────────────────
function RoleToggle({ role, setRole }) {
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      display: 'flex', alignItems: 'center', gap: 4,
      background: '#1e1b4b', borderRadius: 50, padding: '5px 6px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
    }}>
      <span style={{
        fontSize: 10, fontWeight: 700, color: '#a5b4fc',
        letterSpacing: '0.5px', paddingLeft: 10, paddingRight: 8,
        whiteSpace: 'nowrap', textTransform: 'uppercase',
      }}>
        Role
      </span>

      <button
        onClick={() => setRole('admin')}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '7px 16px', borderRadius: 50, border: 'none',
          cursor: 'pointer', fontSize: 12, fontWeight: 700,
          fontFamily: 'inherit', transition: 'all 0.2s',
          background: role === 'admin' ? 'linear-gradient(135deg, #f59e0b, #f97316)' : 'transparent',
          color: role === 'admin' ? '#fff' : '#6b7280',
          boxShadow: role === 'admin' ? '0 2px 8px rgba(245,158,11,0.4)' : 'none',
        }}
      >
        <Shield size={13} /> Admin
      </button>

      <button
        onClick={() => setRole('member')}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '7px 16px', borderRadius: 50, border: 'none',
          cursor: 'pointer', fontSize: 12, fontWeight: 700,
          fontFamily: 'inherit', transition: 'all 0.2s',
          background: role === 'member' ? 'linear-gradient(135deg, #6c7aff, #8b5cf6)' : 'transparent',
          color: role === 'member' ? '#fff' : '#6b7280',
          boxShadow: role === 'member' ? '0 2px 8px rgba(108,122,255,0.4)' : 'none',
        }}
      >
        <User size={13} /> Member
      </button>
    </div>
  )
}

// ── Main App ───────────────────────────────────────────────────────────────────
function App() {
  const [role, setRole] = useState('admin')
  const [activeTab, setActiveTab] = useState('tasks')
  const [tasks, setTasks] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedMember, setSelectedMember] = useState(null)

  const urlTeamId = getTeamIdFromUrl()

  const fetchMembers = useCallback(async () => {
    let query = supabase.from('team_members').select('id, name, email, role').order('id', { ascending: true })
    if (urlTeamId) query = query.eq('team_id', urlTeamId)
    const { data, error } = await query
    if (error) { console.error('fetchMembers error:', error); return }
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
    setMembers((data || []).map((m, i) => ({
      id: m.id, name: m.name, email: m.email, role: m.role || 'Member',
      avatar: m.name.charAt(0).toUpperCase(), color: COLORS[i % COLORS.length],
    })))
  }, [urlTeamId])

  const fetchTasks = useCallback(async () => {
    let query = supabase
      .from('myteam_tasks')
      .select('id, task, owner, status, status_key, due_date, create_date, checked, table_id')
      .eq('is_archived', false).eq('is_trashed', false)
      .order('created_at', { ascending: true })

    if (urlTeamId) {
      const { data: tables } = await supabase
        .from('myteam_tables').select('id').eq('team_id', urlTeamId)
      const tableIds = (tables || []).map(t => t.id)
      if (tableIds.length > 0) query = query.in('table_id', tableIds)
      else { setTasks([]); return }
    }

    const { data, error } = await query
    if (error) { console.error('fetchTasks error:', error); return }

    setTasks((data || []).map(t => ({
      id: t.id, title: t.task, description: '',
      ownerName: Array.isArray(t.owner) ? t.owner[0] : (t.owner || null),
      assignedTo: null,
      status: mapStatus(t.status_key || t.status),
      priority: 'medium',
      progress: t.checked ? 100 : (t.status === 'working' ? 50 : 0),
      dueDate: t.due_date || '', createDate: t.create_date || '',
    })))
  }, [urlTeamId])

  useEffect(() => {
    if (members.length === 0 || tasks.length === 0) return
    setTasks(prev => prev.map(task => {
      const member = members.find(m => m.name === task.ownerName)
      return { ...task, assignedTo: member ? member.id : null }
    }))
  }, [members]) // eslint-disable-line

  useEffect(() => {
    const init = async () => { setLoading(true); await Promise.all([fetchMembers(), fetchTasks()]); setLoading(false) }
    init()
  }, [fetchMembers, fetchTasks])

  useEffect(() => {
    const channel = supabase.channel('workload_tasks_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'myteam_tasks' }, () => fetchTasks())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'task_files' }, () => fetchTasks())
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [fetchTasks])

  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter(t => t.status === 'completed').length
    const inProgress = tasks.filter(t => t.status === 'in-progress').length
    const pending = tasks.filter(t => t.status === 'pending').length
    const overdue = tasks.filter(t => { if (!t.dueDate || t.status === 'completed') return false; return new Date(t.dueDate) < new Date() }).length
    return { total, completed, inProgress, pending, overdue, completionRate: total > 0 ? Math.round((completed / total) * 100) : 0 }
  }, [tasks])

  const filteredTasks = useMemo(() => tasks.filter(task => {
    const statusMatch = filterStatus === 'all' || task.status === filterStatus
    const memberMatch = !selectedMember || task.assignedTo === selectedMember
    return statusMatch && memberMatch
  }), [tasks, filterStatus, selectedMember])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '4px solid #2bbdcc', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
        <p style={{ fontSize: 13, color: '#999' }}>Loading...</p>
      </div>
    </div>
  )

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)', fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif", display: 'flex', flexDirection: 'column' }}>
        <Header stats={stats} />
        <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 'tasks' && (
          <main style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 36px', width: '100%' }}>
            <TasksView
              filteredTasks={filteredTasks} members={members}
              filterStatus={filterStatus} setFilterStatus={setFilterStatus}
              selectedMember={selectedMember} setSelectedMember={setSelectedMember}
            />
          </main>
        )}

        {activeTab === 'assignments' && <AssignmentsView />}

        <RoleToggle role={role} setRole={setRole} />
      </div>
    </RoleContext.Provider>
  )
}

export default App