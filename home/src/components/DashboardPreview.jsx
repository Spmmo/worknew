import styles from "../styles";

const DashboardPreview = () => (
  <div style={styles.previewBox}>
    <div style={styles.previewInner}>
      {/* Pie Chart */}
      <div style={styles.iconBox}>
        <svg width="68" height="68" viewBox="0 0 90 90">
          <circle cx="45" cy="45" r="38" fill="#e8e8e8" />
          <path d="M45 45 L45 7 A38 38 0 0 1 83 45 Z" fill="#FFC107" />
          <path d="M45 45 L83 45 A38 38 0 1 1 45 7 Z" fill="#4CAF50" />
        </svg>
      </div>

      {/* Bar Chart */}
      <div style={styles.iconBox}>
        <svg width="68" height="68" viewBox="0 0 90 90">
          <rect x="8"  y="45" width="20" height="38" fill="#5B8DEF" rx="3" />
          <rect x="36" y="25" width="20" height="58" fill="#3B6CD4" rx="3" />
          <rect x="64" y="10" width="20" height="73" fill="#2952B0" rx="3" />
        </svg>
      </div>
    </div>
  </div>
);

export default DashboardPreview;