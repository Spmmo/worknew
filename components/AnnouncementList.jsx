import { useState } from "react";
import { Search, Plus } from "lucide-react";
import AnnouncementCard, { AnnouncementPagination } from "./AnnouncementCard";
import PostModal from "./PostModal";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";

// ─── AnnouncementSearch ───────────────────────────────────────────────────────
function AnnouncementSearch({ value, onChange, onPost }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="relative w-72">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="Search announcements..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
        />
      </div>
      <button
        onClick={onPost}
        className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
      >
        <Plus size={16} />
        Post Announcement
      </button>
    </div>
  );
}

// ─── AnnouncementList ─────────────────────────────────────────────────────────
export default function AnnouncementList({ data = [] }) {
  const [items, setItems] = useState(data);
  const [search, setSearch] = useState("");
  const [showPost, setShowPost] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const CURRENT_USER = "Me";

  const filtered = items.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.body.toLowerCase().includes(search.toLowerCase())
  );

  const handleSaveEdit = (updated) =>
    setItems((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));

  const handleDelete = (id) =>
    setItems((prev) => prev.filter((a) => a.id !== id));

  const handlePost = (newItem) =>
    setItems((prev) => [newItem, ...prev]);

  const handleToggleRead = (id) => {
    setItems((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const nowRead = !a.isRead;
        return {
          ...a,
          isRead: nowRead,
          read: nowRead ? Math.min(a.read + 1, a.total) : Math.max(a.read - 1, 0),
        };
      })
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <AnnouncementSearch
        value={search}
        onChange={setSearch}
        onPost={() => setShowPost(true)}
      />

      {filtered.length === 0 ? (
        <p className="text-center py-16 text-sm text-gray-400">No announcements found</p>
      ) : (
        filtered.map((item) => (
          <AnnouncementCard
            key={item.id}
            item={item}
            onEdit={(i) => setEditItem(i)}
            onDelete={(id) => setDeleteItem(items.find((a) => a.id === id))}
            onToggleRead={handleToggleRead}
            currentUser={CURRENT_USER}
          />
        ))
      )}

      <AnnouncementPagination
        showing={filtered.length}
        total={filtered.length}
      />

      {showPost && (
        <PostModal onClose={() => setShowPost(false)} onSave={handlePost} />
      )}
      {editItem && (
        <EditModal item={editItem} onClose={() => setEditItem(null)} onSave={handleSaveEdit} />
      )}
      {deleteItem && (
        <DeleteModal item={deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDelete} />
      )}
    </div>
  );
}