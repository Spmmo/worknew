import { useState } from "react";
import styles from "../styles";

const PinIcon = ({ filled }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const FavoriteCard = ({ item, onUnpin }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e2e2e2",
        borderRadius: 12,
        padding: "12px 14px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        cursor: "pointer",
        boxShadow: hovered ? "0 4px 14px rgba(0,0,0,0.1)" : "0 2px 6px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "all 0.18s ease",
        position: "relative",
        minWidth: 200,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        background: "#2bbdcc",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff",
      }}>
        {item.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {item.title}
        </div>
        <div style={{ fontSize: 11, color: "#aaa", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {item.path}
        </div>
      </div>

      {/* Unpin button */}
      {hovered && (
        <button
          onClick={e => { e.stopPropagation(); onUnpin(item.id); }}
          style={{
            background: "#fff8e1", border: "none", borderRadius: 6,
            padding: 5, cursor: "pointer", color: "#f5a623",
            display: "flex", alignItems: "center", flexShrink: 0,
            transition: "background 0.15s",
          }}
          title="Remove from favorites"
        >
          <PinIcon filled />
        </button>
      )}
    </div>
  );
};

// ── Favorites ─────────────────────────────────────────────────────────────────
const Favorites = ({ pinnedItems, onUnpin }) => {
  const [open, setOpen] = useState(true);

  if (pinnedItems.length === 0) return null;

  return (
    <section style={{ ...styles.section }}>
      <div style={styles.sectionHeader}>
        <button style={styles.sectionToggle} onClick={() => setOpen(o => !o)}>
          <span style={{ ...styles.chevronIcon, transform: open ? "rotate(0deg)" : "rotate(-90deg)" }}>▼</span>
          <span style={styles.sectionTitleText}>Favorites</span>
        </button>
      </div>

      {open && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, maxWidth: 800 }}>
          {pinnedItems.map(item => (
            <FavoriteCard key={item.id} item={item} onUnpin={onUnpin} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Favorites;