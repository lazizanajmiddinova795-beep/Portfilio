"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Layers } from "lucide-react";
import { techStackSchema, type TechStackInput } from "@/lib/validations/schemas";
import { createTechStackAction, updateTechStackAction, deleteTechStackAction } from "@/lib/actions/cms.actions";

interface TechItem {
  id: string;
  name: string;
  icon: string | null;
  category: string | null;
  order: number;
}

const CATEGORIES = ["Frontend", "Backend", "Database", "DevOps", "Tools", "Mobile", "AI", "Other"];
const CATEGORY_COLORS: Record<string, string> = {
  Frontend: "bg-blue-100 text-blue-700",
  Backend: "bg-green-100 text-green-700",
  Database: "bg-purple-100 text-purple-700",
  DevOps: "bg-orange-100 text-orange-700",
  Tools: "bg-gray-100 text-gray-700",
  Mobile: "bg-pink-100 text-pink-700",
  AI: "bg-yellow-100 text-yellow-700",
  Other: "bg-slate-100 text-slate-700",
};

export default function TechStackClient({ items }: { items: TechItem[] }) {
  const [list, setList] = useState(items);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TechItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<TechStackInput>({
    resolver: zodResolver(techStackSchema) as any,
    defaultValues: { name: "", icon: "", category: "", order: 0 },
  });

  function openCreate() {
    setEditing(null);
    form.reset({ name: "", icon: "", category: "Frontend", order: list.length });
    setOpen(true);
  }

  function openEdit(item: TechItem) {
    setEditing(item);
    form.reset({ name: item.name, icon: item.icon || "", category: item.category || "", order: item.order });
    setOpen(true);
  }

  async function handleSubmit(data: TechStackInput) {
    const result = editing
      ? await updateTechStackAction(editing.id, data)
      : await createTechStackAction(data);

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
    const result = await deleteTechStackAction(id);
    setDeletingId(null);
    if (result.success) {
      setList((prev) => prev.filter((i) => i.id !== id));
      toast.success("Deleted");
    } else {
      toast.error(result.error);
    }
  }

  // Group by category
  const grouped = CATEGORIES.reduce<Record<string, TechItem[]>>((acc, cat) => {
    acc[cat] = list.filter((i) => i.category === cat);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Tech Stack</h1>
          <p className="text-gray-500 text-sm mt-1">{list.length} technologies</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 text-white font-semibold shadow-[4px_4px_8px_#c8d8c8,-4px_-4px_8px_#ffffff] hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)] transition-all"
        >
          <Plus size={18} />
          Add Tech
        </motion.button>
      </div>

      {list.length === 0 ? (
        <div className="text-center py-16 rounded-3xl bg-[#e8f0e8] shadow-[8px_8px_16px_#c8d8c8,-8px_-8px_16px_#ffffff]">
          <Layers size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-400">No tech stack items yet</p>
          <button onClick={openCreate} className="mt-3 text-green-600 font-medium hover:underline">Add your first tech</button>
        </div>
      ) : (
        CATEGORIES.map((cat) => {
          const catItems = grouped[cat];
          if (!catItems || catItems.length === 0) return null;
          return (
            <div key={cat}>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">{cat}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {catItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-2xl bg-[#e8f0e8] shadow-[6px_6px_12px_#c8d8c8,-6px_-6px_12px_#ffffff] flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-xl">{item.icon || "💻"}</span>
                      <span className="font-medium text-gray-700 text-sm truncate">{item.name}</span>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => openEdit(item)} className="w-7 h-7 rounded-lg flex items-center justify-center text-green-600 hover:bg-green-100">
                        <Pencil size={12} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} disabled={deletingId === item.id} className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })
      )}

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
              className="w-full max-w-md p-8 rounded-3xl bg-[#e8f0e8] shadow-[16px_16px_32px_#c8d8c8,-16px_-16px_32px_#ffffff]"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">{editing ? "Edit Tech" : "Add Technology"}</h2>
                <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Name *</label>
                  <input {...form.register("name")} placeholder="e.g. React, PostgreSQL" className="w-full px-4 py-3 rounded-2xl bg-[#e8f0e8] border-0 outline-none shadow-[inset_4px_4px_8px_#c8d8c8,inset_-4px_-4px_8px_#ffffff] text-gray-700 placeholder-gray-400" />
                  {form.formState.errors.name && <p className="text-red-500 text-xs mt-1">{form.formState.errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Icon (emoji or name)</label>
                  <input {...form.register("icon")} placeholder="⚛️ or react" className="w-full px-4 py-3 rounded-2xl bg-[#e8f0e8] border-0 outline-none shadow-[inset_4px_4px_8px_#c8d8c8,inset_-4px_-4px_8px_#ffffff] text-gray-700 placeholder-gray-400" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Category</label>
                  <select {...form.register("category")} className="w-full px-4 py-3 rounded-2xl bg-[#e8f0e8] border-0 outline-none shadow-[inset_4px_4px_8px_#c8d8c8,inset_-4px_-4px_8px_#ffffff] text-gray-700">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Order</label>
                  <input type="number" {...form.register("order")} className="w-full px-4 py-3 rounded-2xl bg-[#e8f0e8] border-0 outline-none shadow-[inset_4px_4px_8px_#c8d8c8,inset_-4px_-4px_8px_#ffffff] text-gray-700" />
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
