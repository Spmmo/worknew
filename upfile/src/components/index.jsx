import { useState } from "react";
import DropZone from "./DropZone";
import RecentUploads from "./RecentUploads";

const UploadFilePage = () => {
  const [files, setFiles] = useState([]);

  // ── Upload: เพิ่มไฟล์ใหม่จาก DropZone
  const handleUpload = (newFiles) => {
    const mapped = newFiles.map((f, i) => {
      const ext = f.name.split(".").pop().toLowerCase();
      return {
        id: Date.now() + i,
        name: f.name,
        ext,
        size: f.size > 1024 * 1024
          ? `${(f.size / 1024 / 1024).toFixed(1)} MB`
          : `${(f.size / 1024).toFixed(0)} KB`,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        status: "Processing",
        fileObject: f,
      };
    });

    setFiles((prev) => [...mapped, ...prev]);

    mapped.forEach((f) => {
      setTimeout(() => {
        setFiles((prev) =>
          prev.map((item) => item.id === f.id ? { ...item, status: "Completed" } : item)
        );
      }, 3000);
    });
  };

  // ── Delete
  const handleDelete = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // ── Rename
  const handleRename = (id, newName) => {
    setFiles((prev) =>
      prev.map((f) => f.id === id ? { ...f, name: newName } : f)
    );
  };

  // ── Download
  const handleDownload = (id, fileName) => {
    const file = files.find((f) => f.id === id);
    if (!file) return;

    if (file.fileUrl) {
      const a = document.createElement("a");
      a.href = file.fileUrl;
      a.download = fileName || file.name;
      a.click();
    } else if (file.fileObject) {
      const url = URL.createObjectURL(file.fileObject);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || file.name;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="uf-page">
      <p className="uf-subtitle">
        Upload and manage your project assets and documents.
      </p>
      <DropZone onFiles={handleUpload} />
      <RecentUploads
        files={files}
        totalCount={files.length}
        onDelete={handleDelete}
        onRename={handleRename}
        onDownload={handleDownload}
      />
    </div>
  );
};

export default UploadFilePage;