"use client";

import { useState, useEffect, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Plus,
  X,
  Pencil,
  Trash2,
  Globe,
  Link2,
  Image as ImageIcon,
  Star,
  StarOff,
  ExternalLink,
  Layers,
  ChevronDown,
  PlusCircle,
  MinusCircle,
  Loader2,
} from "lucide-react";
import { DataTable } from "@/components/admin/ui/DataTable";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { EmptyState } from "@/components/admin/ui/EmptyState";
import {
  createProjectAction,
  updateProjectAction,
  deleteProjectAction,
} from "@/lib/actions/cms.actions";
import type { ProjectInput } from "@/lib/validations/schemas";
import type { Project } from "@/lib/generated/prisma";

// ─── Types ────────────────────────────────────────────────────────────────────

type LangKey = "en" | "uz" | "ru";

interface LangContent {
  tagline: string;
  description: string;
  features: string[];
}

interface I18nData {
  en: LangContent;
  uz: LangContent;
  ru: LangContent;
}

const defaultLangContent = (): LangContent => ({
  tagline: "",
  description: "",
  features: [],
});

const defaultI18n = (): I18nData => ({
  en: defaultLangContent(),
  uz: defaultLangContent(),
  ru: defaultLangContent(),
});

interface FormState {
  name: string;
  slug: string;
  gradient: string;
  liveUrl: string;
  githubUrl: string;
  imageUrl: string;
  status: "DRAFT" | "PUBLISHED";
  featured: boolean;
  order: number;
  i18n: I18nData;
}

