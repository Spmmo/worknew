import { useState, useRef, useEffect } from "react";
import { FileText, BarChart2, Terminal, Send, Loader2, User } from "lucide-react";
import TeammateDropdown from "./TeammateDropdown";

const statusConfig = {
  DONE: { label: "Done", cls: "bg-emerald-100 text-emerald-700 border border-emerald-200" },
  "WORKING ON IT": { label: "Working on it", cls: "bg-amber-100 text-amber-700 border border-amber-200" },
  "NOT START": { label: "Not Started", cls: "bg-red-100 text-red-600 border border-red-200" },
};

const iconConfig = {
  file:     { Icon: FileText,  bg: "from-violet-500 to-purple-600" },
  chart:    { Icon: BarChart2, bg: "from-sky-500 to-blue-600" },
  terminal: { Icon: Terminal,  bg: "from-emerald-500 to-teal-600" },
};

export default function TaskCard({ task, onSend, style }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [sending, setSending]           = useState(false);
  const ref = useRef(null);

  const { Icon, bg } = iconConfig[task.icon];
  const status       = statusConfig[task.status];

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = async (member) => {
    setShowDropdown(false);
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
    onSend(task.id, member);
  };

  return (
    <div style={style} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 px-6 py-5 flex items-center gap-5">
      {/* Icon */}
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${bg} flex items-center justify-center flex-shrink-0 shadow-md`}>
        <Icon size={26} className="text-white" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-800 text-base">{task.title}</p>
        <div className="flex items-center gap-2 flex-wrap mt-2">
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${status.cls}`}>
            {status.label}
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8"  y1="2" x2="8"  y2="6"/>
              <line x1="3"  y1="10" x2="21" y2="10"/>
            </svg>
            {task.due}
          </span>
        </div>
      </div>

      {/* Helpers */}
      <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap max-w-xs justify-end">
        {task.assignedTo && task.assignedTo.length > 0 ? (
          <>
            <div className="flex -space-x-2">
              {task.assignedTo.map((h, i) => (
                <div
                  key={i}
                  title={h.name}
                  className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center border-2 border-white shadow-sm"
                >
                  <span className="text-[8px] font-bold text-white">
                    {h.name.split(" ").map(w => w[0]).join("").slice(0,2)}
                  </span>
                </div>
              ))}
            </div>
            <div>
              <p className="text-[9px] text-indigo-300 font-semibold leading-none">Helpers</p>
              <p className="text-xs text-indigo-600 font-semibold truncate max-w-[120px]">
                {task.assignedTo.map(h => h.name.split(" ")[0]).join(", ")}
              </p>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-1.5 bg-gray-50 border border-dashed border-gray-200 rounded-xl px-3 py-1.5">
            <User size={13} className="text-gray-300" />
            <div>
              <p className="text-[9px] text-gray-300 font-semibold leading-none">Helper</p>
              <p className="text-xs text-gray-300">Unassigned</p>
            </div>
          </div>
        )}
      </div>

      {/* Send button */}
      {task.status !== "DONE" && (
        <div className="relative flex-shrink-0" ref={ref}>
          {sending ? (
            <button disabled className="flex items-center gap-2 bg-indigo-100 text-indigo-400 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-not-allowed">
              <Loader2 size={14} className="animate-spin" /> Sending...
            </button>
          ) : task.assignedTo && task.assignedTo.length > 0 ? (
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-1.5 bg-indigo-50 text-indigo-600 border border-indigo-200 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-100 active:scale-95 transition-all duration-150"
            >
              + Add Helper
              <span className="bg-indigo-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {task.assignedTo.length}
              </span>
            </button>
          ) : (
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-1.5 bg-blue-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-600 active:scale-95 transition-all duration-150"
            >
              Send Task <Send size={13} />
            </button>
          )}
          {showDropdown && <TeammateDropdown onSelect={handleSelect} />}
        </div>
      )}
    </div>
  );
}