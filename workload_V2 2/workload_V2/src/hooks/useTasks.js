// src/hooks/useTasks.js
// เชื่อมโยงกับ: myteam_tasks, teams, team_members, task_files, task_attachments, comments

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

const STORAGE_BUCKET = 'task-files';

// ── Helpers ───────────────────────────────────────────────────────────────────

function mapTask(row) {
  // ✅ ใช้ status_key ถ้ามี ถ้าไม่มีให้แปลงจาก status เดิม
  let statusKey = (row.status_key && row.status_key !== 'not-started')
    ? row.status_key
    : statusToKey(row.status);

  // ✅ ถ้า due date เลยมาแล้ว และ status ยังไม่ done/pending/revision → บังคับเป็น overdue
  const due = row.due_date ? new Date(row.due_date) : null;
  const nonOverrideStatuses = ['done', 'pending-approval', 'needs-revision'];
  if (due && due < new Date() && !nonOverrideStatuses.includes(statusKey)) {
    statusKey = statusKey === 'in-progress' ? 'late-in-progress' : 'overdue';
  }

  return {
    id:                   row.id,
    title:                row.task,
    description:          row.description       || '',
    assignedBy:           row.assigned_by       || '',
    group:                row.team_name         || (Array.isArray(row.owner) ? row.owner[0] : row.owner) || 'No Group',
    teamId:               row.team_id           || null,
    tableId:              row.table_id          || null,
    dueDate:              row.due_date          || '',
    priority:             row.priority          || 'medium',
    statusKey,
    submittedAt:          row.submitted_at          || null,
    feedback:             row.feedback              || null,
    grade:                row.grade                 || null,
    revisionFeedback:     row.revision_feedback     || null,
    revisionReturnedAt:   row.revision_returned_at  || null,
    pendingDeadline:      row.pending_deadline       || null,
    extensionReason:      row.extension_reason       || null,
    // assignees จาก task_assignees (join) หรือ owner field
    assignees: (row.task_assignees || []).map(a => ({
      memberId: a.member_id,
      name:     a.name,
      initials: a.initials || a.name?.charAt(0)?.toUpperCase() || '?',
      color:    a.color || '#6366f1',
    })),
    // reference files ที่ admin แนบมา (task_attachments)
    attachments: (row.task_attachments || [])
      .filter(a => a.kind === 'reference')
      .map(a => ({
        id:          a.id,
        name:        a.name,
        size:        a.size,
        type:        a.type,
        iconColor:   a.icon_color,
        storagePath: a.storage_path,
        added:       a.added,
      })),
    // submitted files ที่ member ส่ง (task_files)
    submittedFiles: (row.task_files || []).map(f => ({
      id:          f.id,
      name:        f.file_name,
      size:        formatFileSize(f.file_size),
      type:        guessType(f.file_name),
      iconColor:   '#6366f1',
      storagePath: null,         // task_files ใช้ file_url แทน
      fileUrl:     f.file_url,
      uploadedBy:  f.uploaded_by,
      uploadedAt:  f.uploaded_at,
    })),
  };
}

function statusToKey(status) {
  if (status === 'done')    return 'done';
  if (status === 'working') return 'in-progress';
  return 'not-started';
}

function bucketOf(task) {
  if (task.statusKey === 'done') return 'Completed';
  const due = task.dueDate ? new Date(task.dueDate) : null;
  const now = new Date();
  if (due && due < now &&
      task.statusKey !== 'needs-revision' &&
      task.statusKey !== 'pending-approval') return 'Overdue';
  return 'Upcoming';
}