const defaultForm = (): FormState => ({
  name: "",
  slug: "",
  gradient: "",
  liveUrl: "",
  githubUrl: "",
  imageUrl: "",
  status: "DRAFT",
  featured: false,
  order: 0,
  i18n: defaultI18n(),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function safeI18n(raw: unknown): I18nData {
  if (!raw || typeof raw !== "object") return defaultI18n();
  const r = raw as Record<string, unknown>;
  const parseLang = (l: unknown): LangContent => {
    if (!l || typeof l !== "object") return defaultLangContent();
    const lObj = l as Record<string, unknown>;
    return {
      tagline: typeof lObj.tagline === "string" ? lObj.tagline : "",
      description: typeof lObj.description === "string" ? lObj.description : "",
      features: Array.isArray(lObj.features)
        ? (lObj.features as unknown[]).map((f) => String(f))
        : [],
    };
  };
  return {
    en: parseLang(r.en),
    uz: parseLang(r.uz),
    ru: parseLang(r.ru),
  };
}

// ─── Language tab config ───────────────────────────────────────────────────────

const LANG_TABS: { key: LangKey; label: string; flag: string }[] = [
  { key: "en", label: "English", flag: "🇬🇧" },
  { key: "uz", label: "O'zbek", flag: "🇺🇿" },
  { key: "ru", label: "Russian", flag: "🇷🇺" },
];

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const isPublished = status === "PUBLISHED";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${
        isPublished
          ? "bg-green-100 text-green-700 border border-green-200"
          : "bg-orange-100 text-orange-700 border border-orange-200"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
          isPublished ? "bg-green-500" : "bg-orange-500"
        }`}
      />
      {isPublished ? "Published" : "Draft"}
    </span>
  );
}

// ─── Input/Textarea classes ────────────────────────────────────────────────────

const inputCls =
  "w-full px-4 py-2.5 rounded-xl text-sm text-gray-800 bg-[#e8f0e8] " +
  "shadow-[inset_4px_4px_8px_#c8d8c8,inset_-4px_-4px_8px_#ffffff] " +
  "border-none outline-none focus:ring-2 focus:ring-green-400/50 placeholder:text-gray-400 transition";

const textareaCls =
  inputCls + " resize-none min-h-[100px] leading-relaxed";

// ─── Main component ────────────────────────────────────────────────────────────

interface Props {
  projects: Project[];
}

export default function ProjectsClient({ projects: initialProjects }: Props) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm());
  const [activeTab, setActiveTab] = useState<LangKey>("en");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Auto-generate slug from name
  useEffect(() => {
    if (!slugManuallyEdited && form.name) {
      setForm((prev) => ({ ...prev, slug: slugify(form.name) }));
    }
  }, [form.name, slugManuallyEdited]);

  // ── Open modal ──────────────────────────────────────────────────────────────

  function openCreate() {
    setEditingProject(null);
    setForm(defaultForm());
    setActiveTab("en");
    setSlugManuallyEdited(false);
    setIsModalOpen(true);
  }

  function openEdit(project: Project) {
    setEditingProject(project);
    setForm({
      name: project.name,
      slug: project.slug,
      gradient: project.gradient ?? "",
      liveUrl: project.liveUrl ?? "",
      githubUrl: project.githubUrl ?? "",
      imageUrl: project.imageUrl ?? "",
      status: project.status as "DRAFT" | "PUBLISHED",
      featured: project.featured,
      order: project.order,
      i18n: safeI18n(project.i18n),
    });
    setActiveTab("en");
    setSlugManuallyEdited(true);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingProject(null);
  }

  // ── i18n field helpers ───────────────────────────────────────────────────────

  function setLangField(lang: LangKey, field: keyof LangContent, value: string) {
    setForm((prev) => ({
      ...prev,
      i18n: {
        ...prev.i18n,
        [lang]: { ...prev.i18n[lang], [field]: value },
      },
    }));
  }

  function addFeature(lang: LangKey) {
    setForm((prev) => ({
      ...prev,
      i18n: {
        ...prev.i18n,
        [lang]: {
          ...prev.i18n[lang],
          features: [...prev.i18n[lang].features, ""],
        },
      },
    }));
  }

  function updateFeature(lang: LangKey, index: number, value: string) {
    setForm((prev) => {
      const features = [...prev.i18n[lang].features];
      features[index] = value;
      return {
        ...prev,
        i18n: {
          ...prev.i18n,
          [lang]: { ...prev.i18n[lang], features },
        },
      };
    });
  }

  function removeFeature(lang: LangKey, index: number) {
    setForm((prev) => {
      const features = prev.i18n[lang].features.filter((_, i) => i !== index);
      return {
        ...prev,
        i18n: {
          ...prev.i18n,
          [lang]: { ...prev.i18n[lang], features },
        },
      };
    });
  }

  // ── Submit ────────────────────────────────────────────────────────────────────

  function handleSubmit() {
    if (!form.name.trim() || !form.slug.trim()) {
      toast.error("Name and slug are required");
      return;
    }

    const payload: ProjectInput = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      gradient: form.gradient || undefined,
      liveUrl: form.liveUrl || "",
      githubUrl: form.githubUrl || "",
      imageUrl: form.imageUrl || "",
      status: form.status,
      featured: form.featured,
      order: form.order,
      i18n: {
        en: {
          tagline: form.i18n.en.tagline,
          description: form.i18n.en.description,
          features: form.i18n.en.features.filter(Boolean),
        },
        uz: {
          tagline: form.i18n.uz.tagline,
          description: form.i18n.uz.description,
          features: form.i18n.uz.features.filter(Boolean),
        },
        ru: {
          tagline: form.i18n.ru.tagline,
          description: form.i18n.ru.description,
          features: form.i18n.ru.features.filter(Boolean),
        },
      },
    };

    startTransition(async () => {
      const result = editingProject
        ? await updateProjectAction(editingProject.id, payload)
        : await createProjectAction(payload);

      if (result.success) {
        toast.success(
          editingProject ? "Project updated!" : "Project created!",
          { description: `"${form.name}" saved successfully.` }
        );
        // Optimistic UI — refresh from server via reload or update list
        // For simplicity, reload the page data by refreshing
        window.location.reload();
      } else {
        toast.error("Something went wrong", { description: result.error });
      }
    });
  }

  // ── Delete ───────────────────────────────────────────────────────────────────

  function handleDelete() {
    if (!deleteTarget) return;
    startTransition(async () => {
      const result = await deleteProjectAction(deleteTarget.id);
      if (result.success) {
        toast.success("Project deleted", {
          description: `"${deleteTarget.name}" removed.`,
        });
        setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      } else {
        toast.error("Delete failed", { description: result.error });
      }
      setDeleteTarget(null);
    });
  }

  // ── Table columns ─────────────────────────────────────────────────────────────

  const columns = [
    {
      header: "Name",
      accessorKey: "name" as keyof Project,
      cell: (p: Project) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">{p.name}</span>
          <span className="text-xs text-gray-400 font-mono mt-0.5">/{p.slug}</span>
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status" as keyof Project,
      cell: (p: Project) => <StatusBadge status={p.status} />,
    },
    {
      header: "Featured",
      accessorKey: "featured" as keyof Project,
      cell: (p: Project) =>
        p.featured ? (
          <span className="inline-flex items-center gap-1 text-yellow-600 text-sm font-medium">
            <Star className="w-4 h-4 fill-yellow-500" /> Yes
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-gray-400 text-sm">
            <StarOff className="w-4 h-4" /> No
          </span>
        ),
    },
    {
      header: "Order",
      accessorKey: "order" as keyof Project,
      cell: (p: Project) => (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-50 text-green-700 text-sm font-bold border border-green-100">
          {p.order}
        </span>
      ),
    },
    {
      header: "Links",
      accessorKey: "liveUrl" as keyof Project,
      cell: (p: Project) => (
        <div className="flex items-center gap-2">
          {p.liveUrl && (
            <a
              href={p.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
              title="Live URL"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {p.githubUrl && (
            <a
              href={p.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              title="GitHub"
            >
              <Link2 className="w-4 h-4" />
            </a>
          )}
          {!p.liveUrl && !p.githubUrl && (
            <span className="text-gray-300 text-xs">—</span>
          )}
        </div>
      ),
    },
  ];

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              background: "var(--neu-bg, #e8f0e8)",
              boxShadow:
                "8px 8px 16px var(--neu-shadow-dark, #c8d8c8), -8px -8px 16px var(--neu-shadow-light, #ffffff)",
            }}
          >
            <Layers className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
            <p className="text-sm text-gray-500">
              {projects.length} project{projects.length !== 1 ? "s" : ""} total
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white text-sm bg-green-600 hover:bg-green-700 transition-colors shadow-[0_4px_20px_rgba(34,197,94,0.4)]"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </motion.button>
      </div>

      {/* Table */}
      {projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Start building your portfolio by adding your first project."
          actionLabel="Add Project"
          onAction={openCreate}
          icon={<Layers className="w-8 h-8 text-green-600" />}
        />
      ) : (
        <DataTable
          data={projects}
          columns={columns}
          onEdit={openEdit}
          onDelete={(p) => setDeleteTarget(p)}
        />
      )}

      {/* ── Create/Edit Modal ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4"
            >
              <div
                className="w-full max-w-3xl rounded-3xl overflow-hidden"
                style={{
                  background: "var(--neu-bg, #e8f0e8)",
                  boxShadow:
                    "20px 20px 40px #c8d8c8, -20px -20px 40px #ffffff",
                }}
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-8 py-6 border-b border-green-100/60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                      <Layers className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        {editingProject ? "Edit Project" : "New Project"}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {editingProject
                          ? `Editing "${editingProject.name}"`
                          : "Fill in the project details below"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 rounded-xl hover:bg-green-100/60 text-gray-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="px-8 py-6 space-y-6">
                  {/* ── Common Fields ────────────────────────────────────────── */}
                  <Section title="Basic Info">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <Label>Project Name *</Label>
                        <input
                          className={inputCls}
                          placeholder="My Awesome App"
                          value={form.name}
                          onChange={(e) =>
                            setForm((prev) => ({ ...prev, name: e.target.value }))
                          }
                        />
                      </div>

                      {/* Slug */}
                      <div>
                        <Label>Slug *</Label>
                        <input
                          className={inputCls + " font-mono"}
                          placeholder="my-awesome-app"
                          value={form.slug}
                          onChange={(e) => {
                            setSlugManuallyEdited(true);
                            setForm((prev) => ({
                              ...prev,
                              slug: e.target.value,
                            }));
                          }}
                        />
                      </div>

                      {/* Gradient */}
                      <div>
                        <Label>Gradient / Color Class</Label>
                        <input
                          className={inputCls}
                          placeholder="from-green-400 to-blue-500"
                          value={form.gradient}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              gradient: e.target.value,
                            }))
                          }
                        />
                      </div>

                      {/* Order */}
                      <div>
                        <Label>Display Order</Label>
                        <input
                          type="number"
                          className={inputCls}
                          value={form.order}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              order: parseInt(e.target.value) || 0,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </Section>

                  {/* ── Media & Links ─────────────────────────────────────────── */}
                  <Section title="Media & Links">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Image URL */}
                      <div className="sm:col-span-2">
                        <Label icon={<ImageIcon className="w-3.5 h-3.5" />}>
                          Image URL
                        </Label>
                        <input
                          className={inputCls}
                          placeholder="https://..."
                          value={form.imageUrl}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              imageUrl: e.target.value,
                            }))
                          }
                        />
                      </div>

                      {/* Live URL */}
                      <div>
                        <Label icon={<Globe className="w-3.5 h-3.5" />}>
                          Live URL
                        </Label>
                        <input
                          className={inputCls}
                          placeholder="https://myapp.com"
                          value={form.liveUrl}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              liveUrl: e.target.value,
                            }))
                          }
                        />
                      </div>

                      {/* GitHub URL */}
                      <div>
                        <Label icon={<Link2 className="w-3.5 h-3.5" />}>
                          GitHub URL
                        </Label>
                        <input
                          className={inputCls}
                          placeholder="https://github.com/..."
                          value={form.githubUrl}
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              githubUrl: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </Section>

                  {/* ── Publish Settings ─────────────────────────────────────── */}
                  <Section title="Publish Settings">
                    <div className="flex flex-wrap gap-4 items-center">
                      {/* Status */}
                      <div className="flex-1 min-w-[180px]">
                        <Label>Status</Label>
                        <div className="relative">
                          <select
                            className={inputCls + " appearance-none pr-10 cursor-pointer"}
                            value={form.status}
                            onChange={(e) =>
                              setForm((prev) => ({
                                ...prev,
                                status: e.target.value as "DRAFT" | "PUBLISHED",
                              }))
                            }
                          >
                            <option value="DRAFT">Draft</option>
                            <option value="PUBLISHED">Published</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* Featured Toggle */}
                      <div className="flex items-center gap-3 mt-5">
                        <button
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              featured: !prev.featured,
                            }))
                          }
                          className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
                            form.featured ? "bg-yellow-400" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
                              form.featured ? "translate-x-6" : "translate-x-0"
                            }`}
                          />
                        </button>
                        <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                          {form.featured ? (
                            <>
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-500" />
                              Featured
                            </>
                          ) : (
                            <>
                              <StarOff className="w-4 h-4 text-gray-400" />
                              Not featured
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </Section>

                  {/* ── Multilingual Content ──────────────────────────────────── */}
                  <Section title="Multilingual Content">
                    {/* Language Tabs */}
                    <div className="flex gap-2 mb-5">
                      {LANG_TABS.map((tab) => (
                        <button
                          key={tab.key}
                          type="button"
                          onClick={() => setActiveTab(tab.key)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                            activeTab === tab.key
                              ? "text-green-700 shadow-[inset_4px_4px_8px_#c8d8c8,inset_-4px_-4px_8px_#ffffff]"
                              : "text-gray-500 hover:text-gray-700 shadow-[3px_3px_8px_#c8d8c8,-3px_-3px_8px_#ffffff]"
                          }`}
                          style={{ background: "var(--neu-bg, #e8f0e8)" }}
                        >
                          <span className="text-base">{tab.flag}</span>
                          <span>{tab.label}</span>
                          {/* Indicator dot if content exists */}
                          {(form.i18n[tab.key].tagline ||
                            form.i18n[tab.key].description ||
                            form.i18n[tab.key].features.length > 0) && (
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Tab Panel */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-4"
                      >
                        {/* Tagline */}
                        <div>
                          <Label>Tagline</Label>
                          <input
                            className={inputCls}
                            placeholder={
                              activeTab === "en"
                                ? "A powerful web application..."
                                : activeTab === "uz"
                                ? "Kuchli veb-ilova..."
                                : "Мощное веб-приложение..."
                            }
                            value={form.i18n[activeTab].tagline}
                            onChange={(e) =>
                              setLangField(activeTab, "tagline", e.target.value)
                            }
                          />
                        </div>

                        {/* Description */}
                        <div>
                          <Label>Description</Label>
                          <textarea
                            className={textareaCls}
                            placeholder={
                              activeTab === "en"
                                ? "Describe the project..."
                                : activeTab === "uz"
                                ? "Loyiha haqida..."
                                : "Описание проекта..."
                            }
                            rows={4}
                            value={form.i18n[activeTab].description}
                            onChange={(e) =>
                              setLangField(
                                activeTab,
                                "description",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        {/* Features */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="mb-0">Features</Label>
                            <button
                              type="button"
                              onClick={() => addFeature(activeTab)}
                              className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600 hover:text-green-700 transition-colors"
                            >
                              <PlusCircle className="w-4 h-4" />
                              Add Feature
                            </button>
                          </div>

                          {form.i18n[activeTab].features.length === 0 ? (
                            <div className="py-4 text-center text-sm text-gray-400 rounded-xl border-2 border-dashed border-gray-200">
                              No features added yet
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {form.i18n[activeTab].features.map(
                                (feat, idx) => (
                                  <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2"
                                  >
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 text-xs font-bold flex items-center justify-center">
                                      {idx + 1}
                                    </span>
                                    <input
                                      className={inputCls}
                                      placeholder={`Feature ${idx + 1}`}
                                      value={feat}
                                      onChange={(e) =>
                                        updateFeature(
                                          activeTab,
                                          idx,
                                          e.target.value
                                        )
                                      }
                                    />
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeFeature(activeTab, idx)
                                      }
                                      className="flex-shrink-0 p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                    >
                                      <MinusCircle className="w-4 h-4" />
                                    </button>
                                  </motion.div>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </Section>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-green-100/60">
                  <button
                    onClick={closeModal}
                    disabled={isPending}
                    className="px-5 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-green-100/60 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: isPending ? 1 : 1.02 }}
                    whileTap={{ scale: isPending ? 1 : 0.98 }}
                    onClick={handleSubmit}
                    disabled={isPending}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-white text-sm bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-[0_4px_16px_rgba(34,197,94,0.4)]"
                  >
                    {isPending && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    {editingProject ? "Save Changes" : "Create Project"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Delete Confirm ──────────────────────────────────────────────────── */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Project"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isDestructive
      />
    </div>
  );
}

// ─── Small helper sub-components ─────────────────────────────────────────────

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl p-5 space-y-4"
      style={{
        background: "var(--neu-bg, #e8f0e8)",
        boxShadow:
          "inset 4px 4px 10px #c8d8c8, inset -4px -4px 10px #ffffff",
      }}
    >
      <h3 className="text-xs font-bold uppercase tracking-widest text-green-600 mb-1">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Label({
  children,
  icon,
  className = "",
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <label
      className={`flex items-center gap-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 ${className}`}
    >
      {icon && <span className="text-green-500">{icon}</span>}
      {children}
    </label>
  );
}
