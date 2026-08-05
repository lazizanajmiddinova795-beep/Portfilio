"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Link2, Globe, ExternalLink } from "lucide-react";
import { socialLinkSchema, type SocialLinkInput } from "@/lib/validations/schemas";
import {
  createSocialLinkAction,
  updateSocialLinkAction,
  deleteSocialLinkAction,
} from "@/lib/actions/cms.actions";

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string | null;
  label: string | null;
  order: number;
}

const PLATFORM_EMOJIS: Record<string, string> = {
  github: "🐙",
  linkedin: "💼",
  telegram: "✈️",
  email: "📧",
  twitter: "🐦",
  youtube: "▶️",
  instagram: "📸",
  website: "🌐",
};

const PLATFORMS = [
  { value: "github", label: "GitHub" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "telegram", label: "Telegram" },
  { value: "email", label: "Email" },
  { value: "twitter", label: "Twitter/X" },
  { value: "youtube", label: "YouTube" },
  { value: "instagram", label: "Instagram" },
  { value: "website", label: "Website" },
];

export default function SocialLinksClient({ links }: { links: SocialLink[] }) {
  const [items, setItems] = useState(links);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SocialLink | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<SocialLinkInput>({
    resolver: zodResolver(socialLinkSchema) as any,
    defaultValues: { platform: "github", url: "", icon: "Github", label: "", order: 0 },
  });

  function openCreate() {
    setEditing(null);
    form.reset({ platform: "github", url: "", icon: "Github", label: "", order: items.length });
    setOpen(true);
  }

  function openEdit(link: SocialLink) {
    setEditing(link);
    form.reset({
      platform: link.platform,
      url: link.url,
      icon: link.icon || "",
      label: link.label || "",
      order: link.order,
    });
    setOpen(true);
  }

  async function handleSubmit(data: SocialLinkInput) {
    const result = editing
      ? await updateSocialLinkAction(editing.id, data)
      : await createSocialLinkAction(data);

    if (result.success) {
      toast.success(editing ? "Link updated!" : "Link created!");
      setOpen(false);
      // Refresh
      window.location.reload();
    } else {
      toast.error(result.error);
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    const result = await deleteSocialLinkAction(id);
    setDeleting(null);
    if (result.success) {
      setItems((prev) => prev.filter((l) => l.id !== id));
      toast.success("Link deleted");
    } else {
      toast.error(result.error);
    }
  }

  const platform = form.watch("platform");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Social Links</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your social media and contact links</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 text-white font-semibold shadow-[4px_4px_8px_#c8d8c8,-4px_-4px_8px_#ffffff] hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)] transition-all"
        >
          <Plus size={18} />
          Add Link
        </motion.button>
      </div>

      {/* Links Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.length === 0 ? (
          <div className="col-span-3 text-center py-16 rounded-3xl bg-[#e8f0e8] shadow-[8px_8px_16px_#c8d8c8,-8px_-8px_16px_#ffffff]">
            <ExternalLink size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400">No social links yet</p>
            <button onClick={openCreate} className="mt-3 text-green-600 font-medium hover:underline">
              Add your first link
            </button>
          </div>
        ) : (
          items.map((link) => {
            const emoji = PLATFORM_EMOJIS[link.platform] || "🔗";
            return (
              <motion.div
                key={link.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-3xl bg-[#e8f0e8] shadow-[8px_8px_16px_#c8d8c8,-8px_-8px_16px_#ffffff] flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center flex-shrink-0 shadow-[4px_4px_8px_#c8d8c8,-4px_-4px_8px_#ffffff] text-2xl">
                  {emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 capitalize">{link.label || link.platform}</p>
                  <p className="text-xs text-gray-400 truncate">{link.url}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(link)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-green-600 hover:bg-green-100 transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(link.id)}
                    disabled={deleting === link.id}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Modal */}
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
                <h2 className="text-xl font-bold text-gray-800">
                  {editing ? "Edit Link" : "Add New Link"}
                </h2>
                <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                {/* Platform */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Platform</label>
                  <select
                    {...form.register("platform", {
                      onChange: (e) => {
                        const p = PLATFORMS.find((pl) => pl.value === e.target.value);
                        if (p) {
                          form.setValue("label", p.label);
                        }
                      },
                    })}
                    className="w-full px-4 py-3 rounded-2xl bg-[#e8f0e8] border-0 outline-none shadow-[inset_4px_4px_8px_#c8d8c8,inset_-4px_-4px_8px_#ffffff] text-gray-700"
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>

                {/* URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">URL</label>
                  <input
                    {...form.register("url")}
                    placeholder={platform === "email" ? "mailto:you@example.com" : "https://..."}
                    className="w-full px-4 py-3 rounded-2xl bg-[#e8f0e8] border-0 outline-none shadow-[inset_4px_4px_8px_#c8d8c8,inset_-4px_-4px_8px_#ffffff] text-gray-700 placeholder-gray-400"
                  />
                  {form.formState.errors.url && (
                    <p className="text-red-500 text-xs mt-1">{form.formState.errors.url.message}</p>
                  )}
                </div>

                {/* Label */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Label</label>
                  <input
                    {...form.register("label")}
                    placeholder="Display name"
                    className="w-full px-4 py-3 rounded-2xl bg-[#e8f0e8] border-0 outline-none shadow-[inset_4px_4px_8px_#c8d8c8,inset_-4px_-4px_8px_#ffffff] text-gray-700 placeholder-gray-400"
                  />
                </div>

                {/* Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Order</label>
                  <input
                    type="number"
                    {...form.register("order")}
                    className="w-full px-4 py-3 rounded-2xl bg-[#e8f0e8] border-0 outline-none shadow-[inset_4px_4px_8px_#c8d8c8,inset_-4px_-4px_8px_#ffffff] text-gray-700"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex-1 py-3 rounded-2xl text-gray-600 font-medium shadow-[4px_4px_8px_#c8d8c8,-4px_-4px_8px_#ffffff] hover:shadow-[inset_4px_4px_8px_#c8d8c8] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="flex-1 py-3 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 text-white font-semibold shadow-[4px_4px_8px_#c8d8c8,-4px_-4px_8px_#ffffff] hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)] transition-all disabled:opacity-50"
                  >
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
