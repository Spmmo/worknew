import styles from "../styles";

const MyTeamPreview = () => (
  <div style={styles.previewBox}>
    <div style={styles.previewInner}>
      {/* Table icon */}
      <div style={styles.iconBox}>
        <svg width="68" height="68" viewBox="0 0 90 90">
          <rect x="5"  y="5"  width="38" height="38" rx="4" fill="#1a1a1a" />
          <rect x="5"  y="50" width="18" height="18" rx="3" fill="#1a1a1a" />
          <rect x="27" y="50" width="16" height="18" rx="3" fill="#1a1a1a" />
          <rect x="50" y="5"  width="35" height="16" rx="3" fill="#1a1a1a" />
          <rect x="50" y="27" width="35" height="16" rx="3" fill="#1a1a1a" />
          <rect x="50" y="50" width="35" height="18" rx="3" fill="#1a1a1a" />
        </svg>
      </div>

      {/* Checklist icon */}
      <div style={styles.iconBox}>
        <svg width="68" height="68" viewBox="0 0 90 90">
          {[0, 1, 2].map((i) => (
            <g key={i} transform={`translate(0, ${i * 28})`}>
              <polyline
                points="5,14 14,24 28,8"
                stroke="#1a1a1a" strokeWidth="6"
                fill="none" strokeLinecap="round" strokeLinejoin="round"
              />
              <rect x="38" y="8" width="46" height="12" rx="3" fill="#1a1a1a" />
            </g>
          ))}
        </svg>
      </div>
    </div>
  </div>
);

export default MyTeamPreview;