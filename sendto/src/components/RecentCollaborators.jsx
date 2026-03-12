import { useState } from "react";
import { Plus, UserPlus, X, Zap, Clock } from "lucide-react";

const defaultCollaborators = [
  { id: 1, initials: "SJ", name: "Sarah J.",  gradient: "from-violet-500 to-purple-600", dot: "bg-emerald-400", StatusIcon: Zap },
  { id: 2, initials: "DC", name: "David C.",  gradient: "from-sky-500 to-blue-600",      dot: "bg-amber-400",   StatusIcon: Clock },
  { id: 3, initials: "ER", name: "Elena R.",  gradient: "from-orange-500 to-red-600",    dot: "bg-amber-400",   StatusIcon: Clock },
  { id: 4, initials: "JS", name: "Jordan S.", gradient: "from-teal-500 to-emerald-600",  dot: "bg-emerald-400", StatusIcon: Zap },
];

export default function RecentCollaborators() {
  const [collaborators, setCollaborators] = useState(defaultCollaborators);
  const [showAdd, setShowAdd]             = useState(false);
  const [inputVal, setInputVal]           = useState("");
  const [removed, setRemoved]             = useState(null);
  const [confirmId, setConfirmId]         = useState(null); // id ที่รอยืนยันลบ

  const handleAdd = () => {
    if (!inputVal.trim()) return;
    const parts    = inputVal.trim().split(" ");
    const initials = parts.map((p) => p[0]?.toUpperCase() || "").join("").slice(0, 2);
    const gradients = [
      "from-pink-500 to-rose-600", "from-fuchsia-500 to-pink-600",
      "from-cyan-500 to-sky-600",  "from-lime-500 to-green-600",
    ];
    const newOne = {
      id: Date.now(), initials, name: inputVal.trim().slice(0, 9),
      gradient: gradients[Math.floor(Math.random() * gradients.length)],
      dot: "bg-emerald-400", StatusIcon: Zap,
    };
    setCollaborators((prev) => [...prev, newOne]);
    setInputVal("");
    setShowAdd(false);
  };

  const confirmRemove = (id) => setConfirmId(id);

  const handleRemove = () => {
    setRemoved(confirmId);
    setConfirmId(null);
    setTimeout(() => {
      setCollaborators((prev) => prev.filter((c) => c.id !== confirmId));
      setRemoved(null);
    }, 300);
  };

  const cancelRemove = () => setConfirmId(null);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
      <p className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase text-center mb-4">Team Members</p>

      <div className="flex items-end justify-center gap-4 flex-wrap">
        {collaborators.map((c) => (
          <div
            key={c.id}
            className={`flex flex-col items-center gap-1.5 group relative transition-all duration-300 ${removed === c.id ? "opacity-0 scale-75" : "opacity-100 scale-100"}`}
          >
            {/* Remove button (X) — shows on hover */}
            <button
              onClick={() => confirmRemove(c.id)}
              className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center shadow"
            >
              <X size={8} />
            </button>

            <div className="relative">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${c.gradient} flex items-center justify-center shadow-md font-bold text-xs text-white`}>
                {c.initials}
              </div>
              <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${c.dot}`} />
            </div>
            <p className="text-[10px] text-gray-500 font-medium">{c.name}</p>
          </div>
        ))}

        {/* Add button */}
        {showAdd ? (
          <div className="flex items-center gap-2 bg-indigo-50 rounded-xl px-3 py-2 border border-indigo-200">
            <input
              autoFocus
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); if (e.key === "Escape") setShowAdd(false); }}
              placeholder="Full name..."
              className="bg-transparent outline-none text-xs w-24 text-gray-700 placeholder-indigo-300"
            />
            <button onClick={handleAdd} className="text-indigo-600 hover:text-indigo-800 transition">
              <Plus size={14} />
            </button>
            <button onClick={() => setShowAdd(false)} className="text-gray-400 hover:text-gray-600 transition">
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1.5">
            <button
              onClick={() => setShowAdd(true)}
              className="w-12 h-12 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 hover:border-indigo-400 hover:text-indigo-400 hover:bg-indigo-50 active:scale-95 transition-all duration-200"
            >
              <UserPlus size={16} />
            </button>
            <p className="text-[10px] text-gray-400">Add</p>
          </div>
        )}
      </div>

      {/* Confirm delete modal */}
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl px-10 py-8 flex flex-col items-center gap-6 max-w-sm w-full mx-4">
            <p className="text-gray-800 text-lg font-semibold text-center">
              Remove this member from the team?
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleRemove}
                className="bg-red-500 hover:bg-red-600 active:scale-95 text-white font-semibold px-8 py-2.5 rounded-full transition-all"
              >
                Remove
              </button>
              <button
                onClick={cancelRemove}
                className="bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-600 font-semibold px-8 py-2.5 rounded-full transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}