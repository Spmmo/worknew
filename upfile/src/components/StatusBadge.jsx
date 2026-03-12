import { useEffect, useState } from "react";

/**
 * StatusBadge
 * Props:
 *   status — "Completed" | "Processing"
 */
const StatusBadge = ({ status }) => {
  const [progress, setProgress] = useState(10);

  useEffect(() => {
    if (status !== "Processing") return;
    setProgress(10);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) { clearInterval(interval); return 90; }
        return p + Math.floor(Math.random() * 12) + 4;
      });
    }, 400);
    return () => clearInterval(interval);
  }, [status]);

  if (status === "Processing") {
    return (
      <div className="uf-progress-wrap">
        <div className="uf-progress-top">
          <span className="uf-badge processing">
            <span className="uf-badge-dot" />
            Processing
          </span>
          <span className="uf-progress-pct">{Math.min(progress, 90)}%</span>
        </div>
        <div className="uf-progress-bar-bg">
          <div className="uf-progress-bar-fill" style={{ width: `${Math.min(progress, 90)}%` }} />
        </div>
      </div>
    );
  }

  return (
    <span className={`uf-badge ${status.toLowerCase()}`}>
      <span className="uf-badge-dot" />
      {status}
    </span>
  );
};

export default StatusBadge;