import { CheckCircle2, Clock, Pencil, Trash2, AlertOctagon, AlertTriangle, Info } from "lucide-react";

// ─── AvatarGroup ──────────────────────────────────────────────────────────────
function AvatarGroup({ count }) {
  const avatars = [
    { letter: "A", color: "bg-purple-400" },
    { letter: "B", color: "bg-orange-400" },
    { letter: "C", color: "bg-cyan-400" },
  ];
  const visible = avatars.slice(0, Math.min(count, 3));
  const extra = count - visible.length;

  return (
    <div className="flex items-center">
      {visible.map((av, i) => (
        <div
          key={i}
          className={`w-8 h-8 rounded-full ${av.color} border-2 border-white flex items-center justify-center text-white text-xs font-bold ${i > 0 ? "-ml-2" : ""}`}
        >
          {av.letter}
        </div>
      ))}
      {extra > 0 && (
        <span className="ml-1 text-xs text-gray-400 font-medium">+{extra}</span>
      )}
    </div>
  );
}

// ─── ReadProgress ─────────────────────────────────────────────────────────────
function ReadProgress({ read, total }) {
  const pct = Math.round((read / total) * 100);

  return (
    <div className="flex flex-col gap-1 w-48">
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>Acknowledged</span>
        <span>{read}/{total} read</span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${pct >= 70 ? "bg-green-500" : "bg-blue-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── AnnouncementPagination ───────────────────────────────────────────────────
export function AnnouncementPagination({ showing, total }) {
  return (
    <div className="flex items-center justify-start pt-1">
      <span className="text-sm text-gray-400">
        Showing {showing} of {total} announcements
      </span>
    </div>
  );
}

// ─── TAG STYLES ───────────────────────────────────────────────────────────────
const TAG_STYLES = {
  Important: {
    pill: "bg-yellow-100 text-yellow-600 border border-yellow-200",
    iconWrap: "bg-yellow-50 text-yellow-500",
    Icon: AlertTriangle,
  },
  General: {
    pill: "bg-blue-100 text-blue-600 border border-blue-200",
    iconWrap: "bg-blue-50 text-blue-500",
    Icon: Info,
  },
  Urgent: {
    pill: "bg-red-100 text-red-500 border border-red-200",
    iconWrap: "bg-red-50 text-red-500",
    Icon: AlertOctagon,
  },
};

// ─── AnnouncementCard ─────────────────────────────────────────────────────────
export default function AnnouncementCard({ item, onDelete, onEdit, onToggleRead, currentUser = "Me" }) {
  const style = TAG_STYLES[item.tag] ?? TAG_STYLES.General;
  const { Icon } = style;
  const isOwner = item.author === currentUser;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${style.iconWrap}`}>
            <Icon size={20} strokeWidth={2} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-gray-900 text-base leading-tight">{item.title}</span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${style.pill}`}>{item.tag}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400">
              <Clock size={12} />
              <span>{item.date}</span>
              <span className="mx-0.5">•</span>
              <span>{item.author}</span>
            </div>
          </div>
        </div>

        {!isOwner && (
          <button
            onClick={() => !item.isRead && onToggleRead?.(item.id)}
            disabled={item.isRead}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold flex-shrink-0 transition-colors ${
              item.isRead
                ? "bg-purple-600 text-white shadow-sm cursor-default"
                : "bg-gray-100 hover:bg-gray-200 text-gray-500 cursor-pointer"
            }`}
          >
            <CheckCircle2 size={15} />
            {item.isRead ? "Read" : "Mark as Read"}
          </button>
        )}
      </div>

      <p className="text-sm text-gray-600 leading-relaxed">{item.body}</p>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-4">
          <AvatarGroup count={item.avatarCount} />
          <ReadProgress read={item.read} total={item.total} />
        </div>
        <div className="flex items-center gap-1">
          {isOwner && (
            <>
              <button
                onClick={() => onEdit?.(item)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => onDelete?.(item.id)}
                className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={15} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}