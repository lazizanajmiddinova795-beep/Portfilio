"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";
import {
  Upload,
  Image as ImageIcon,
  FileText,
  Trash2,
  Copy,
  Check,
  X,
  Grid3X3,
  List,
  Search,
  CloudOff,
  RefreshCw,
} from "lucide-react";
import { deleteMediumAction } from "@/lib/actions/cms.actions";

// ── Types ─────────────────────────────────────────────────────────────────────

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  alt: string | null;
  type: string;
  size: number | null;
  mimeType: string | null;
  createdAt: Date;
}

type FilterType = "all" | "image" | "pdf";
type ViewMode = "grid" | "list";

interface UploadingFile {
  id: string;
  name: string;
  progress: number;
  status: "uploading" | "done" | "error";
  error?: string;
}

interface Props {
  mediaItems: MediaItem[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatBytes(bytes: number | null): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function MediaCard({
  item,
  onDelete,
}: {
  item: MediaItem;
  onDelete: (id: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(item.url);
      setCopied(true);
      toast.success("URL copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${item.filename}"? This cannot be undone.`)) return;
    setDeleting(true);
    const res = await deleteMediumAction(item.id);
    if (res.success) {
      onDelete(item.id);
      toast.success("File deleted");
    } else {
      toast.error(res.error ?? "Delete failed");
      setDeleting(false);
    }
  };

  const isImage = item.type === "image";

  return (
    <div
      className="group relative rounded-2xl overflow-hidden transition-transform duration-200 hover:-translate-y-1"
      style={{
        background: "var(--neu-bg, #e8f0e8)",
        boxShadow:
          "8px 8px 16px var(--neu-shadow-dark, #c8d8c8), -8px -8px 16px var(--neu-shadow-light, #ffffff)",
      }}
    >
      {/* Preview area */}
      <div className="relative h-44 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center overflow-hidden">
        {isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.url}
            alt={item.alt ?? item.filename}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-green-700">
            <FileText size={48} strokeWidth={1.5} />
            <span className="text-xs font-semibold uppercase tracking-wider">
              PDF
            </span>
          </div>
        )}

        {/* Action overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
          <button
            onClick={copyUrl}
            title="Copy URL"
            className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-green-700 hover:bg-green-500 hover:text-white transition-colors shadow-md"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            title="Delete"
            className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-md disabled:opacity-50"
          >
            {deleting ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}
          </button>
        </div>
      </div>

      {/* Info footer */}
      <div className="p-3">
        <p
          className="text-sm font-medium text-gray-800 truncate"
          title={item.filename}
        >
          {item.filename}
        </p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-500">{formatBytes(item.size)}</span>
          <span className="text-xs text-gray-400">{formatDate(item.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

function MediaListRow({
  item,
  onDelete,
}: {
  item: MediaItem;
  onDelete: (id: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(item.url);
      setCopied(true);
      toast.success("URL copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${item.filename}"?`)) return;
    setDeleting(true);
    const res = await deleteMediumAction(item.id);
    if (res.success) {
      onDelete(item.id);
      toast.success("File deleted");
    } else {
      toast.error(res.error ?? "Delete failed");
      setDeleting(false);
    }
  };

  return (
    <div
      className="flex items-center gap-4 p-3 rounded-xl hover:shadow-inner transition-all"
      style={{
        background: "var(--neu-bg, #e8f0e8)",
        boxShadow:
          "4px 4px 8px var(--neu-shadow-dark, #c8d8c8), -4px -4px 8px var(--neu-shadow-light, #ffffff)",
      }}
    >
      {/* Thumbnail */}
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-green-100 flex-shrink-0 flex items-center justify-center">
        {item.type === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.url}
            alt={item.filename}
            className="w-full h-full object-cover"
          />
        ) : (
          <FileText size={22} className="text-green-700" />
        )}
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{item.filename}</p>
        <p className="text-xs text-gray-500">{item.mimeType ?? item.type}</p>
      </div>

      <span className="text-xs text-gray-500 hidden sm:block w-20 text-right">
        {formatBytes(item.size)}
      </span>
      <span className="text-xs text-gray-400 hidden md:block w-28 text-right">
        {formatDate(item.createdAt)}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={copyUrl}
          title="Copy URL"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-green-700 hover:bg-green-100 transition-colors"
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          title="Delete"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          {deleting ? (
            <RefreshCw size={15} className="animate-spin" />
          ) : (
            <Trash2 size={15} />
          )}
        </button>
      </div>
    </div>
  );
}

// ── Upload progress bar ───────────────────────────────────────────────────────

