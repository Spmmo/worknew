import { useState } from "react";
import { GridIcon, ListIcon, DownloadIcon, TrashIcon, EditIcon, getFileIcon } from "./Icons";
import { DeleteModal, RenameModal } from "./ConfirmModal";
import StatusBadge from "./StatusBadge";
import FileRow from "./FileRow";

const GridCard = ({ file, onDelete, onRename, onDownload }) => {
  const [showDelete, setShowDelete] = useState(false);
  const [showRename, setShowRename] = useState(false);

  return (
    <>
      <div className="uf-grid-card">
        <div className="uf-grid-icon">{getFileIcon(file.ext)}</div>
        <div className="uf-grid-info">
          <span className="uf-file-name" title={file.name}>{file.name}</span>
          <span className="uf-file-type">{file.size} · {file.date}</span>
        </div>
        <StatusBadge status={file.status} />
        <div className="uf-grid-actions">
          <button className="uf-grid-btn" title="Download"
            onClick={() => onDownload && onDownload(file.id, file.name)}>
            <DownloadIcon />
          </button>
          <button className="uf-grid-btn" title="Rename"
            onClick={() => setShowRename(true)}>
            <EditIcon />
          </button>
          <button className="uf-grid-btn uf-grid-btn--danger" title="Delete"
            onClick={() => setShowDelete(true)}>
            <TrashIcon />
          </button>
        </div>
      </div>

      {showDelete && (
        <DeleteModal
          fileName={file.name}
          onConfirm={() => { setShowDelete(false); onDelete && onDelete(file.id); }}
          onClose={()   => setShowDelete(false)}
        />
      )}
      {showRename && (
        <RenameModal
          fileName={file.name}
          onConfirm={(newName) => { setShowRename(false); onRename && onRename(file.id, newName); }}
          onClose={()          => setShowRename(false)}
        />
      )}
    </>
  );
};

const RecentUploads = ({ files = [], totalCount, onDelete, onRename, onDownload }) => {
  const [view, setView] = useState("list");

  return (
    <section>
      <div className="uf-section-header">
        <div className="uf-section-left">
          <span className="uf-section-title">Recent Uploads</span>
          <span className="uf-file-count">{totalCount ?? files.length} Files</span>
        </div>
        <div className="uf-view-toggle">
          <button className={`uf-view-btn${view === "grid" ? " active" : ""}`} onClick={() => setView("grid")} title="Grid view"><GridIcon /></button>
          <button className={`uf-view-btn${view === "list" ? " active" : ""}`} onClick={() => setView("list")} title="List view"><ListIcon /></button>
        </div>
      </div>

      {view === "list" && (
        <table className="uf-table">
          <thead>
            <tr>
              <th>File Name</th><th>Size</th><th>Date Uploaded</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <FileRow key={file.id} {...file} onDelete={onDelete} onRename={onRename} onDownload={onDownload} />
            ))}
          </tbody>
        </table>
      )}

      {view === "grid" && (
        <div className="uf-grid">
          {files.map((file) => (
            <GridCard key={file.id} file={file} onDelete={onDelete} onRename={onRename} onDownload={onDownload} />
          ))}
        </div>
      )}

      {files.length === 0 && <div className="uf-empty">No files uploaded yet.</div>}
    </section>
  );
};

export default RecentUploads;