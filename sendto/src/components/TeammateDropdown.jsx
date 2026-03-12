import { useState } from "react";
import { Search, Zap, Clock, AlertTriangle, User } from "lucide-react";

const teammates = [
  {
    id: 1, name: "Sarah Jenkins", role: "UI Designer",
    status: "Available", tasks: 1, statusColor: "text-emerald-400",
    initials: "SJ", gradient: "from-violet-500 to-purple-700",
    StatusIcon: Zap, dotColor: "bg-emerald-400",
  },
  {
    id: 2, name: "David Chen", role: "Frontend Dev",
    status: "Busy", tasks: 5, statusColor: "text-amber-400",
    initials: "DC", gradient: "from-sky-500 to-blue-700",
    StatusIcon: Clock, dotColor: "bg-amber-400",
  },
  {
    id: 3, name: "Elena Rodriguez", role: "Project Manager",
    status: "Overloaded", tasks: 7, statusColor: "text-rose-400",
    initials: "ER", gradient: "from-orange-500 to-red-700",
    StatusIcon: AlertTriangle, dotColor: "bg-rose-400",
  },
];

export default function TeammateDropdown({ onSelect }) {
  const [search, setSearch] = useState("");

  const filtered = teammates.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="absolute right-0 top-14 z-50 w-72 rounded-2xl overflow-hidden shadow-xl border border-gray-100 bg-white animate-fadeIn">
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-200">
          <Search size={13} className="text-gray-400 flex-shrink-0" />
          <input
            autoFocus
            className="bg-transparent text-sm outline-none w-full text-gray-700 placeholder-gray-400"
            placeholder="Search teammates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="px-2 pb-3 flex flex-col gap-0.5">
        {filtered.map((member) => (
          <button
            key={member.id}
            onClick={() => onSelect(member)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors w-full text-left hover:bg-gray-50"
          >
            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center flex-shrink-0 font-bold text-xs text-white`}>
              {member.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800">{member.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className={`text-xs font-medium ${member.statusColor}`}>● {member.status}</span>
              </div>
            </div>
            <span className="text-xs text-gray-400">{member.tasks} {member.tasks === 1 ? "task" : "tasks"}</span>
          </button>
        ))}
        {filtered.length === 0 && (
          <div className="py-6 text-center">
            <User size={24} className="text-gray-300 mx-auto mb-1" />
            <p className="text-sm text-gray-400">No teammates found</p>
          </div>
        )}
      </div>
    </div>
  );
}