function formatFileSize(bytes) {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function guessType(name = '') {
  const ext = name.split('.').pop()?.toLowerCase();
  if (['jpg','jpeg','png','gif','webp'].includes(ext)) return 'image';
  if (ext === 'pdf') return 'pdf';
  if (['doc','docx'].includes(ext)) return 'word';
  if (['xls','xlsx'].includes(ext)) return 'excel';
  if (['zip','rar'].includes(ext)) return 'archive';
  return 'file';
}

// ── Fetch all tasks พร้อม relations ──────────────────────────────────────────

async function fetchAll(teamId = null) {
  // ── ถ้ามี teamId ให้ดึง table_ids ของทีมนั้นก่อน ──────────────────────────
  let tableIds = null;
  if (teamId) {
    const { data: tables, error: tblErr } = await supabase
      .from('myteam_tables')
      .select('id, team_id, teams(name)')
      .eq('team_id', teamId);
    if (tblErr) throw tblErr;
    tableIds = (tables || []).map(t => t.id);
    // ถ้าทีมนี้ยังไม่มี table เลย return empty
    if (tableIds.length === 0) return { Upcoming: [], Overdue: [], Completed: [] };
  }

  let query = supabase
    .from('myteam_tasks')
    .select(`
      *,
      myteam_tables ( id, team_id, teams ( name ) ),
      task_assignees ( member_id, name, initials, color ),
      task_attachments ( id, name, size, type, icon_color, kind, storage_path, added ),
      task_files ( id, file_name, file_url, file_size, uploaded_by, uploaded_at )
    `)
    .eq('is_archived', false)
    .eq('is_trashed', false)
    .order('created_at', { ascending: false });

  // ✅ filter ด้วย table_id array ที่ได้มา
  if (tableIds) query = query.in('table_id', tableIds);

  const { data, error } = await query;
  if (error) throw error;

  const buckets = { Upcoming: [], Overdue: [], Completed: [] };
  for (const row of data || []) {
    const enriched = {
      ...row,
      team_name: row.myteam_tables?.teams?.name || null,
      team_id:   row.myteam_tables?.team_id     || null,
    };
    const task = mapTask(enriched);
    buckets[bucketOf(task)].push(task);
  }
  return buckets;
}

// ── Storage helpers ───────────────────────────────────────────────────────────

export async function uploadFile(taskId, file, kind = 'submitted') {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path     = `tasks/${taskId}/${kind}/${Date.now()}_${safeName}`;
  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, { upsert: false });
  if (error) throw error;
  return path;
}

export async function getDownloadUrl(storagePath, expiresIn = 60) {
  if (!storagePath) return null;
  const { data, error } = await supabase.storage.from(STORAGE_BUCKET).createSignedUrl(storagePath, expiresIn);
  if (error) throw error;
  return data.signedUrl;
}

