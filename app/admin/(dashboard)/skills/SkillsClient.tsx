"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Zap,
  Code2,
  Server,
  Database,
  Wrench,
  Brain,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { skillSchema, type SkillInput } from "@/lib/validations/schemas";
import {
  createSkillAction,
  updateSkillAction,
  deleteSkillAction,
} from "@/lib/actions/cms.actions";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
  icon: string | null;
  order: number;
}

interface SkillsClientProps {
  skills: Skill[];
}

// ── Category config ───────────────────────────────────────────────────────────

const CATEGORIES = [
  { value: "frontend", label: "Frontend", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Code2 },
  { value: "backend",  label: "Backend",  color: "bg-purple-100 text-purple-700 border-purple-200", icon: Server },
  { value: "database", label: "Database", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Database },
  { value: "tools",    label: "Tools",    color: "bg-gray-100 text-gray-700 border-gray-200", icon: Wrench },
  { value: "ai",       label: "AI",       color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: Brain },
] as const;

type Category = (typeof CATEGORIES)[number]["value"];

function getCategoryConfig(cat: string) {
  return CATEGORIES.find((c) => c.value === cat) ?? CATEGORIES[3];
}

// ── Category Badge ────────────────────────────────────────────────────────────

function CategoryBadge({ category }: { category: string }) {
  const cfg = getCategoryConfig(category);
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cfg.color}`}
    >
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

// ── Level Progress Bar ────────────────────────────────────────────────────────

function LevelBar({ level }: { level: number }) {
  const color =
    level >= 80
      ? "from-emerald-400 to-green-500"
      : level >= 60
      ? "from-green-400 to-teal-400"
      : level >= 40
      ? "from-yellow-400 to-amber-400"
      : "from-red-400 to-rose-400";

  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <div className="flex-1 h-2 rounded-full bg-[#c8d8c8] overflow-hidden shadow-inner">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
        />
      </div>
      <span className="text-xs font-bold text-gray-600 w-8 text-right">{level}%</span>
    </div>
  );
}

// ── Slider Input ──────────────────────────────────────────────────────────────

function SliderField({
  value,
  onChange,
  error,
}: {
  value: number;
  onChange: (v: number) => void;
  error?: string;
}) {
  const color =
    value >= 80
      ? "#22c55e"
      : value >= 60
      ? "#10b981"
      : value >= 40
      ? "#f59e0b"
      : "#ef4444";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-700">
          Level <span className="text-red-500">*</span>
        </label>
        <span
          className="text-lg font-bold tabular-nums"
          style={{ color }}
        >
          {value}%
        </span>
      </div>
      <div className="relative py-2">
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${color} 0%, ${color} ${value}%, #c8d8c8 ${value}%, #c8d8c8 100%)`,
          }}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ── Modal Form ────────────────────────────────────────────────────────────────

interface ModalProps {
  skill: Skill | null;
  onClose: () => void;
  onSaved: () => void;
}

