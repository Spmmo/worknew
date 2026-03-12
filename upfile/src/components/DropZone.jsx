import { useState, useRef } from "react";
import { UploadCloudIcon, FileTextIcon } from "./Icons";

/**
 * DropZone
 * Props:
 *   onFiles(File[]) — callback เมื่อ user เลือก / drop ไฟล์
 */
const DropZone = ({ onFiles }) => {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (onFiles) onFiles(Array.from(e.dataTransfer.files));
  };

  const handleBrowse = (e) => {
    e.stopPropagation();
    inputRef.current?.click();
  };

  return (
    <div
      className={`uf-dropzone${dragging ? " dragging" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        className="uf-hidden-input"
        onChange={(e) => onFiles && onFiles(Array.from(e.target.files))}
      />

      <div className="uf-icon-circle">
        <UploadCloudIcon />
      </div>

      <div className="uf-drop-title">Drag and drop files here</div>
      <div className="uf-drop-sub">
        Support for large files, images, and documents.<br />
        Maximum file size: 50MB.
      </div>

      <button className="uf-btn-browse" onClick={handleBrowse}>
        <FileTextIcon />
        Browse Files
      </button>
    </div>
  );
};

export default DropZone;