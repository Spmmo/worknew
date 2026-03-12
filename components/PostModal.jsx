import { X } from "lucide-react";

const TAG_OPTIONS = [
  { value: "Urgent",    label: "Urgent",    dot: "bg-red-400",    style: "border-red-200 bg-red-50 text-red-500" },
  { value: "Important", label: "Important", dot: "bg-yellow-400", style: "border-yellow-200 bg-yellow-50 text-yellow-600" },
  { value: "General",   label: "General",   dot: "bg-blue-500",   style: "border-blue-300 bg-white text-blue-600" },
];

export default function PostModal({ onClose, onSave }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const now = new Date();
    const month = now.toLocaleString("en-US", { month: "short" });
    const day = now.getDate();
    const hour = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");

    onSave({
      id: Date.now(),
      title: form.title.value,
      tag: form.tag.value,
      date: `${month} ${day}, ${hour}:${min}`,
      author: "Me",
      body: form.body.value,
      avatarCount: 1,
      read: 0,
      total: 1,
      isRead: false,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 flex flex-col">
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-lg font-bold text-gray-900">New Announcement</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="h-px bg-gray-100 mx-0" />

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-6 py-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Title</label>
            <input
              name="title"
              placeholder="Enter announcement title..."
              required
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:bg-white transition"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Priority</label>
            <div className="flex gap-2">
              {TAG_OPTIONS.map((t) => (
                <label key={t.value} className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="tag"
                    value={t.value}
                    defaultChecked={t.value === "General"}
                    className="peer hidden"
                  />
                  <div className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-sm font-semibold transition-all ${t.style} peer-checked:ring-2 peer-checked:ring-offset-1 peer-checked:ring-current`}>
                    <span className={`w-2 h-2 rounded-full ${t.dot}`} />
                    {t.label}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Details</label>
            <textarea
              name="body"
              placeholder="Add announcement details..."
              required
              rows={5}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:bg-white transition resize-none"
            />
          </div>

          <div className="h-px bg-gray-100 -mx-6" />

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-colors shadow-sm"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}