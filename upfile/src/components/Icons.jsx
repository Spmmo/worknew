// ── Upload / Cloud
export const UploadCloudIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);

export const FileTextIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="9" y1="13" x2="15" y2="13" />
    <line x1="9" y1="17" x2="13" y2="17" />
  </svg>
);

export const GridIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
  </svg>
);

export const ListIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

export const DotsIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" />
  </svg>
);

export const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

export const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);

export const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

export const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// ─── File Type Icons ───────────────────────────────────────────────────────────

// Excel / CSV / Spreadsheet — green
export const ExcelIcon = () => (
  <svg viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="8" fill="#dcfce7"/>
    <path d="M10 8h14l6 6v18a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z" fill="#fff" stroke="#16a34a" strokeWidth="1.5"/>
    <path d="M24 8v6h6" stroke="#16a34a" strokeWidth="1.5" fill="none"/>
    <path d="M14 20l4 5m0-5l-4 5" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="22" y1="20" x2="26" y2="25" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="26" y1="20" x2="22" y2="25" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

// Image — blue
export const ImageIcon = () => (
  <svg viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="8" fill="#dbeafe"/>
    <rect x="8" y="10" width="24" height="20" rx="3" fill="#fff" stroke="#2563eb" strokeWidth="1.5"/>
    <circle cx="14" cy="16" r="2.5" fill="#2563eb"/>
    <path d="M8 26l7-7 5 5 3-3 7 7" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

// PDF — red
export const PdfIcon = () => (
  <svg viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="8" fill="#fee2e2"/>
    <path d="M10 8h14l6 6v18a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z" fill="#fff" stroke="#dc2626" strokeWidth="1.5"/>
    <path d="M24 8v6h6" stroke="#dc2626" strokeWidth="1.5" fill="none"/>
    <line x1="13" y1="22" x2="27" y2="22" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round"/>
    <line x1="13" y1="26" x2="21" y2="26" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

// Word / DOC — blue dark
export const WordIcon = () => (
  <svg viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="8" fill="#dbeafe"/>
    <path d="M10 8h14l6 6v18a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z" fill="#fff" stroke="#1d4ed8" strokeWidth="1.5"/>
    <path d="M24 8v6h6" stroke="#1d4ed8" strokeWidth="1.5" fill="none"/>
    <path d="M13 20l2 8 3-5 3 5 2-8" stroke="#1d4ed8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

// PowerPoint / PPT — orange
export const PptIcon = () => (
  <svg viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="8" fill="#ffedd5"/>
    <path d="M10 8h14l6 6v18a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z" fill="#fff" stroke="#ea580c" strokeWidth="1.5"/>
    <path d="M24 8v6h6" stroke="#ea580c" strokeWidth="1.5" fill="none"/>
    <rect x="13" y="19" width="8" height="9" rx="1" fill="none" stroke="#ea580c" strokeWidth="1.5"/>
    <line x1="21" y1="23" x2="27" y2="23" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="21" y1="26" x2="25" y2="26" stroke="#ea580c" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// ZIP / Archive — yellow
export const ZipIcon = () => (
  <svg viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="8" fill="#fef9c3"/>
    <path d="M10 8h14l6 6v18a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z" fill="#fff" stroke="#ca8a04" strokeWidth="1.5"/>
    <path d="M24 8v6h6" stroke="#ca8a04" strokeWidth="1.5" fill="none"/>
    <line x1="18" y1="18" x2="22" y2="18" stroke="#ca8a04" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="18" y1="21" x2="22" y2="21" stroke="#ca8a04" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="18" y1="24" x2="22" y2="24" stroke="#ca8a04" strokeWidth="1.5" strokeLinecap="round"/>
    <rect x="17" y="25" width="6" height="5" rx="1" fill="#ca8a04"/>
    <line x1="20" y1="27" x2="20" y2="29" stroke="#fff" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

// Video — purple
export const VideoIcon = () => (
  <svg viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="8" fill="#ede9fe"/>
    <rect x="8" y="12" width="18" height="16" rx="2" fill="#fff" stroke="#7c3aed" strokeWidth="1.5"/>
    <path d="M26 16l6-3v14l-6-3V16z" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M14 17l6 3-6 3v-6z" fill="#7c3aed"/>
  </svg>
);

// Audio / MP3 — pink
export const AudioIcon = () => (
  <svg viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="8" fill="#fce7f3"/>
    <path d="M10 8h14l6 6v18a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z" fill="#fff" stroke="#db2777" strokeWidth="1.5"/>
    <path d="M24 8v6h6" stroke="#db2777" strokeWidth="1.5" fill="none"/>
    <circle cx="16" cy="26" r="3" fill="none" stroke="#db2777" strokeWidth="1.5"/>
    <circle cx="24" cy="24" r="3" fill="none" stroke="#db2777" strokeWidth="1.5"/>
    <line x1="19" y1="26" x2="19" y2="18" stroke="#db2777" strokeWidth="1.5"/>
    <line x1="27" y1="24" x2="27" y2="16" stroke="#db2777" strokeWidth="1.5"/>
    <line x1="19" y1="18" x2="27" y2="16" stroke="#db2777" strokeWidth="1.5"/>
  </svg>
);

// Code — teal
export const CodeIcon = () => (
  <svg viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="8" fill="#ccfbf1"/>
    <path d="M10 8h14l6 6v18a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z" fill="#fff" stroke="#0d9488" strokeWidth="1.5"/>
    <path d="M24 8v6h6" stroke="#0d9488" strokeWidth="1.5" fill="none"/>
    <path d="M15 21l-3 3 3 3" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M25 21l3 3-3 3" stroke="#0d9488" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <line x1="22" y1="19" x2="18" y2="29" stroke="#0d9488" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Text / TXT — gray
export const TxtIcon = () => (
  <svg viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="8" fill="#f1f5f9"/>
    <path d="M10 8h14l6 6v18a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z" fill="#fff" stroke="#64748b" strokeWidth="1.5"/>
    <path d="M24 8v6h6" stroke="#64748b" strokeWidth="1.5" fill="none"/>
    <line x1="13" y1="20" x2="27" y2="20" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="13" y1="24" x2="27" y2="24" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="13" y1="28" x2="21" y2="28" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// Generic / Unknown — gray
export const FileIcon = () => (
  <svg viewBox="0 0 40 40" fill="none">
    <rect width="40" height="40" rx="8" fill="#f8fafc"/>
    <path d="M10 8h14l6 6v18a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z" fill="#fff" stroke="#94a3b8" strokeWidth="1.5"/>
    <path d="M24 8v6h6" stroke="#94a3b8" strokeWidth="1.5" fill="none"/>
    <line x1="13" y1="22" x2="27" y2="22" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="13" y1="26" x2="27" y2="26" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// ─── Helper: map extension → icon component ───────────────────────────────────
export const getFileIcon = (ext = "") => {
  const e = ext.toLowerCase();
  if (["xlsx", "xls", "csv", "numbers"].includes(e))        return <ExcelIcon />;
  if (["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "ico"].includes(e)) return <ImageIcon />;
  if (["pdf"].includes(e))                                   return <PdfIcon />;
  if (["doc", "docx", "odt", "rtf"].includes(e))            return <WordIcon />;
  if (["ppt", "pptx", "odp", "key"].includes(e))            return <PptIcon />;
  if (["zip", "rar", "7z", "tar", "gz", "bz2"].includes(e)) return <ZipIcon />;
  if (["mp4", "mov", "avi", "mkv", "webm", "flv"].includes(e)) return <VideoIcon />;
  if (["mp3", "wav", "aac", "flac", "ogg", "m4a"].includes(e)) return <AudioIcon />;
  if (["js", "jsx", "ts", "tsx", "html", "css", "py", "java", "c", "cpp", "go", "rb", "php", "json", "xml", "yaml", "yml", "sh"].includes(e)) return <CodeIcon />;
  if (["txt", "md", "log"].includes(e))                      return <TxtIcon />;
  return <FileIcon />;
};

// ─── Helper: map extension → label ────────────────────────────────────────────
export const getFileLabel = (ext = "") => {
  const e = ext.toLowerCase();
  if (["xlsx", "xls", "numbers"].includes(e)) return "Spreadsheet";
  if (e === "csv")   return "CSV File";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(e)) return "Image File";
  if (e === "pdf")   return "PDF Document";
  if (["doc", "docx", "odt", "rtf"].includes(e)) return "Word Document";
  if (["ppt", "pptx", "key"].includes(e)) return "Presentation";
  if (["zip", "rar", "7z", "tar", "gz"].includes(e)) return "Archive File";
  if (["mp4", "mov", "avi", "mkv", "webm"].includes(e)) return "Video File";
  if (["mp3", "wav", "aac", "flac", "ogg"].includes(e)) return "Audio File";
  if (["js", "jsx", "ts", "tsx"].includes(e)) return "JavaScript File";
  if (e === "html")  return "HTML File";
  if (e === "css")   return "CSS File";
  if (e === "py")    return "Python File";
  if (e === "json")  return "JSON File";
  if (["txt", "log"].includes(e)) return "Text File";
  if (e === "md")    return "Markdown File";
  return `${e.toUpperCase()} File`;
};