"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useState, useEffect, useCallback, useRef } from "react";
import { Search, Globe, Tag, Save, Loader2, X } from "lucide-react";
import { seoSchema, type SEOInput } from "@/lib/validations/schemas";
import { saveSEOAction } from "@/lib/actions/cms.actions";

interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  ogImageUrl: string | null;
  twitterHandle: string | null;
  canonicalUrl: string | null;
  robots: string;
  faviconUrl: string | null;
  status: "DRAFT" | "PUBLISHED";
}

export default function SEOClient({ seo }: { seo: SEOData | null }) {
  const [keywordInput, setKeywordInput] = useState("");
  const [autoSaving, setAutoSaving] = useState(false);
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);

  const form = useForm<SEOInput>({
    resolver: zodResolver(seoSchema),
    defaultValues: {
      title: seo?.title || "",
      description: seo?.description || "",
      keywords: seo?.keywords || [],
      ogImageUrl: seo?.ogImageUrl || "",
      twitterHandle: seo?.twitterHandle || "",
      canonicalUrl: seo?.canonicalUrl || "",
      robots: seo?.robots || "index, follow",
      faviconUrl: seo?.faviconUrl || "",
      status: seo?.status || "DRAFT",
    },
  });

  const keywords = form.watch("keywords");

  function addKeyword(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const kw = keywordInput.trim().replace(/,$/, "");
      if (kw && !keywords.includes(kw)) {
        form.setValue("keywords", [...keywords, kw]);
        setKeywordInput("");
      }
    }
  }

  function removeKeyword(kw: string) {
    form.setValue("keywords", keywords.filter((k) => k !== kw));
  }

  const doAutoSave = useCallback(async () => {
    const values = form.getValues();
    setAutoSaving(true);
    await saveSEOAction(values);
    setAutoSaving(false);
  }, [form]);

  useEffect(() => {
    const subscription = form.watch(() => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
      autoSaveTimer.current = setTimeout(doAutoSave, 3000);
    });
    return () => {
      subscription.unsubscribe();
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [form, doAutoSave]);

  async function onSubmit(data: SEOInput) {
    const result = await saveSEOAction(data);
    if (result.success) toast.success("SEO settings saved!");
    else toast.error(result.error);
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">SEO Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage search engine and social media metadata</p>
        </div>
        {autoSaving && (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <Loader2 size={14} className="animate-spin" />
            Auto-saving...
          </div>
        )}
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic SEO */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl bg-[#e8f0e8] shadow-[8px_8px_16px_#c8d8c8,-8px_-8px_16px_#ffffff]"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <Search size={18} className="text-white" />
            </div>
            <h2 className="font-bold text-gray-800">Basic SEO</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Title <span className="text-gray-400">({form.watch("title").length}/60)</span>
              </label>
              <input
                {...form.register("title")}
                placeholder="Page Title — Your Name | Role"
                className="w-full px-4 py-3 rounded-2xl bg-[#e8f0e8] border-0 outline-none shadow-[inset_4px_4px_8px_#c8d8c8,inset_-4px_-4px_8px_#ffffff] text-gray-700 placeholder-gray-400"
              />
              {form.formState.errors.title && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Description <span className="text-gray-400">({form.watch("description").length}/160)</span>
              </label>
              <textarea
                {...form.register("description")}
                rows={3}
                placeholder="Brief description of your portfolio..."
                className="w-full px-4 py-3 rounded-2xl bg-[#e8f0e8] border-0 outline-none shadow-[inset_4px_4px_8px_#c8d8c8,inset_-4px_-4px_8px_#ffffff] text-gray-700 placeholder-gray-400 resize-none"
              />
            </div>

            {/* Keywords */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                <Tag size={14} /> Keywords
              </label>
              <input
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={addKeyword}
                placeholder="Type and press Enter or comma..."
                className="w-full px-4 py-3 rounded-2xl bg-[#e8f0e8] border-0 outline-none shadow-[inset_4px_4px_8px_#c8d8c8,inset_-4px_-4px_8px_#ffffff] text-gray-700 placeholder-gray-400"
              />
              {keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {keywords.map((kw) => (
                    <span
                      key={kw}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium"
                    >
                      {kw}
                      <button type="button" onClick={() => removeKeyword(kw)} className="hover:text-red-500">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Robots</label>
                <select
                  {...form.register("robots")}
                  className="w-full px-4 py-3 rounded-2xl bg-[#e8f0e8] border-0 outline-none shadow-[inset_4px_4px_8px_#c8d8c8,inset_-4px_-4px_8px_#ffffff] text-gray-700"
                >
                  <option value="index, follow">index, follow</option>
                  <option value="noindex, nofollow">noindex, nofollow</option>
                  <option value="index, nofollow">index, nofollow</option>
                  <option value="noindex, follow">noindex, follow</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Status</label>
                <select
                  {...form.register("status")}
                  className="w-full px-4 py-3 rounded-2xl bg-[#e8f0e8] border-0 outline-none shadow-[inset_4px_4px_8px_#c8d8c8,inset_-4px_-4px_8px_#ffffff] text-gray-700"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Open Graph */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-3xl bg-[#e8f0e8] shadow-[8px_8px_16px_#c8d8c8,-8px_-8px_16px_#ffffff]"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <Globe size={18} className="text-white" />
            </div>
            <h2 className="font-bold text-gray-800">Open Graph</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">OG Image URL</label>
              <input
                {...form.register("ogImageUrl")}
                placeholder="https://yoursite.com/og-image.png (1200×630)"
                className="w-full px-4 py-3 rounded-2xl bg-[#e8f0e8] border-0 outline-none shadow-[inset_4px_4px_8px_#c8d8c8,inset_-4px_-4px_8px_#ffffff] text-gray-700 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Canonical URL</label>
              <input
                {...form.register("canonicalUrl")}
                placeholder="https://yoursite.com"
                className="w-full px-4 py-3 rounded-2xl bg-[#e8f0e8] border-0 outline-none shadow-[inset_4px_4px_8px_#c8d8c8,inset_-4px_-4px_8px_#ffffff] text-gray-700 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Favicon URL</label>
              <input
                {...form.register("faviconUrl")}
                placeholder="https://yoursite.com/favicon.ico"
                className="w-full px-4 py-3 rounded-2xl bg-[#e8f0e8] border-0 outline-none shadow-[inset_4px_4px_8px_#c8d8c8,inset_-4px_-4px_8px_#ffffff] text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>
        </motion.div>

        {/* Twitter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-3xl bg-[#e8f0e8] shadow-[8px_8px_16px_#c8d8c8,-8px_-8px_16px_#ffffff]"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center">
              <X size={18} className="text-white" />
            </div>
            <h2 className="font-bold text-gray-800">Twitter Card</h2>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Twitter Handle</label>
            <input
              {...form.register("twitterHandle")}
              placeholder="@yourhandle"
              className="w-full px-4 py-3 rounded-2xl bg-[#e8f0e8] border-0 outline-none shadow-[inset_4px_4px_8px_#c8d8c8,inset_-4px_-4px_8px_#ffffff] text-gray-700 placeholder-gray-400"
            />
          </div>
        </motion.div>

        {/* Save button */}
        <motion.button
          type="submit"
          disabled={form.formState.isSubmitting}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 text-white font-bold text-lg shadow-[4px_4px_8px_#c8d8c8,-4px_-4px_8px_#ffffff] hover:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1)] transition-all disabled:opacity-50"
        >
          {form.formState.isSubmitting ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Save size={20} />
          )}
          Save SEO Settings
        </motion.button>
      </form>
    </div>
  );
}
