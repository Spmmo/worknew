import { useState, useCallback, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export function computeWorkloads(submissions) {
  const memberNames = [...new Set(submissions.map(s => s.name))]
  return memberNames.map((member) => {
    const mySubmissions = submissions.filter(s => s.name === member)
    let load = 0
    mySubmissions.forEach(s => {
      if (s.status === 'Revision Needed') load += 2
      else if (s.status === 'Pending') load += 1
    })
    const max = mySubmissions.length > 0 ? mySubmissions.length * 2 : 1
    const pct = Math.min(100, Math.round((load / max) * 100))
    return { name: member, pct }
  })
}

export function getBottlenecks(submissions) {
  const now = Date.now()
  return submissions.filter(
    s => (s.status === 'Pending' || s.status === 'Revision Needed') &&
      now - s.submittedTimestamp > 24 * 60 * 60 * 1000
  )
}

export function computeStats(submissions) {
  const pending  = submissions.filter(s => s.status === 'Pending' || s.status === 'Revision Needed').length
  const approved = submissions.filter(s => s.status === 'Approved').length
  const total    = submissions.length
  const quality  = total > 0 ? Math.round((approved / total) * 100) : 0
  return { pending, approved, quality }
}

function mapStatus(status) {
  if (status === 'done')    return 'Approved'
  if (status === 'working') return 'Revision Needed'
  return 'Pending'
}

function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const AVATAR_COLORS = ['#5a5fff', '#7c4dff', '#26c6da', '#ef4444', '#10b981', '#f59e0b']

export function useAppStore(selectedTeamId) {
  const [allSubmissions, setAllSubmissions]   = useState([])
  const [memberStatuses, setMemberStatuses]   = useState([])
  const [selectedId, setSelectedId]           = useState(null)
  const [feedback, setFeedback]               = useState({})
  const [showBottleneckModal, setShowBottleneckModal] = useState(false)
  const [loading, setLoading]                 = useState(true)

  const fetchSubmissions = useCallback(async () => {
    let tableIds = null
    if (selectedTeamId) {
      const { data: tables } = await supabase
        .from('myteam_tables').select('id').eq('team_id', selectedTeamId)
      tableIds = (tables || []).map(t => t.id)
      if (tableIds.length === 0) { setAllSubmissions([]); setLoading(false); return }
    }

    let query = supabase
      .from('myteam_tasks')
      .select('id, task, owner, status, created_at, table_id')
      .eq('is_archived', false).eq('is_trashed', false)
      .order('created_at', { ascending: false })

    if (tableIds) query = query.in('table_id', tableIds)

    const { data: tasks, error } = await query
    if (error) { console.error('fetchSubmissions error:', error); return }

    const taskIds = (tasks || []).map(t => t.id)
    let filesMap = {}

    if (taskIds.length > 0) {
      const { data: filesData, error: filesError } = await supabase
        .from('task_files')
        .select('id, task_id, file_name, file_url, file_size, uploaded_by, uploaded_at')
        .in('task_id', taskIds)

      if (!filesError && filesData) {
        filesData.forEach(f => {
          if (!filesMap[f.task_id]) filesMap[f.task_id] = []
          filesMap[f.task_id].push({
            id: f.id, name: f.file_name, url: f.file_url,
            size: f.file_size, uploadedBy: f.uploaded_by, uploadedAt: f.uploaded_at,
          })
        })
      }
    }

    const mapped = (tasks || []).map((t, i) => {
      const ownerName = Array.isArray(t.owner) ? t.owner[0] : (t.owner || 'Unassigned')
      const timestamp = t.created_at ? new Date(t.created_at).getTime() : Date.now()
      const hoursAgo  = Math.floor((Date.now() - timestamp) / 3600000)
      const files     = filesMap[t.id] || []
      return {
        id: t.id,
        initials: ownerName.charAt(0).toUpperCase(),
        name: ownerName,
        task: t.task || 'Untitled task',
        file: files.length > 0 ? files[0].name : null,
        size: files.length > 0 ? formatFileSize(files[0].size) : '—',
        files,
        submittedAgo:  hoursAgo < 1 ? 'Just now' : hoursAgo < 24 ? `${hoursAgo} hours ago` : 'Yesterday',
        submittedDate: new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        submittedTimestamp: timestamp,
        status: mapStatus(t.status),
        color: AVATAR_COLORS[i % AVATAR_COLORS.length],
      }
    })

    setAllSubmissions(mapped)
    if (mapped.length > 0) setSelectedId(prev => prev || mapped[0].id)
  }, [selectedTeamId])

  const fetchMembers = useCallback(async () => {
    let query = supabase.from('team_members').select('id, name').order('id', { ascending: true })
    if (selectedTeamId) query = query.eq('team_id', selectedTeamId)
    const { data, error } = await query
    if (error) { console.error('fetchMembers error:', error); return }
    const STATUS_OPTIONS = ['Online', 'Away', 'Offline']
    const STATUS_COLORS  = { Online: '#4caf50', Away: '#ff7043', Offline: '#bdbdbd' }
    setMemberStatuses((data || []).map((m, i) => ({
      name: m.name,
      status: STATUS_OPTIONS[i % STATUS_OPTIONS.length],
      color:  STATUS_COLORS[STATUS_OPTIONS[i % STATUS_OPTIONS.length]],
    })))
  }, [selectedTeamId])

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      await Promise.all([fetchSubmissions(), fetchMembers()])
      setLoading(false)
    }
    init()
  }, [fetchSubmissions, fetchMembers])

  useEffect(() => {
    const channel = supabase.channel('assignments_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'myteam_tasks' }, fetchSubmissions)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'task_files' },   fetchSubmissions)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [fetchSubmissions])

  const approveSubmission = useCallback(async (id) => {
    await supabase.from('myteam_tasks')
      .update({ status: 'done', completed_at: new Date().toISOString() })
      .eq('id', id)
    setAllSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: 'Approved' } : s))
  }, [])

  const requestRevision = useCallback(async (id) => {
    await supabase.from('myteam_tasks').update({ status: 'working' }).eq('id', id)
    setAllSubmissions(prev => prev.map(s => s.id === id ? { ...s, status: 'Revision Needed' } : s))
  }, [])

  // ✅ batchApprove อยู่ใน hook เท่านั้น ไม่ซ้ำนอก function
  const batchApprove = useCallback(async (ids) => {
    if (!ids || ids.length === 0) return
    const { error } = await supabase
      .from('myteam_tasks')
      .update({ status: 'done', completed_at: new Date().toISOString() })
      .in('id', ids)
    if (error) { console.error('batchApprove error:', error); return }
    setAllSubmissions(prev =>
      prev.map(s => ids.includes(s.id) ? { ...s, status: 'Approved' } : s)
    )
  }, [])

  const selectedSubmission = allSubmissions.find(s => s.id === selectedId) || allSubmissions[0] || null
  const workloads          = computeWorkloads(allSubmissions)
  const bottlenecks        = getBottlenecks(allSubmissions)
  const stats              = computeStats(allSubmissions)

  return {
    submissions: allSubmissions, loading,
    selectedId, setSelectedId,
    selectedSubmission,
    approveSubmission, requestRevision, batchApprove,
    feedback, setFeedback,
    workloads, bottlenecks, stats,
    memberStatuses,
    showBottleneckModal, setShowBottleneckModal,
  }
}