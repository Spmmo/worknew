import { useState } from "react";
import { WorkspaceIcon } from "./Icons";
import styles from "../styles";

const WorkspaceItem = ({ name, org, initial, onDelete }) => {
  const [hovered, setHovered] = useState(false);
  const [deleteHovered, setDeleteHovered] = useState(false);

  return (
    <div
      style={{ ...styles.workspaceItem, ...(hovered ? styles.workspaceItemHover : {}) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setDeleteHovered(false); }}
    >
      {/* Avatar */}
      <div style={styles.workspaceAvatar}>
        <span style={styles.workspaceInitial}>{initial}</span>
        <div style={styles.workspaceHomeIcon}>
          <WorkspaceIcon />
        </div>
      </div>

      {/* Info */}
      <div style={{ flex: 1 }}>
        <div style={styles.workspaceName}>{name}</div>
        <div style={styles.workspaceOrg}>{org}</div>
      </div>

      {/* Delete icon — โผล่เมื่อ hover */}
      {hovered && (
        <button
          onClick={e => { e.stopPropagation(); onDelete?.(); }}
          onMouseEnter={() => setDeleteHovered(true)}
          onMouseLeave={() => setDeleteHovered(false)}
          style={{
            background: deleteHovered ? "#fff0f0" : "none",
            border: "none",
            borderRadius: 7,
            padding: 6,
            cursor: "pointer",
            color: deleteHovered ? "#e53935" : "#bbb",
            display: "flex",
            alignItems: "center",
            transition: "all 0.15s",
            flexShrink: 0,
          }}
          title="Delete workspace"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"/>
          </svg>
        </button>
      )}
    </div>
  );
};

export default WorkspaceItem;