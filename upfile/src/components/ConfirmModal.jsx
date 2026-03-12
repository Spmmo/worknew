import { useState, useEffect, useRef } from "react";
import { TrashIcon, EditIcon, CloseIcon } from "./Icons";

/** ── Delete Confirm Modal ── */
export const DeleteModal = ({ fileName, onConfirm, onClose }) => (
  <div className="uf-overlay" onClick={onClose}>
    <div className="uf-modal" onClick={(e) => e.stopPropagation()}>
      <div className="uf-modal-header">
        <div className="uf-modal-title danger">
          <TrashIcon /> Delete File
        </div>
        <button className="uf-modal-close" onClick={onClose}><CloseIcon /></button>
      </div>
      <div className="uf-modal-body">
        Are you sure you want to delete <strong>"{fileName}"</strong>?<br />
        This action cannot be undone.
      </div>
      <div className="uf-modal-actions">
        <button className="uf-modal-btn uf-modal-btn--cancel" onClick={onClose}>Cancel</button>
        <button className="uf-modal-btn uf-modal-btn--danger" onClick={onConfirm}>Delete</button>
      </div>
    </div>
  </div>
);

/** ── Rename Modal ── */
export const RenameModal = ({ fileName, onConfirm, onClose }) => {
  const [value, setValue] = useState(fileName);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleConfirm = () => {
    if (value.trim() && value.trim() !== fileName) {
      onConfirm(value.trim());
    } else {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleConfirm();
    if (e.key === "Escape") onClose();
  };

  return (
    <div className="uf-overlay" onClick={onClose}>
      <div className="uf-modal" onClick={(e) => e.stopPropagation()}>
        <div className="uf-modal-header">
          <div className="uf-modal-title">
            <EditIcon /> Rename File
          </div>
          <button className="uf-modal-close" onClick={onClose}><CloseIcon /></button>
        </div>
        <div className="uf-modal-body">
          Enter a new name for <strong>"{fileName}"</strong>
        </div>
        <input
          ref={inputRef}
          className="uf-modal-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="New file name"
        />
        <div className="uf-modal-actions">
          <button className="uf-modal-btn uf-modal-btn--cancel" onClick={onClose}>Cancel</button>
          <button className="uf-modal-btn uf-modal-btn--primary" onClick={handleConfirm}>Save</button>
        </div>
      </div>
    </div>
  );
};