export async function deleteStorageFile(storagePath) {
  if (!storagePath) return;
  await supabase.storage.from(STORAGE_BUCKET).remove([storagePath]);
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useTasks(teamId = null) {
  const [tasks,   setTasks]   = useState({ Upcoming: [], Overdue: [], Completed: [] });
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const buckets = await fetchAll(teamId);
      setTasks(buckets);
    } catch (err) {
      console.error('useTasks error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => { reload(); }, [reload]);

  // Realtime — ฟังการเปลี่ยนแปลงของ myteam_tasks และ task_files
  useEffect(() => {
    const channel = supabase
      .channel('useTasks_realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'myteam_tasks' }, reload)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'task_files' }, reload)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'task_attachments' }, reload)
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [reload]);

  // ── Task mutations ────────────────────────────────────────────────────────

  const updateTask = useCallback(async (id, changes) => {
    const db = {};
    if ('statusKey'          in changes) { db.status_key = changes.statusKey; db.status = keyToStatus(changes.statusKey); }
    if ('dueDate'            in changes) db.due_date              = changes.dueDate;
    if ('pendingDeadline'    in changes) db.pending_deadline      = changes.pendingDeadline;
    if ('extensionReason'    in changes) db.extension_reason      = changes.extensionReason;
    if ('submittedAt'        in changes) db.submitted_at          = changes.submittedAt;
    if ('revisionFeedback'   in changes) db.revision_feedback     = changes.revisionFeedback;
    if ('revisionReturnedAt' in changes) db.revision_returned_at  = changes.revisionReturnedAt;
    if ('feedback'           in changes) db.feedback              = changes.feedback;
    if ('grade'              in changes) db.grade                 = changes.grade;
    if ('description'        in changes) db.description           = changes.description;
    if ('priority'           in changes) db.priority              = changes.priority;
    if ('assignedBy'         in changes) db.assigned_by           = changes.assignedBy;

    if (Object.keys(db).length > 0) {
      const { error } = await supabase.from('myteam_tasks').update(db).eq('id', id);
      if (error) throw error;
    }
  }, []);

  function keyToStatus(key) {
    if (key === 'done')    return 'done';
    if (key === 'in-progress' || key === 'late-in-progress') return 'working';
    return 'not-started';
  }

  const handleStartTask = useCallback(async (task) => {
    await updateTask(task.id, { statusKey: 'in-progress' });
    await reload();
  }, [updateTask, reload]);

  // Submit: อัปโหลดไป task_files (ที่มีอยู่แล้ว) แทน task_attachments
  const handleSubmitWork = useCallback(async (taskId, fileObjects) => {
    const submittedAt = new Date().toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true,
    });

    // ลบไฟล์เก่าที่ส่งไปแล้ว
    const { data: oldFiles } = await supabase
      .from('task_files').select('id, file_url').eq('task_id', taskId);
    if (oldFiles?.length) {
      await supabase.from('task_files').delete().eq('task_id', taskId);
    }

    // insert ไฟล์ใหม่เข้า task_files
    if (fileObjects?.length) {
      const rows = await Promise.all(fileObjects.map(async (f) => {
        let fileUrl = f.fileUrl || null;
        let fileSize = f.rawSize || null;

        if (f.fileObject instanceof File) {
          const path = await uploadFile(taskId, f.fileObject, 'submitted');
          const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
          fileUrl  = urlData?.publicUrl || null;
          fileSize = f.fileObject.size;
        }

        return {
          task_id:     taskId,
          file_name:   f.name,
          file_url:    fileUrl,
          file_size:   fileSize,
          uploaded_by: 'member',
          uploaded_at: new Date().toISOString(),
        };
      }));
      const { error } = await supabase.from('task_files').insert(rows);
      if (error) throw error;
    }

    await updateTask(taskId, {
      statusKey:          'done',
      submittedAt,
      revisionFeedback:   null,
      revisionReturnedAt: null,
    });
    await reload();
  }, [updateTask, reload]);

  const handleStartNow = useCallback(async (task) => {
    await updateTask(task.id, { statusKey: 'late-in-progress' });
    await reload();
  }, [updateTask, reload]);

  const handleRequestExtension = useCallback(async (taskId, { newDeadline, reason }) => {
    await updateTask(taskId, { statusKey: 'pending-approval', pendingDeadline: newDeadline, extensionReason: reason });
    await reload();
  }, [updateTask, reload]);

  const handleApproveExtension = useCallback(async (taskId) => {
    const { data } = await supabase.from('myteam_tasks').select('pending_deadline').eq('id', taskId).single();
    await updateTask(taskId, { statusKey: 'not-started', dueDate: data?.pending_deadline, pendingDeadline: null, extensionReason: null });
    await reload();
  }, [updateTask, reload]);

  const handleReturnForRevision = useCallback(async (taskId, revisionFeedback) => {
    const returnedAt = new Date().toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true,
    });
    await updateTask(taskId, { statusKey: 'needs-revision', revisionFeedback, revisionReturnedAt: returnedAt });
    await reload();
  }, [updateTask, reload]);

  // ── Comments — เชื่อมกับ team_members ────────────────────────────────────

  const fetchComments = useCallback(async (taskId) => {
    const { data, error } = await supabase
      .from('comments').select('*, team_members(name)')
      .eq('task_id', taskId).order('created_at', { ascending: true });
    if (error) throw error;
    return (data || []).map(c => ({
      id:       c.id,
      initials: c.initials || c.name?.charAt(0)?.toUpperCase() || '?',
      name:     c.name || c.team_members?.name || 'Unknown',
      time:     c.time_label || new Date(c.created_at).toLocaleTimeString(),
      text:     c.text,
      color:    c.color    || '#86efac',
      textBg:   c.text_bg  || '#f0fdf4',
    }));
  }, []);

  const addComment = useCallback(async (taskId, text, memberInfo = {}) => {
    const { error } = await supabase.from('comments').insert({
      task_id:    taskId,
      member_id:  memberInfo.memberId  || null,
      initials:   memberInfo.initials  || 'ME',
      name:       memberInfo.name      || 'Me',
      time_label: 'JUST NOW',
      text,
      color:      memberInfo.color  || '#86efac',
      text_bg:    memberInfo.textBg || '#f0fdf4',
    });
    if (error) throw error;
  }, []);

  return {
    tasks, loading, error, reload,
    handleStartTask, handleSubmitWork, handleStartNow,
    handleRequestExtension, handleApproveExtension,
    handleReturnForRevision, fetchComments, addComment,
  };
}