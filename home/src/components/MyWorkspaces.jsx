import { useState, useEffect } from "react";
import WorkspaceItem from "./WorkspaceItem";
import styles from "../styles";

// ── Mock data (fallback เมื่อยังไม่มี API) ───────────────────────────────────
const mockWorkspaces = [
  { id: 1, name: "Main workspace", org: "work management", initial: "M" },
];

// ── Modal ─────────────────────────────────────────────────────────────────────
const NewWorkspaceModal = ({ onClose, onConfirm }) => {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) return;
    onConfirm(name.trim());
    onClose();
  };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.15)", zIndex: 200 }} />
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        background: "#fff", borderRadius: 16, padding: "32px 28px",
        width: 380, zIndex: 201, boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#1a1a1a" }}>New workspace</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", fontSize: 18 }}>✕</button>
        </div>

        <label style={{ fontSize: 13, fontWeight: 600, color: "#555", display: "block", marginBottom: 8 }}>
          Workspace name
        </label>
        <input
          autoFocus
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") handleSubmit(); if (e.key === "Escape") onClose(); }}
          placeholder="e.g. Marketing, Design, Dev..."
          style={{
            width: "100%", padding: "10px 14px", borderRadius: 9,
            border: "1.5px solid #e0e0e0", fontSize: 14, outline: "none",
            color: "#1a1a1a", boxSizing: "border-box", fontFamily: "inherit",
            transition: "border-color 0.15s",
          }}
          onFocus={e => e.target.style.borderColor = "#2bbdcc"}
          onBlur={e => e.target.style.borderColor = "#e0e0e0"}
        />

        <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{ background: "none", border: "1.5px solid #e0e0e0", borderRadius: 9, padding: "9px 20px", fontSize: 14, color: "#666", cursor: "pointer", fontFamily: "inherit" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "#bbb"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#e0e0e0"}
          >Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            style={{
              background: name.trim() ? "#2bbdcc" : "#ddd",
              border: "none", borderRadius: 9, padding: "9px 20px",
              fontSize: 14, fontWeight: 600, color: "#fff",
              cursor: name.trim() ? "pointer" : "not-allowed",
              boxShadow: name.trim() ? "0 2px 10px rgba(43,189,204,0.35)" : "none",
              transition: "all 0.15s", fontFamily: "inherit",
            }}
          >Create</button>
        </div>
      </div>
    </>
  );
};

// ── New Workspace Button ──────────────────────────────────────────────────────
const NewWorkspaceBtn = ({ onClick }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      style={{ ...styles.navNewBtn, ...(hovered ? styles.navNewBtnHover : {}) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
      </svg>
      New workspace
    </button>
  );
};

// ── MyWorkspaces ──────────────────────────────────────────────────────────────
const MyWorkspaces = () => {
  const [open, setOpen] = useState(true);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("/api/workspaces")
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(data => setWorkspaces(data))
      .catch(() => setWorkspaces(mockWorkspaces)) // ← fallback
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = (name) => {
    const newWs = { id: Date.now(), name, org: "work management", initial: name.charAt(0).toUpperCase() };
    fetch("/api/workspaces", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, org: "work management" }),
    })
      .then(res => res.json())
      .then(data => setWorkspaces(prev => [...prev, data]))
      .catch(() => setWorkspaces(prev => [...prev, newWs])); // ← fallback
  };

  const handleDelete = (id) => {
    setWorkspaces(prev => prev.filter(ws => ws.id !== id));
    fetch(`/api/workspaces/${id}`, { method: "DELETE" }).catch(() => {});
  };

  return (
    <section style={styles.section}>
      <div style={styles.sectionHeader}>
        <button style={styles.sectionToggle} onClick={() => setOpen(o => !o)}>
          <span style={{ ...styles.chevronIcon, transform: open ? "rotate(0deg)" : "rotate(-90deg)" }}>▼</span>
          <span style={styles.sectionTitleText}>My workspaces</span>
        </button>
        
      </div>

      {open && (
        loading ? (
          <div style={{ color: "#bbb", fontSize: 13, padding: "12px 4px" }}>Loading...</div>
        ) : workspaces.length > 0 ? (
          <div style={styles.workspaceList}>
            {workspaces.map(ws => (
              <WorkspaceItem
                key={ws.id}
                name={ws.name}
                org={ws.org}
                initial={ws.initial ?? ws.name.charAt(0).toUpperCase()}
                onDelete={() => handleDelete(ws.id)}
              />
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <span style={styles.emptyIcon}>📁</span>
            <p style={styles.emptyText}>No workspaces yet</p>
          </div>
        )
      )}

      {showModal && (
        <NewWorkspaceModal
          onClose={() => setShowModal(false)}
          onConfirm={handleCreate}
        />
      )}
    </section>
  );
};

export default MyWorkspaces;