function SkillModal({ skill, onClose, onSaved }: ModalProps) {
  const isEdit = !!skill;
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SkillInput>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name:     skill?.name     ?? "",
      level:    skill?.level    ?? 70,
      category: (skill?.category as Category) ?? "frontend",
      icon:     skill?.icon     ?? "",
      order:    skill?.order    ?? 0,
    },
  });

  const levelValue = watch("level");

  async function onSubmit(data: SkillInput) {
    setSubmitting(true);
    try {
      const result = isEdit
        ? await updateSkillAction(skill!.id, data)
        : await createSkillAction(data);

      if (result.success) {
        toast.success(isEdit ? "Skill updated!" : "Skill created!");
        onSaved();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="relative z-10 w-full max-w-lg bg-[#e8f0e8] rounded-2xl shadow-[20px_20px_60px_#c8d8c8,-20px_-20px_60px_#ffffff] p-6 overflow-y-auto max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center shadow-[4px_4px_8px_#c8d8c8,-4px_-4px_8px_#ffffff]">
              <Zap className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">
              {isEdit ? "Edit Skill" : "Add Skill"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-green-50 transition-colors shadow-[4px_4px_8px_#c8d8c8,-4px_-4px_8px_#ffffff]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register("name")}
              placeholder="e.g. React, TypeScript..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#e8f0e8] text-gray-800 placeholder-gray-400 shadow-[inset_4px_4px_8px_#c8d8c8,inset_-4px_-4px_8px_#ffffff] border-none outline-none focus:ring-2 focus:ring-green-400 transition"
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              {...register("category")}
              className="w-full px-4 py-2.5 rounded-xl bg-[#e8f0e8] text-gray-800 shadow-[inset_4px_4px_8px_#c8d8c8,inset_-4px_-4px_8px_#ffffff] border-none outline-none focus:ring-2 focus:ring-green-400 transition appearance-none cursor-pointer"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>
            )}
          </div>

          {/* Level Slider */}
          <SliderField
            value={levelValue}
            onChange={(v) => setValue("level", v)}
            error={errors.level?.message}
          />

          {/* Icon */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Icon <span className="text-gray-400 font-normal">(optional, e.g. devicon class)</span>
            </label>
            <input
              {...register("icon")}
              placeholder="e.g. devicon-react-original"
              className="w-full px-4 py-2.5 rounded-xl bg-[#e8f0e8] text-gray-800 placeholder-gray-400 shadow-[inset_4px_4px_8px_#c8d8c8,inset_-4px_-4px_8px_#ffffff] border-none outline-none focus:ring-2 focus:ring-green-400 transition"
            />
          </div>

          {/* Order */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Order
            </label>
            <input
              type="number"
              {...register("order")}
              className="w-full px-4 py-2.5 rounded-xl bg-[#e8f0e8] text-gray-800 shadow-[inset_4px_4px_8px_#c8d8c8,inset_-4px_-4px_8px_#ffffff] border-none outline-none focus:ring-2 focus:ring-green-400 transition"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl font-semibold text-gray-600 bg-[#e8f0e8] shadow-[6px_6px_12px_#c8d8c8,-6px_-6px_12px_#ffffff] hover:shadow-[4px_4px_8px_#c8d8c8,-4px_-4px_8px_#ffffff] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 shadow-[6px_6px_12px_#c8d8c8,-6px_-6px_12px_#ffffff] hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEdit ? "Save Changes" : "Create Skill"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ── Delete Confirm Dialog ─────────────────────────────────────────────────────

interface DeleteDialogProps {
  skill: Skill;
  onClose: () => void;
  onDeleted: () => void;
}

function DeleteDialog({ skill, onClose, onDeleted }: DeleteDialogProps) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      const result = await deleteSkillAction(skill.id);
      if (result.success) {
        toast.success("Skill deleted!");
        onDeleted();
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative z-10 w-full max-w-sm bg-[#e8f0e8] rounded-2xl shadow-[20px_20px_60px_#c8d8c8,-20px_-20px_60px_#ffffff] p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shadow-[4px_4px_8px_#c8d8c8,-4px_-4px_8px_#ffffff]">
            <Trash2 className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Delete Skill?</h3>
        </div>
        <p className="text-gray-600 text-sm mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-800">{skill.name}</span>? This action cannot
          be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl font-semibold text-gray-600 bg-[#e8f0e8] shadow-[6px_6px_12px_#c8d8c8,-6px_-6px_12px_#ffffff] hover:shadow-[4px_4px_8px_#c8d8c8,-4px_-4px_8px_#ffffff] transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-red-500 to-rose-500 shadow-[6px_6px_12px_#c8d8c8,-6px_-6px_12px_#ffffff] hover:from-red-600 hover:to-rose-600 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main Client Component ─────────────────────────────────────────────────────

export function SkillsClient({ skills: initialSkills }: SkillsClientProps) {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [modalOpen, setModalOpen] = useState(false);
  const [editSkill, setEditSkill] = useState<Skill | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [sortField, setSortField] = useState<"name" | "level" | "order">("order");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // ── Helpers ────────────────────────────────────────────────────────────────

  function openCreate() {
    setEditSkill(null);
    setModalOpen(true);
  }

  function openEdit(skill: Skill) {
    setEditSkill(skill);
    setModalOpen(true);
  }

  function handleSaved() {
    setModalOpen(false);
    // Refresh by reloading the page (server component will re-fetch)
    window.location.reload();
  }

  function handleDeleted() {
    setDeleteTarget(null);
    setSkills((prev) => prev.filter((s) => s.id !== deleteTarget?.id));
  }

  function toggleSort(field: typeof sortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  }

  // ── Filtered + sorted data ─────────────────────────────────────────────────

  const filtered = skills
    .filter((s) => filterCategory === "all" || s.category === filterCategory)
    .sort((a, b) => {
      const mult = sortDir === "asc" ? 1 : -1;
      if (sortField === "name") return mult * a.name.localeCompare(b.name);
      if (sortField === "level") return mult * (a.level - b.level);
      return mult * (a.order - b.order);
    });

  // ── Counts by category ─────────────────────────────────────────────────────

  const catCounts = CATEGORIES.map((c) => ({
    ...c,
    count: skills.filter((s) => s.category === c.value).length,
  }));

  // ── Sort icon helper ───────────────────────────────────────────────────────

  function SortIcon({ field }: { field: typeof sortField }) {
    if (sortField !== field)
      return <ChevronUp className="w-3 h-3 opacity-30" />;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3 text-green-600" />
    ) : (
      <ChevronDown className="w-3 h-3 text-green-600" />
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Page Header ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">
            Skills
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {skills.length} skill{skills.length !== 1 ? "s" : ""} across{" "}
            {new Set(skills.map((s) => s.category)).size} categories
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-500 shadow-[6px_6px_12px_#c8d8c8,-6px_-6px_12px_#ffffff] hover:from-green-600 hover:to-emerald-600 hover:shadow-[4px_4px_8px_#c8d8c8,-4px_-4px_8px_#ffffff] transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Skill
        </button>
      </motion.div>

      {/* ── Category Summary Cards ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
      >
        {catCounts.map((cat) => {
          const Icon = cat.icon;
          const isActive = filterCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() =>
                setFilterCategory(isActive ? "all" : cat.value)
              }
              className={`flex flex-col items-center gap-1 p-4 rounded-xl transition-all text-center ${
                isActive
                  ? "bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-[4px_4px_8px_#c8d8c8,-4px_-4px_8px_#ffffff]"
                  : "bg-[#e8f0e8] text-gray-600 shadow-[6px_6px_12px_#c8d8c8,-6px_-6px_12px_#ffffff] hover:shadow-[4px_4px_8px_#c8d8c8,-4px_-4px_8px_#ffffff]"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-semibold">{cat.label}</span>
              <span
                className={`text-lg font-bold ${isActive ? "text-white" : "text-gray-800"}`}
              >
                {cat.count}
              </span>
            </button>
          );
        })}
      </motion.div>

      {/* ── Table Card ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#e8f0e8] rounded-2xl shadow-[8px_8px_16px_#c8d8c8,-8px_-8px_16px_#ffffff] overflow-hidden"
      >
        {/* Filter bar */}
        <div className="px-6 py-4 border-b border-[#c8d8c8] flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-600">
            {filterCategory === "all"
              ? `All Skills (${filtered.length})`
              : `${getCategoryConfig(filterCategory).label} (${filtered.length})`}
          </span>
          {filterCategory !== "all" && (
            <button
              onClick={() => setFilterCategory("all")}
              className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors"
            >
              Clear filter
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Zap className="w-12 h-12 mb-4 opacity-30" />
            <p className="font-semibold text-lg">No skills found</p>
            <p className="text-sm mt-1">
              {filterCategory !== "all"
                ? "Try clearing the filter or add a new skill."
                : "Click 'Add Skill' to get started."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-[#c8d8c8]">
                  <th
                    className="px-6 py-3 cursor-pointer hover:text-green-600 transition-colors select-none"
                    onClick={() => toggleSort("name")}
                  >
                    <span className="inline-flex items-center gap-1">
                      Name <SortIcon field="name" />
                    </span>
                  </th>
                  <th className="px-6 py-3">Category</th>
                  <th
                    className="px-6 py-3 cursor-pointer hover:text-green-600 transition-colors select-none"
                    onClick={() => toggleSort("level")}
                  >
                    <span className="inline-flex items-center gap-1">
                      Level <SortIcon field="level" />
                    </span>
                  </th>
                  <th
                    className="px-6 py-3 cursor-pointer hover:text-green-600 transition-colors select-none"
                    onClick={() => toggleSort("order")}
                  >
                    <span className="inline-flex items-center gap-1">
                      Order <SortIcon field="order" />
                    </span>
                  </th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c8d8c8]">
                <AnimatePresence initial={false}>
                  {filtered.map((skill, idx) => (
                    <motion.tr
                      key={skill.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: idx * 0.03 }}
                      className="hover:bg-white/40 transition-colors group"
                    >
                      {/* Name */}
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2.5">
                          {skill.icon ? (
                            <span
                              className="text-xl"
                              title={skill.icon}
                            >
                              <i className={skill.icon} />
                            </span>
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center shadow-inner text-green-700 text-xs font-bold uppercase">
                              {skill.name.charAt(0)}
                            </div>
                          )}
                          <span className="font-semibold text-gray-800">
                            {skill.name}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-3">
                        <CategoryBadge category={skill.category} />
                      </td>

                      {/* Level */}
                      <td className="px-6 py-3">
                        <LevelBar level={skill.level} />
                      </td>

                      {/* Order */}
                      <td className="px-6 py-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#e8f0e8] shadow-[3px_3px_6px_#c8d8c8,-3px_-3px_6px_#ffffff] text-xs font-bold text-gray-600">
                          {skill.order}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(skill)}
                            className="p-2 rounded-xl text-gray-500 hover:text-green-600 bg-[#e8f0e8] shadow-[4px_4px_8px_#c8d8c8,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_4px_#c8d8c8,-2px_-2px_4px_#ffffff] transition-all"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(skill)}
                            className="p-2 rounded-xl text-gray-500 hover:text-red-600 bg-[#e8f0e8] shadow-[4px_4px_8px_#c8d8c8,-4px_-4px_8px_#ffffff] hover:shadow-[2px_2px_4px_#c8d8c8,-2px_-2px_4px_#ffffff] transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* ── Modals ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {modalOpen && (
          <SkillModal
            skill={editSkill}
            onClose={() => setModalOpen(false)}
            onSaved={handleSaved}
          />
        )}
        {deleteTarget && (
          <DeleteDialog
            skill={deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onDeleted={handleDeleted}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
