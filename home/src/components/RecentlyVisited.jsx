import { useState, useEffect } from "react";
import RecentCard from "./RecentCard";
import DashboardPreview from "./DashboardPreview";
import MyTeamPreview from "./MyTeamPreview";
import { DashboardIcon, TableIcon } from "./Icons";
import styles from "../styles";

// ── Preview & Icon map ────────────────────────────────────────────────────────
const previewMap = {
  dashboard: <DashboardPreview />,
  table: <MyTeamPreview />,
};
const iconMap = {
  dashboard: <DashboardIcon />,
  table: <TableIcon />,
};

// ── Mock data (fallback เมื่อยังไม่มี API) ───────────────────────────────────
const mockItems = [
  { id: 1, title: "Dashboard and reporting", path: "work management > Main workspace", type: "dashboard" },
  { id: 2, title: "My Team",                 path: "work management > Main workspace", type: "table" },
];

// ── RecentlyVisited ───────────────────────────────────────────────────────────
const RecentlyVisited = ({ onPin, isPinned }) => {
  const [open, setOpen] = useState(true);
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/recent-items")
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(data => setRecentItems(data))
      .catch(() => setRecentItems(mockItems)) // ← fallback
      .finally(() => setLoading(false));
  }, []);

  return (
    <section style={styles.section}>
      <div style={styles.sectionHeader}>
        <button style={styles.sectionToggle} onClick={() => setOpen(o => !o)}>
          <span style={{ ...styles.chevronIcon, transform: open ? "rotate(0deg)" : "rotate(-90deg)" }}>▼</span>
          <span style={styles.sectionTitleText}>Recently visited</span>
        </button>
      </div>

      {open && (
        loading ? (
          <div style={{ color: "#bbb", fontSize: 13, padding: "12px 4px" }}>Loading...</div>
        ) : recentItems.length > 0 ? (
          <div style={styles.cardGrid}>
            {recentItems.map(item => (
              <RecentCard
                key={item.id}
                title={item.title}
                path={item.path}
                icon={iconMap[item.type] ?? <DashboardIcon />}
                preview={previewMap[item.type] ?? <DashboardPreview />}
                pinned={isPinned?.(item.id)}
                onPin={() => onPin?.({ ...item, icon: iconMap[item.type] })}
              />
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <span style={styles.emptyIcon}>🕐</span>
            <p style={styles.emptyText}>No recently visited items</p>
          </div>
        )
      )}
    </section>
  );
};

export default RecentlyVisited;