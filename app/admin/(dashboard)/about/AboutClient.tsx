"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  Save,
  FileText,
  CheckCircle2,
  Clock,
  Loader2,
  ChevronDown,
  Eye,
  EyeOff,
} from "lucide-react";
import { saveAboutAction } from "@/lib/actions/cms.actions";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Highlight {
  icon: string;
  en: string;
  uz: string;
  ru: string;
}

interface AboutData {
  id: string;
  slug: string;
  content: { en?: string; uz?: string; ru?: string } | null;
  highlights: Highlight[] | null;
  imageUrl: string | null;
  status: "DRAFT" | "PUBLISHED";
  createdAt: Date;
  updatedAt: Date;
}

interface FormState {
  content: { en: string; uz: string; ru: string };
  highlights: Highlight[];
  imageUrl: string;
  status: "DRAFT" | "PUBLISHED";
}

// ── Constants ─────────────────────────────────────────────────────────────────

const LANGUAGES = [
  { code: "en" as const, label: "English", flag: "🇬🇧" },
  { code: "uz" as const, label: "O'zbek", flag: "🇺🇿" },
  { code: "ru" as const, label: "Русский", flag: "🇷🇺" },
];

const DEBOUNCE_MS = 3000;

const DEFAULT_HIGHLIGHT: Highlight = { icon: "✨", en: "", uz: "", ru: "" };

// ── Save Status Indicator ─────────────────────────────────────────────────────

type SaveStatus = "idle" | "pending" | "saving" | "saved" | "error";

function SaveIndicator({ status }: { status: SaveStatus }) {
  const map: Record<SaveStatus, { icon: React.ReactNode; text: string; color: string }> = {
    idle: {
      icon: <FileText size={14} />,
      text: "Unsaved changes",
      color: "text-gray-400",
    },
    pending: {
      icon: <Clock size={14} className="animate-pulse" />,
      text: "Auto-saving in 3s…",
      color: "text-amber-500",
    },
    saving: {
      icon: <Loader2 size={14} className="animate-spin" />,
      text: "Saving…",
      color: "text-green-500",
    },
    saved: {
      icon: <CheckCircle2 size={14} />,
      text: "All changes saved",
      color: "text-green-600",
    },
    error: {
      icon: <FileText size={14} />,
      text: "Save failed",
      color: "text-red-500",
    },
  };

  const { icon, text, color } = map[status];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 4 }}
        className={`flex items-center gap-1.5 text-xs font-medium ${color}`}
      >
        {icon}
        <span>{text}</span>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Character Counter ─────────────────────────────────────────────────────────

function CharCounter({ value, max = 2000 }: { value: string; max?: number }) {
  const count = value.length;
  const pct = count / max;
  const color =
    pct > 0.9 ? "text-red-500" : pct > 0.7 ? "text-amber-500" : "text-gray-400";

  return (
    <span className={`text-xs tabular-nums ${color}`}>
      {count.toLocaleString()} / {max.toLocaleString()}
    </span>
  );
}

// ── Neumorphic Textarea ───────────────────────────────────────────────────────

function NeuTextarea({
  value,
  onChange,
  placeholder,
  rows = 8,
  maxLength = 2000,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
}) {
  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className="w-full resize-none rounded-xl px-4 py-3 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none transition-all duration-200 leading-relaxed"
        style={{
          background: "var(--color-bg, #f0fdf4)",
          boxShadow:
            "inset 4px 4px 8px #d1e8d1, inset -4px -4px 8px #ffffff",
        }}
      />
      <div className="absolute bottom-3 right-3 pointer-events-none">
        <CharCounter value={value} max={maxLength} />
      </div>
    </div>
  );
}

// ── Neumorphic Input ──────────────────────────────────────────────────────────

