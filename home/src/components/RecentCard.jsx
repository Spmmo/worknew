import { useState } from "react";
import styles from "../styles";

const PinIcon = ({ filled }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const RecentCard = ({ title, path, icon, preview, pinned, onPin }) => {
  const [hovered, setHovered] = useState(false);
  const [pinHovered, setPinHovered] = useState(false);

  return (
    <div
      style={{ ...styles.card, ...(hovered ? styles.cardHover : {}) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPinHovered(false); }}
    >
      {/* Preview */}
      <div style={styles.cardPreviewWrapper}>
        {preview}
      </div>

      {/* Footer */}
      <div style={{ ...styles.cardFooter, position: "relative" }}>
        <span style={styles.cardTitleIcon}>{icon}</span>
        <div style={{ flex: 1 }}>
          <div style={styles.cardTitle}>{title}</div>
          <div style={styles.cardPath}>{path}</div>
        </div>

        {/* Pin button — โผล่เมื่อ hover */}
        {hovered && (
          <button
            onClick={e => { e.stopPropagation(); onPin?.(); }}
            onMouseEnter={() => setPinHovered(true)}
            onMouseLeave={() => setPinHovered(false)}
            title={pinned ? "Remove from favorites" : "Add to favorites"}
            style={{
              background: pinned || pinHovered ? "#fff8e1" : "#f5f5f5",
              border: "none", borderRadius: 7,
              padding: 6, cursor: "pointer",
              color: pinned || pinHovered ? "#f5a623" : "#bbb",
              display: "flex", alignItems: "center",
              transition: "all 0.15s", flexShrink: 0,
            }}
          >
            <PinIcon filled={pinned} />
          </button>
        )}
      </div>
    </div>
  );
};

export default RecentCard;