function UploadProgressItem({ item }: { item: UploadingFile }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/60 border border-green-100">
      <div className="flex-shrink-0">
        {item.status === "error" ? (
          <X size={18} className="text-red-500" />
        ) : item.status === "done" ? (
          <Check size={18} className="text-green-600" />
        ) : (
          <Upload size={18} className="text-green-500 animate-bounce" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-700 truncate">{item.name}</p>
        {item.status === "error" && (
          <p className="text-xs text-red-500">{item.error}</p>
        )}
        {item.status === "uploading" && (
          <div className="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${item.progress}%` }}
            />
          </div>
        )}
        {item.status === "done" && (
          <p className="text-xs text-green-600">Uploaded successfully</p>
        )}
      </div>
      <span className="text-xs text-gray-400 flex-shrink-0">
        {item.status === "uploading" ? `${item.progress}%` : ""}
      </span>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function MediaClient({ mediaItems: initial }: Props) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(initial);
  const [filter, setFilter] = useState<FilterType>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const [blobError, setBlobError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered + searched items
  const filteredItems = mediaItems.filter((item) => {
    const matchType = filter === "all" || item.type === filter;
    const matchSearch =
      !search || item.filename.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const handleDelete = useCallback((id: string) => {
    setMediaItems((prev) => prev.filter((m) => m.id !== id));
  }, []);

  // ── Upload logic ───────────────────────────────────────────────────────────

  const uploadFile = useCallback(
    (file: File) => {
      const uid = `${Date.now()}-${Math.random()}`;
      const entry: UploadingFile = {
        id: uid,
        name: file.name,
        progress: 0,
        status: "uploading",
      };
      setUploading((prev) => [...prev, entry]);

      const formData = new FormData();
      formData.append("file", file);

      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const pct = Math.round((e.loaded / e.total) * 100);
          setUploading((prev) =>
            prev.map((u) => (u.id === uid ? { ...u, progress: pct } : u))
          );
        }
      };

      xhr.onload = () => {
        try {
          const res = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300) {
            setUploading((prev) =>
              prev.map((u) => (u.id === uid ? { ...u, status: "done", progress: 100 } : u))
            );
            // Refresh list — re-fetch from server would need router.refresh
            // Instead we optimistically add the new item
            if (res.id && res.url && res.filename) {
              const newItem: MediaItem = {
                id: res.id,
                filename: res.filename,
                url: res.url,
                alt: null,
                type: res.url.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? "image" : "pdf",
                size: file.size,
                mimeType: file.type,
                createdAt: new Date(),
              };
              setMediaItems((prev) => [newItem, ...prev]);
              toast.success(`"${res.filename}" uploaded`);
            }
            setTimeout(() => {
              setUploading((prev) => prev.filter((u) => u.id !== uid));
            }, 3000);
          } else {
            const errMsg = res.error ?? "Upload failed";
            if (res.blobNotConfigured) {
              setBlobError(errMsg);
            }
            setUploading((prev) =>
              prev.map((u) =>
                u.id === uid ? { ...u, status: "error", error: errMsg } : u
              )
            );
            toast.error(errMsg);
          }
        } catch {
          setUploading((prev) =>
            prev.map((u) =>
              u.id === uid
                ? { ...u, status: "error", error: "Unexpected server response" }
                : u
            )
          );
          toast.error("Unexpected server response");
        }
      };

      xhr.onerror = () => {
        setUploading((prev) =>
          prev.map((u) =>
            u.id === uid ? { ...u, status: "error", error: "Network error" } : u
          )
        );
        toast.error("Network error during upload");
      };

      xhr.open("POST", "/api/admin/media/upload");
      xhr.send(formData);
    },
    []
  );

  const processFiles = useCallback(
    (files: FileList | File[]) => {
      Array.from(files).forEach(uploadFile);
    },
    [uploadFile]
  );

  // ── Drag-and-drop ──────────────────────────────────────────────────────────

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Clear done entries after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setUploading((prev) => prev.filter((u) => u.status !== "done"));
    }, 5000);
    return () => clearTimeout(timer);
  }, [uploading]);

  // ── Counts for filter badges ───────────────────────────────────────────────

  const counts = {
    all: mediaItems.length,
    image: mediaItems.filter((m) => m.type === "image").length,
    pdf: mediaItems.filter((m) => m.type === "pdf").length,
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Media Library</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {mediaItems.length} file{mediaItems.length !== 1 ? "s" : ""} stored
          </p>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all"
        >
          <Upload size={16} />
          Upload Files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) {
              processFiles(e.target.files);
              e.target.value = "";
            }
          }}
        />
      </div>

      {/* ── Blob not configured warning ── */}
      {blobError && (
        <div
          className="flex items-start gap-3 p-4 rounded-2xl border border-amber-200 bg-amber-50"
          style={{
            boxShadow: "4px 4px 10px #e8d8b0, -4px -4px 10px #fffde0",
          }}
        >
          <CloudOff size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              Blob Storage Not Connected
            </p>
            <p className="text-xs text-amber-700 mt-0.5">{blobError}</p>
          </div>
        </div>
      )}

      {/* ── Drop zone ── */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? "border-green-500 bg-green-50 scale-[1.01]"
            : "border-green-200 hover:border-green-400 hover:bg-green-50/50"
        }`}
      >
        <div className="flex flex-col items-center gap-2 pointer-events-none">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
              isDragging ? "bg-green-500 text-white" : "bg-green-100 text-green-600"
            }`}
          >
            <Upload size={26} />
          </div>
          <p className="text-sm font-semibold text-gray-700">
            {isDragging ? "Drop files here!" : "Drag & drop files, or click to browse"}
          </p>
          <p className="text-xs text-gray-400">
            JPEG, PNG, WebP, GIF, PDF — max 10 MB each
          </p>
        </div>
      </div>

      {/* ── Upload progress list ── */}
      {uploading.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Uploading
          </p>
          {uploading.map((u) => (
            <UploadProgressItem key={u.id} item={u} />
          ))}
        </div>
      )}

      {/* ── Filter + Search + View toggles ── */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {(["all", "image", "pdf"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filter === f
                  ? "bg-green-500 text-white shadow-md"
                  : "text-gray-600 hover:bg-green-100"
              }`}
              style={
                filter !== f
                  ? {
                      background: "var(--neu-bg, #e8f0e8)",
                      boxShadow:
                        "3px 3px 6px var(--neu-shadow-dark, #c8d8c8), -3px -3px 6px var(--neu-shadow-light, #ffffff)",
                    }
                  : {}
              }
            >
              {f === "all" ? "All" : f === "image" ? "Images" : "PDFs"}
              <span className="ml-1.5 text-[10px] opacity-70">({counts[f]})</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Search */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1 sm:w-52"
            style={{
              background: "var(--neu-bg, #e8f0e8)",
              boxShadow:
                "inset 3px 3px 7px var(--neu-shadow-dark, #c8d8c8), inset -3px -3px 7px var(--neu-shadow-light, #ffffff)",
            }}
          >
            <Search size={14} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search files…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none w-full"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">
                <X size={13} />
              </button>
            )}
          </div>

          {/* View mode */}
          <div
            className="flex rounded-xl overflow-hidden"
            style={{
              background: "var(--neu-bg, #e8f0e8)",
              boxShadow:
                "4px 4px 8px var(--neu-shadow-dark, #c8d8c8), -4px -4px 8px var(--neu-shadow-light, #ffffff)",
            }}
          >
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2.5 transition-colors ${
                viewMode === "grid" ? "bg-green-500 text-white" : "text-gray-500 hover:text-green-600"
              }`}
              title="Grid view"
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2.5 transition-colors ${
                viewMode === "list" ? "bg-green-500 text-white" : "text-gray-500 hover:text-green-600"
              }`}
              title="List view"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Media grid / list ── */}
      {filteredItems.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 rounded-2xl"
          style={{
            background: "var(--neu-bg, #e8f0e8)",
            boxShadow:
              "8px 8px 16px var(--neu-shadow-dark, #c8d8c8), -8px -8px 16px var(--neu-shadow-light, #ffffff)",
          }}
        >
          {search || filter !== "all" ? (
            <>
              <Search size={40} className="text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No files match your search</p>
              <button
                onClick={() => { setSearch(""); setFilter("all"); }}
                className="mt-3 text-sm text-green-600 hover:underline"
              >
                Clear filters
              </button>
            </>
          ) : (
            <>
              <ImageIcon size={48} className="text-gray-200 mb-3" />
              <p className="text-gray-500 font-medium">No media files yet</p>
              <p className="text-xs text-gray-400 mt-1">
                Upload your first file using the drop zone above
              </p>
            </>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredItems.map((item) => (
            <MediaCard key={item.id} item={item} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="hidden md:flex items-center gap-4 px-3 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <div className="w-12 flex-shrink-0" />
            <span className="flex-1">Filename</span>
            <span className="w-20 text-right">Size</span>
            <span className="w-28 text-right">Uploaded</span>
            <div className="w-20" />
          </div>
          {filteredItems.map((item) => (
            <MediaListRow key={item.id} item={item} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* ── Footer info ── */}
      {filteredItems.length > 0 && (
        <p className="text-xs text-gray-400 text-center pb-2">
          Showing {filteredItems.length} of {mediaItems.length} file
          {mediaItems.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
