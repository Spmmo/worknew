import { useState, useMemo } from 'react';
import TaskCard from './TaskCard';
import FilterPanel from './FilterPanel';
import { SlidersHorizontal } from 'lucide-react';

const TABS = ['Upcoming', 'Overdue', 'Completed'];

const EMPTY_FILTERS = { priority: [], dueDate: [], group: [] };

function isThisWeek(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  const start = new Date(now); start.setDate(now.getDate() - now.getDay());
  const end   = new Date(start); end.setDate(start.getDate() + 6);
  return d >= start && d <= end;
}
function isThisMonth(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}
function isToday(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}
function isOverdueDate(dateStr) {
  return new Date(dateStr) < new Date();
}

// Parse dates like "Mar 15, 2026"
function parseDate(str) {
  return new Date(str);
}

function applyFilters(tasks, filters) {
  return tasks.filter(task => {
    // Priority
    if (filters.priority.length > 0) {
      const hasRevision = filters.priority.includes('revision') && task.statusKey === 'needs-revision';
      const hasPriority = filters.priority.filter(p => p !== 'revision').some(p => p === task.priority);
      if (!(hasRevision || hasPriority)) return false;
    }
    // Group
    if (filters.group.length > 0) {
      if (!filters.group.includes(task.group)) return false;
    }
    // Due Date
    if (filters.dueDate.length > 0) {
      const d = parseDate(task.dueDate);
      const matches = filters.dueDate.some(opt => {
        if (opt === 'today')  return isToday(d);
        if (opt === 'week')    return isThisWeek(d);
        if (opt === 'month')   return isThisMonth(d);
        
        return false;
      });
      if (!matches) return false;
    }
    return true;
  });
}

export default function AssignmentPage({ tasks, activeTab, setActiveTab, onViewDetail, onStartTask, onStartNow, toast }) {
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const overdueCount = tasks.Overdue.length;

  // Collect all unique groups across tabs
  const allGroups = useMemo(() => {
    const all = [...tasks.Upcoming, ...tasks.Overdue, ...tasks.Completed];
    return [...new Set(all.map(t => t.group))].filter(Boolean);
  }, [tasks]);

  const activeFilterCount =
    (filters.priority?.length || 0) +
    (filters.dueDate?.length || 0) +
    (filters.group?.length || 0);

  const filteredTasks = useMemo(() => {
    const raw = tasks[activeTab] || [];
    return applyFilters(raw, filters);
  }, [tasks, activeTab, filters]);

  return (
    <div className="assignment-page">
      {/* Toast */}
      {toast && <div className={`toast toast-${toast.type}`}>{toast.msg}</div>}

      <div className="assignment-top">
        <div>
          <h1 className="page-title">Assignment</h1>
          <p className="page-alert">
            Hello Andy, you have{' '}
            <span className="alert-link" onClick={() => setActiveTab('Overdue')}>
              {overdueCount} overdue task{overdueCount !== 1 ? 's' : ''}
            </span>{' '}
            that needs attention.
          </p>
        </div>
        <button
          className={`btn-filter-sort ${activeFilterCount > 0 ? 'filter-active' : ''}`}
          onClick={() => setShowFilter(true)}
        >
          <SlidersHorizontal size={14} />
          Filter
          {activeFilterCount > 0 && (
            <span className="filter-badge">{activeFilterCount}</span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilter && (
        <FilterPanel
          groups={allGroups}
          filters={filters}
          onChange={setFilters}
          onClear={() => setFilters(EMPTY_FILTERS)}
          onClose={() => setShowFilter(false)}
        />
      )}

      <div className="tabs">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            {tab === 'Overdue' && tasks.Overdue.length > 0 && (
              <span className="tab-badge">{tasks.Overdue.length}</span>
            )}
          </button>
        ))}
      </div>

      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            {activeFilterCount > 0 ? 'No tasks match the current filters.' : 'No tasks in this category.'}
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              tab={activeTab}
              onViewDetail={onViewDetail}
              onStartTask={onStartTask}
              onStartNow={onStartNow}
            />
          ))
        )}
      </div>
    </div>
  );
}