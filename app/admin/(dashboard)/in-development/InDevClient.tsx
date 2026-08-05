"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Clock, Tag } from "lucide-react";
import { inDevSchema, type InDevInput } from "@/lib/validations/schemas";
import { createInDevAction, updateInDevAction, deleteInDevAction } from "@/lib/actions/cms.actions";

interface InDevItem {
  id: string;
  slug: string;
  icon: string | null;
  i18n: Record<string, { title?: string; description?: string }>;
  tags: string[];
  progress: number;
  status: "DRAFT" | "PUBLISHED";
  order: number;
}

const LANGS = [
  { code: "en", label: "🇬🇧 EN" },
  { code: "uz", label: "🇺🇿 UZ" },
  { code: "ru", label: "🇷🇺 RU" },
] as const;

export default function InDevClient({ items }: { items: InDevItem[] }) {
  const [list, setList] = useState(items);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<InDevItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeLang, setActiveLang] = useState<"en" | "uz" | "ru">("en");
  const [tagInput, setTagInput] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<InDevInput>({
    resolver: zodResolver(inDevSchema) as any,
    defaultValues: {
      slug: "",
      icon: "",
      i18n: { en: { title: "", description: "" }, uz: { title: "", description: "" }, ru: { title: "", description: "" } },
      tags: [],
      progress: 0,
      status: "DRAFT",
      order: 0,
    },
  });

  const tags = form.watch("tags") || [];
  const progress = form.watch("progress");

  function addTag(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag && !tags.includes(tag)) {
        form.setValue("tags", [...tags, tag]);
        setTagInput("");
      }
    }
  }

  function openCreate() {
    setEditing(null);
    form.reset({
      slug: "",
      icon: "🚀",
      i18n: { en: { title: "", description: "" }, uz: { title: "", description: "" }, ru: { title: "", description: "" } },
      tags: [],
      progress: 0,
      status: "DRAFT",
      order: list.length,
    });
    setOpen(true);
  }

  function openEdit(item: InDevItem) {
    setEditing(item);
    form.reset({
      slug: item.slug,
      icon: item.icon || "🚀",
      i18n: {
        en: item.i18n?.en || { title: "", description: "" },
        uz: item.i18n?.uz || { title: "", description: "" },
        ru: item.i18n?.ru || { title: "", description: "" },
      },
      tags: item.tags || [],
      progress: item.progress,
      status: item.status,
      order: item.order,
    });
    setOpen(true);
  }

  async function handleSubmit(data: InDevInput) {
    const result = editing
      ? await updateInDevAction(editing.id, data)
      : await createInDevAction(data);

    if (result.success) {
      toast.success(editing ? "Updated!" : "Created!");
      setOpen(false);
      window.location.reload();
    } else {
      toast.error(result.error);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const result = await deleteInDevAction(id);
    setDeletingId(null);
    if (result.success) {
      setList((prev) => prev.filter((i) => i.id !== id));
      toast.success("Deleted");
    } else {
      toast.error(result.error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">In Development</h1>
          <p className="text-gray-500 text-sm mt-1">Coming soon projects and features</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 text-white font-semibold shadow-[4px_4px_8px_#c8d8c8,-4px_-4px_8px_#ffffff] hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)] transition-all"
        >
          <Plus size={18} />
          Add Project
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {list.length === 0 ? (
          <div className="col-span-2 text-center py-16 rounded-3xl bg-[#e8f0e8] shadow-[8px_8px_16px_#c8d8c8,-8px_-8px_16px_#ffffff]">
            <Clock size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400">No in-development projects yet</p>
            <button onClick={openCreate} className="mt-3 text-green-600 font-medium hover:underline">Add first project</button>
          </div>
        ) : (
          list.map((item) => {
            const title = (item.i18n as Record<string, { title?: string }>)?.en?.title || item.slug;
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-3xl bg-[#e8f0e8] shadow-[8px_8px_16px_#c8d8c8,-8px_-8px_16px_#ffffff]"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon || "🚀"}</span>
                    <div>
                      <h3 className="font-bold text-gray-800">{title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${item.status === "PUBLISHED" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(item)} className="w-8 h-8 rounded-xl flex items-center justify-center text-green-600 hover:bg-green-100">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} disabled={deletingId === item.id} className="w-8 h-8 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-50">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{item.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#c8d8c8] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress}%` }}
                      transition={{ duration: 1 }}
                      className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
                    />
                  </div>
                </div>

                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600">
                        <Tag size={10} />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl p-8 rounded-3xl bg-[#e8f0e8] shadow-[16px_16px_32px_#c8d8c8,-16px_-16px_32px_#ffffff] max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">{editing ? "Edit Project" : "Add In-Development Project"}</h2>
                <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Slug *</label>
                    <input {...form.register("slug")} placeholder="my-project" className="w-full px-4 py-3 rounded-2xl bg-[#e8f0e8] border-0 outline-none shadow-[inset_4px_4px_8px_#c8d8c8,inset_-4px_-4px_8px_#ffffff] text-gray-700 placeholder-gray-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Icon (emoji)</label>
                    <input {...form.register("icon")} placeholder="🚀" className="w-full px-4 py-3 rounded-2xl bg-[#e8f0e8] border-0 outline-none shadow-[inset_4px_4px_8px_#c8d8c8,inset_-4px_-4px_8px_#ffffff] text-gray-700 placeholder-gray-400" />
                  </div>
                </div>

                {/* Language tabs */}
                <div>
                  <div className="flex gap-2 mb-3">
                    {LANGS.map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => setActiveLang(l.code)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeLang === l.code ? "bg-gradient-to-br from-green-400 to-green-600 text-white shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)]" : "shadow-[4px_4px_8px_#c8d8c8,-4px_-4px_8px_#ffffff] text-gray-600"}`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                  <div className="space-y-3">
                    <input {...form.register(`i18n.${activeLang}.title`)} placeholder={`Title (${activeLang.toUpperCase()})`} className="w-full px-4 py-3 rounded-2xl bg-[#e8f0e8] border-0 outline-none shadow-[inset_4px_4px_8px_#c8d8c8,inset_-4px_-4px_8px_#ffffff] text-gray-700 placeholder-gray-400" />
                    <textarea {...form.register(`i18n.${activeLang}.description`)} placeholder={`Description (${activeLang.toUpperCase()})`} rows={3} className="w-full px-4 py-3 rounded-2xl bg-[#e8f0e8] border-0 outline-none shadow-[inset_4px_4px_8px_#c8d8c8,inset_-4px_-4px_8px_#ffffff] text-gray-700 placeholder-gray-400 resize-none" />
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
                    <label>Progress</label>
                    <span className="text-green-600 font-bold">{progress}%</span>
                  </div>
                  <input type="range" min={0} max={100} {...form.register("progress")} className="w-full h-2 rounded-full appearance-none cursor-pointer" style={{ background: `linear-gradient(to right, #22c55e 0%, #22c55e ${progress}%, #c8d8c8 ${progress}%, #c8d8c8 100%)` }} />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Tags</label>
                  <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={addTag} placeholder="Type tag and press Enter..." className="w-full px-4 py-3 rounded-2xl bg-[#e8f0e8] border-0 outline-none shadow-[inset_4px_4px_8px_#c8d8c8,inset_-4px_-4px_8px_#ffffff] text-gray-700 placeholder-gray-400" />
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                          {tag}
                          <button type="button" onClick={() => form.setValue("tags", tags.filter((t) => t !== tag))}>×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Status</label>
                    <select {...form.register("status")} className="w-full px-4 py-3 rounded-2xl bg-[#e8f0e8] border-0 outline-none shadow-[inset_4px_4px_8px_#c8d8c8,inset_-4px_-4px_8px_#ffffff] text-gray-700">
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED">Published</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Order</label>
                    <input type="number" {...form.register("order")} className="w-full px-4 py-3 rounded-2xl bg-[#e8f0e8] border-0 outline-none shadow-[inset_4px_4px_8px_#c8d8c8,inset_-4px_-4px_8px_#ffffff] text-gray-700" />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setOpen(false)} className="flex-1 py-3 rounded-2xl text-gray-600 font-medium shadow-[4px_4px_8px_#c8d8c8,-4px_-4px_8px_#ffffff] hover:shadow-[inset_4px_4px_8px_#c8d8c8] transition-all">Cancel</button>
                  <button type="submit" disabled={form.formState.isSubmitting} className="flex-1 py-3 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 text-white font-semibold shadow-[4px_4px_8px_#c8d8c8,-4px_-4px_8px_#ffffff] hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)] transition-all disabled:opacity-50">
                    {form.formState.isSubmitting ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
