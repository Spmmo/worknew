import { useState } from "react";
import TaskCard from "./components/TaskCard";
import ConfirmModal from "./components/ConfirmModal";
import RecentCollaborators from "./components/RecentCollaborators";
import { ChevronDown, ChevronUp, Layers } from "lucide-react";

const allTasks = [
  { id: 1, title: "Update Brand Guidelines", status: "DONE", due: "Oct 24, 2023", icon: "file" },
  { id: 2, title: "Quarterly Marketing Review", status: "WORKING ON IT", due: "Oct 28, 2023", icon: "chart" },
  { id: 3, title: "API Documentation Sync", status: "NOT START", due: "Nov 02, 2023", icon: "terminal" },
  { id: 4, title: "Design System Audit", status: "NOT START", due: "Nov 10, 2023", icon: "file" },
  { id: 5, title: "Q4 Analytics Report", status: "WORKING ON IT", due: "Nov 15, 2023", icon: "chart" },
];

export default function App() {
  const [tasks, setTasks] = useState(allTasks);
  const [showAll, setShowAll] = useState(false);
  const [pending, setPending] = useState(null); // { taskId, member }
  const [notifications, setNotifications] = useState([]);

  const visibleTasks = showAll ? tasks : tasks.slice(0, 3);

  const handleSend = (taskId, member) => {
    setPending({ taskId, member });
  };

  const handleConfirm = () => {
    const task = tasks.find((t) => t.id === pending.taskId);
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== pending.taskId) return t;
        const currentHelpers = Array.isArray(t.assignedTo) ? t.assignedTo : t.assignedTo ? [t.assignedTo] : [];
        const alreadyAdded = currentHelpers.find((h) => h.name === pending.member.name);
        if (alreadyAdded) return t;
        return {
          ...t,
          assignedTo: [...currentHelpers, pending.member],
          status: t.status === "NOT START" ? "WORKING ON IT" : t.status,
        };
      })
    );
    const note = { id: Date.now(), text: `"${task?.title}" sent to ${pending.member.name}` };
    setNotifications((prev) => [note, ...prev].slice(0, 3));
    setTimeout(() => setNotifications((prev) => prev.filter((n) => n.id !== note.id)), 4000);
    setPending(null);
  };

  const myTasks    = tasks;
  const inProgress = myTasks.filter((t) => t.status === "WORKING ON IT").length;
  const completed  = myTasks.filter((t) => t.status === "DONE").length;
  const notStarted = myTasks.filter((t) => t.status === "NOT START").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/40" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* Toast notifications */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {notifications.map((n) => (
          <div key={n.id} className="bg-gray-900 text-white text-sm px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-slideIn">
            <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
            {n.text}
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md">
            <Layers size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 leading-none">Task Handover</h1>
            <p className="text-xs text-gray-400 mt-0.5">{tasks.length} tasks total</p>
          </div>
        </div>
      </header>

      {/* Stats bar */}
      <div className="max-w-6xl w-full mx-auto px-4 pt-5 pb-1 grid grid-cols-4 gap-3">
        {[
          { label: "Total Tasks",  value: myTasks.length, color: "text-gray-700",    bg: "bg-white" },
          { label: "In Progress",  value: inProgress,     color: "text-amber-600",   bg: "bg-amber-50" },
          { label: "Not Started",  value: notStarted,     color: "text-red-500",     bg: "bg-red-50" },
          { label: "Completed",    value: completed,      color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl shadow-sm px-5 py-4 flex items-center justify-between border border-gray-100 transition-all duration-500`}>
            <p className="text-xs text-gray-400 font-semibold">{s.label}</p>
            <p className={`text-2xl font-black ${s.color} transition-all duration-500`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Content */}
      <main className="max-w-6xl w-full mx-auto px-4 py-6 flex flex-col gap-3">
        {visibleTasks.map((task, i) => (
          <TaskCard
            key={task.id}
            task={task}
            onSend={handleSend}
            style={{ animationDelay: `${i * 60}ms` }}
          />
        ))}

        {/* View all toggle */}
        {tasks.length > 3 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-1.5 mx-auto text-sm text-gray-500 hover:text-indigo-600 font-semibold transition-colors py-1"
          >
            {showAll ? (
              <><ChevronUp size={16} /> Show less</>
            ) : (
              <><ChevronDown size={16} /> View all {tasks.length} tasks</>
            )}
          </button>
        )}

        <RecentCollaborators />
      </main>

      {/* Confirm Modal */}
      {pending && (
        <ConfirmModal
          member={pending.member}
          onConfirm={handleConfirm}
          onCancel={() => setPending(null)}
        />
      )}
    </div>
  );
}