function NeuInput({
  value,
  onChange,
  placeholder,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full rounded-xl px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none transition-all duration-200 ${className}`}
      style={{
        background: "var(--color-bg, #f0fdf4)",
        boxShadow: "inset 3px 3px 6px #d1e8d1, inset -3px -3px 6px #ffffff",
      }}
    />
  );
}

// ── Highlight Row ─────────────────────────────────────────────────────────────

function HighlightRow({
  highlight,
  index,
  onChange,
  onRemove,
}: {
  highlight: Highlight;
  index: number;
  onChange: (index: number, field: keyof Highlight, value: string) => void;
  onRemove: (index: number) => void;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: "var(--color-bg, #f0fdf4)",
        boxShadow: "6px 6px 12px #d1e8d1, -6px -6px 12px #ffffff",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <NeuInput
          value={highlight.icon}
          onChange={(v) => onChange(index, "icon", v)}
          placeholder="✨"
          className="w-16 text-center text-xl"
        />
        <NeuInput
          value={highlight.en}
          onChange={(v) => onChange(index, "en", v)}
          placeholder="Highlight title (EN)"
          className="flex-1"
        />
        <button
          onClick={() => setExpanded((p) => !p)}
          className="p-2 rounded-lg text-gray-400 hover:text-green-600 transition-colors"
          title={expanded ? "Collapse" : "Expand translations"}
        >
          <motion.div animate={{ rotate: expanded ? 0 : -90 }}>
            <ChevronDown size={16} />
          </motion.div>
        </button>
        <button
          onClick={() => onRemove(index)}
          className="p-2 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
          title="Remove highlight"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Translations */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {LANGUAGES.filter((l) => l.code !== "en").map((lang) => (
                <div key={lang.code} className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </label>
                  <NeuInput
                    value={highlight[lang.code]}
                    onChange={(v) => onChange(index, lang.code, v)}
                    placeholder={`Translation (${lang.label})`}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function AboutClient({ about }: { about: AboutData | null }) {
  const rawContent = (about?.content ?? {}) as { en?: string; uz?: string; ru?: string };
  const rawHighlights = (about?.highlights ?? []) as Highlight[];

  const [form, setForm] = useState<FormState>({
    content: {
      en: rawContent.en ?? "",
      uz: rawContent.uz ?? "",
      ru: rawContent.ru ?? "",
    },
    highlights: rawHighlights.length > 0 ? rawHighlights : [],
    imageUrl: about?.imageUrl ?? "",
    status: about?.status ?? "DRAFT",
  });

  const [activeTab, setActiveTab] = useState<"en" | "uz" | "ru">("en");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [isSaving, setIsSaving] = useState(false);
  const [imagePreviewError, setImagePreviewError] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  // ── Save handler ────────────────────────────────────────────────────────────

  const handleSave = useCallback(
    async (data: FormState) => {
      if (isSaving) return;
      setIsSaving(true);
      setSaveStatus("saving");

      const result = await saveAboutAction({
        content: data.content,
        highlights: data.highlights,
        imageUrl: data.imageUrl || undefined,
        status: data.status,
      });

      setIsSaving(false);
      if (result.success) {
        setSaveStatus("saved");
        toast.success("About section saved successfully!");
      } else {
        setSaveStatus("error");
        toast.error(result.error ?? "Failed to save. Please try again.");
      }
    },
    [isSaving]
  );

  // ── Auto-save debounce ──────────────────────────────────────────────────────

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setSaveStatus("pending");

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      handleSave(form);
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [form]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Form updaters ───────────────────────────────────────────────────────────

  const setContent = (lang: "en" | "uz" | "ru", value: string) => {
    setForm((prev) => ({
      ...prev,
      content: { ...prev.content, [lang]: value },
    }));
  };

  const addHighlight = () => {
    setForm((prev) => ({
      ...prev,
      highlights: [...prev.highlights, { ...DEFAULT_HIGHLIGHT }],
    }));
  };

  const removeHighlight = (index: number) => {
    setForm((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  const updateHighlight = (
    index: number,
    field: keyof Highlight,
    value: string
  ) => {
    setForm((prev) => {
      const updated = [...prev.highlights];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, highlights: updated };
    });
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400">
            About Editor
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Manage your About section content and highlights
          </p>
        </div>

        <div className="flex items-center gap-4">
          <SaveIndicator status={saveStatus} />

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSave(form)}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60"
            style={{
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              boxShadow: "4px 4px 10px #d1e8d1, -2px -2px 6px #ffffff",
            }}
          >
            {isSaving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            Save Now
          </motion.button>
        </div>
      </div>

      {/* ── Status & Image Row ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status */}
        <div
          className="rounded-2xl p-5 space-y-3"
          style={{
            background: "var(--color-bg, #f0fdf4)",
            boxShadow: "8px 8px 16px #d1e8d1, -8px -8px 16px #ffffff",
          }}
        >
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
            Publication Status
          </label>
          <div className="flex gap-3">
            {(["DRAFT", "PUBLISHED"] as const).map((s) => {
              const isActive = form.status === s;
              return (
                <button
                  key={s}
                  onClick={() => setForm((p) => ({ ...p, status: s }))}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "text-white"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  style={
                    isActive
                      ? {
                          background:
                            s === "PUBLISHED"
                              ? "linear-gradient(135deg, #22c55e, #16a34a)"
                              : "linear-gradient(135deg, #9ca3af, #6b7280)",
                          boxShadow: "3px 3px 8px #d1e8d1, -2px -2px 5px #ffffff",
                        }
                      : {
                          background: "var(--color-bg, #f0fdf4)",
                          boxShadow:
                            "inset 2px 2px 5px #d1e8d1, inset -2px -2px 5px #ffffff",
                        }
                  }
                >
                  {s === "PUBLISHED" ? (
                    <Eye size={14} />
                  ) : (
                    <EyeOff size={14} />
                  )}
                  {s === "PUBLISHED" ? "Published" : "Draft"}
                </button>
              );
            })}
          </div>
        </div>

        {/* Image URL */}
        <div
          className="rounded-2xl p-5 space-y-3"
          style={{
            background: "var(--color-bg, #f0fdf4)",
            boxShadow: "8px 8px 16px #d1e8d1, -8px -8px 16px #ffffff",
          }}
        >
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
            Profile Image URL
          </label>
          <div className="flex gap-3">
            <div className="flex-1">
              <NeuInput
                value={form.imageUrl}
                onChange={(v) => {
                  setForm((p) => ({ ...p, imageUrl: v }));
                  setImagePreviewError(false);
                }}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            {/* Preview thumbnail */}
            <div
              className="w-12 h-10 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0"
              style={{
                boxShadow: "inset 2px 2px 5px #d1e8d1, inset -2px -2px 5px #ffffff",
              }}
            >
              {form.imageUrl && !imagePreviewError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={() => setImagePreviewError(true)}
                />
              ) : (
                <ImageIcon size={18} className="text-gray-400" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Image Full Preview ── */}
      <AnimatePresence>
        {form.imageUrl && !imagePreviewError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                boxShadow: "8px 8px 16px #d1e8d1, -8px -8px 16px #ffffff",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.imageUrl}
                alt="About section image"
                className="w-full max-h-64 object-cover"
                onError={() => setImagePreviewError(true)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Content with Language Tabs ── */}
      <div
        className="rounded-2xl p-6 space-y-5"
        style={{
          background: "var(--color-bg, #f0fdf4)",
          boxShadow: "8px 8px 16px #d1e8d1, -8px -8px 16px #ffffff",
        }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            About Content
          </h2>
          <span className="text-xs text-gray-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg font-medium">
            Multilingual
          </span>
        </div>

        {/* Language Tab Pills */}
        <div
          className="flex gap-2 p-1.5 rounded-xl w-fit"
          style={{
            boxShadow: "inset 3px 3px 6px #d1e8d1, inset -3px -3px 6px #ffffff",
          }}
        >
          {LANGUAGES.map((lang) => {
            const isActive = activeTab === lang.code;
            const hasContent = form.content[lang.code].length > 0;
            return (
              <button
                key={lang.code}
                onClick={() => setActiveTab(lang.code)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                style={
                  isActive
                    ? {
                        background:
                          "linear-gradient(135deg, #22c55e, #16a34a)",
                        boxShadow:
                          "3px 3px 8px #d1e8d1, -2px -2px 5px #ffffff",
                      }
                    : {}
                }
              >
                <span className="text-base">{lang.flag}</span>
                <span>{lang.code.toUpperCase()}</span>
                {hasContent && !isActive && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-green-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Textarea */}
        <AnimatePresence mode="wait">
          {LANGUAGES.map((lang) =>
            activeTab === lang.code ? (
              <motion.div
                key={lang.code}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-2"
              >
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{lang.flag}</span>
                  <span className="font-medium">{lang.label}</span>
                  {lang.code === "en" && (
                    <span className="text-xs text-red-400 font-medium">* Required</span>
                  )}
                </div>
                <NeuTextarea
                  value={form.content[lang.code]}
                  onChange={(v) => setContent(lang.code, v)}
                  placeholder={`Write your about text in ${lang.label}…`}
                  rows={10}
                  maxLength={2000}
                />
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
      </div>

      {/* ── Highlights Section ── */}
      <div
        className="rounded-2xl p-6 space-y-5"
        style={{
          background: "var(--color-bg, #f0fdf4)",
          boxShadow: "8px 8px 16px #d1e8d1, -8px -8px 16px #ffffff",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
              Highlights
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Key facts / achievements shown in the About section
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={addHighlight}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
            style={{
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              boxShadow: "3px 3px 8px #d1e8d1, -2px -2px 5px #ffffff",
            }}
          >
            <Plus size={16} />
            Add Highlight
          </motion.button>
        </div>

        {/* Highlights List */}
        <AnimatePresence>
          {form.highlights.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 gap-3 text-gray-400"
              style={{
                boxShadow:
                  "inset 4px 4px 8px #d1e8d1, inset -4px -4px 8px #ffffff",
                borderRadius: 16,
              }}
            >
              <span className="text-5xl">✨</span>
              <p className="text-sm font-medium">No highlights yet</p>
              <p className="text-xs">Click &ldquo;Add Highlight&rdquo; to add your first item</p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {form.highlights.map((h, i) => (
                  <HighlightRow
                    key={i}
                    highlight={h}
                    index={i}
                    onChange={updateHighlight}
                    onRemove={removeHighlight}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </AnimatePresence>

        {/* Highlights count badge */}
        {form.highlights.length > 0 && (
          <div className="flex justify-end">
            <span className="text-xs text-gray-400 font-medium">
              {form.highlights.length} highlight{form.highlights.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {/* ── Bottom Save Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-between px-6 py-4 rounded-2xl"
        style={{
          background: "rgba(240, 253, 244, 0.85)",
          backdropFilter: "blur(16px)",
          boxShadow: "8px 8px 16px #d1e8d1, -8px -8px 16px #ffffff",
        }}
      >
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span className="font-medium">Slug:</span>
          <code className="px-2 py-0.5 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-mono">
            main
          </code>
          <span className="text-gray-300">|</span>
          <SaveIndicator status={saveStatus} />
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => handleSave(form)}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60"
          style={{
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            boxShadow: "4px 4px 10px #d1e8d1, -2px -2px 6px #ffffff",
          }}
        >
          {isSaving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {isSaving ? "Saving…" : "Save Changes"}
        </motion.button>
      </motion.div>
    </div>
  );
}
