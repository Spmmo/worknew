import { useState, useRef, useEffect } from "react";
import StatusBadge from "./StatusBadge";
import { DeleteModal, RenameModal } from "./ConfirmModal";
import { getFileIcon, getFileLabel, DotsIcon, DownloadIcon, TrashIcon, EditIcon } from "./Icons";

const ActionMenu = ({ onDownload, onRename, onDelete, onClose }) => {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div className="uf-action-menu" ref={ref}>
      <button className="uf-menu-item" onClick={onDownload}><DownloadIcon /> Download</button>
      <button className="uf-menu-item" onClick={onRename}><EditIcon /> Rename</button>
      <button className="uf-menu-item uf-menu-item--danger" onClick={onDelete}><TrashIcon /> Delete</button>
    </div>
  );
};

const FileRow = ({ id, name, ext, size, date, status, onDelete, onRename, onDownload }) => {
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showRename, setShowRename] = useState(false);

  return (
    <>
      <tr className="uf-file-row">
        <td>
          <div className="uf-file-cell">
            <div className="uf-file-icon">{getFileIcon(ext)}</div>
            <div>
              <span className="uf-file-name">{name}</span>
              <span className="uf-file-type">{getFileLabel(ext)}</span>
            </div>
          </div>
        </td>
        <td className="uf-size">{size}</td>
        <td className="uf-date">{date}</td>
        <td><StatusBadge status={status} /></td>
        <td style={{ position: "relative" }}>
          <button
            className={`uf-action-btn${menuOpen ? " active" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            title="More actions"
          >
            <DotsIcon />
          </button>
          {menuOpen && (
            <ActionMenu
              onDownload={() => { setMenuOpen(false); onDownload && onDownload(id, name); }}
              onRename={()   => { setMenuOpen(false); setShowRename(true); }}
              onDelete={()   => { setMenuOpen(false); setShowDelete(true); }}
              onClose={()    => setMenuOpen(false)}
            />
          )}
        </td>
      </tr>

      {showDelete && (
        <DeleteModal
          fileName={name}
          onConfirm={() => { setShowDelete(false); onDelete && onDelete(id); }}
          onClose={()   => setShowDelete(false)}
        />
      )}
      {showRename && (
        <RenameModal
          fileName={name}
          onConfirm={(newName) => { setShowRename(false); onRename && onRename(id, newName); }}
          onClose={()          => setShowRename(false)}
        />
      )}
    </>
  );
};

export default FileRow;