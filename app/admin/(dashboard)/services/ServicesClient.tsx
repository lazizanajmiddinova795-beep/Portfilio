"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Globe,
  Server,
  Briefcase,
  Wrench,
  Layers,
  Zap,
  Shield,
  Code,
  Database,
  Cloud,
  Monitor,
  Smartphone,
  Search,
  Settings,
  Star,
} from "lucide-react";
import { serviceSchema, type ServiceInput } from "@/lib/validations/schemas";
import {
  createServiceAction,
  updateServiceAction,
  deleteServiceAction,
} from "@/lib/actions/cms.actions";
import { DeleteDialog } from "@/components/admin/ui/DeleteDialog";
import { EmptyState } from "@/components/admin/ui/EmptyState";

// ── Types ────────────────────────────────────────────────────────────────────

type Service = {
  id: string;
  slug: string;
  icon: string | null;
  i18n: unknown;
  price: string | null;
  order: number;
  status: "DRAFT" | "PUBLISHED";
  createdAt: Date;
  updatedAt: Date;
};

type I18nContent = {
  en?: { title?: string; description?: string };
  uz?: { title?: string; description?: string };
  ru?: { title?: string; description?: string };
};

interface ServicesClientProps {
  services: Service[];
}

// ── Icon Preview Map ─────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe,
  Server,
  Briefcase,
  Wrench,
  Layers,
  Zap,
  Shield,
  Code,
  Database,
  Cloud,
  Monitor,
  Smartphone,
  Search,
  Settings,
  Star,
};

function DynamicIcon({ name, className }: { name?: string | null; className?: string }) {
  if (!name) return <Briefcase className={className} />;
  const Icon = ICON_MAP[name] ?? Briefcase;
  return <Icon className={className} />;
}

// ── Language Tabs ────────────────────────────────────────────────────────────

type Lang = "en" | "uz" | "ru";
const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "uz", label: "Uzbek", flag: "🇺🇿" },
  { code: "ru", label: "Russian", flag: "🇷🇺" },
];

// ── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: "DRAFT" | "PUBLISHED" }) {
  return status === "PUBLISHED" ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
      Published
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
      Draft
    </span>
  );
}

// ── Form Modal ────────────────────────────────────────────────────────────────

interface ServiceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editItem: Service | null;
  onSuccess: () => void;
}

function ServiceFormModal({ isOpen, onClose, editItem, onSuccess }: ServiceFormModalProps) {
  const [activeLang, setActiveLang] = useState<Lang>("en");
  const [isPending, startTransition] = useTransition();

  const parseI18n = (raw: unknown): I18nContent => {
    if (raw && typeof raw === "object") return raw as I18nContent;
    return {};
  };

  const i18nData = parseI18n(editItem?.i18n);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceInput>({
    resolver: zodResolver(serviceSchema) as any,
    defaultValues: {
      slug: editItem?.slug ?? "",
      icon: editItem?.icon ?? "",
      price: editItem?.price ?? "",
      status: editItem?.status ?? "DRAFT",
      order: editItem?.order ?? 0,
      i18n: {
        en: {
          title: i18nData.en?.title ?? "",
          description: i18nData.en?.description ?? "",
        },
        uz: {
          title: i18nData.uz?.title ?? "",
          description: i18nData.uz?.description ?? "",
        },
        ru: {
          title: i18nData.ru?.title ?? "",
          description: i18nData.ru?.description ?? "",
        },
      },
    },
  });

  const handleClose = () => {
    reset();
    setActiveLang("en");
    onClose();
  };

  const onSubmit = (data: ServiceInput) => {
    startTransition(async () => {
      const result = editItem
        ? await updateServiceAction(editItem.id, data)
        : await createServiceAction(data);

      if (result.success) {
        toast.success(editItem ? "Service updated successfully!" : "Service created successfully!");
        handleClose();
        onSuccess();
      } else {
        toast.error(result.error ?? "Something went wrong");
      }
    });
  };

  const inputCls =
    "w-full px-4 py-2.5 rounded-xl text-sm text-gray-700 placeholder-gray-400 outline-none transition-all " +
    "bg-[#e8f0e8] shadow-[inset_4px_4px_8px_#c8d8c8,inset_-4px_-4px_8px_#ffffff] " +
    "focus:shadow-[inset_5px_5px_10px_#c8d8c8,inset_-5px_-5px_10px_#ffffff,0_0_0_2px_#22c55e40]";

  const textareaCls = inputCls + " resize-none min-h-[100px]";

  const labelCls = "block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide";
  const errorCls = "text-xs text-red-500 mt-1";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 24 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-x-4 top-[5%] bottom-[5%] sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-2xl z-50 overflow-y-auto"
          >
            <div
              className="min-h-full rounded-2xl p-6 md:p-8"
              style={{
                background: "var(--neu-bg, #e8f0e8)",
                boxShadow: "20px 20px 40px #c8d8c8, -20px -20px 40px #ffffff",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {editItem ? "Edit Service" : "New Service"}
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {editItem ? "Update service details" : "Add a new service to your portfolio"}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-xl text-gray-500 hover:text-gray-700 transition-colors"
                  style={{
                    background: "var(--neu-bg, #e8f0e8)",
                    boxShadow: "4px 4px 8px #c8d8c8, -4px -4px 8px #ffffff",
                  }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Language Tabs */}
                <div>
                  <div className="flex gap-2 mb-4 p-1 rounded-xl"
                    style={{
                      background: "var(--neu-bg, #e8f0e8)",
                      boxShadow: "inset 4px 4px 8px #c8d8c8, inset -4px -4px 8px #ffffff",
                    }}
                  >
                    {LANGS.map((lang) => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => setActiveLang(lang.code)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                          activeLang === lang.code
                            ? "bg-green-500 text-white shadow-[4px_4px_8px_#c8d8c8,-4px_-4px_8px_#ffffff]"
                            : "text-gray-600 hover:text-gray-800"
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span className="hidden sm:inline">{lang.label}</span>
                        <span className="sm:hidden uppercase">{lang.code}</span>
                      </button>
                    ))}
                  </div>

                  {/* Lang Fields */}
                  {LANGS.map((lang) => (
                    <div
                      key={lang.code}
                      className={activeLang === lang.code ? "space-y-4" : "hidden"}
                    >
                      <div>
                        <label className={labelCls}>
                          {lang.flag} Title ({lang.label})
                        </label>
                        <input
                          {...register(`i18n.${lang.code}.title`)}
                          placeholder={`Service title in ${lang.label}...`}
                          className={inputCls}
                        />
                        {errors.i18n?.[lang.code]?.title && (
                          <p className={errorCls}>{errors.i18n[lang.code]?.title?.message}</p>
                        )}
                      </div>
                      <div>
                        <label className={labelCls}>
                          {lang.flag} Description ({lang.label})
                        </label>
                        <textarea
                          {...register(`i18n.${lang.code}.description`)}
                          placeholder={`Service description in ${lang.label}...`}
                          className={textareaCls}
                        />
                        {errors.i18n?.[lang.code]?.description && (
                          <p className={errorCls}>{errors.i18n[lang.code]?.description?.message}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t border-green-200/60" />

                {/* Common Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Slug */}
                  <div>
                    <label className={labelCls}>Slug *</label>
                    <input
                      {...register("slug")}
                      placeholder="e.g. web-development"
                      className={inputCls}
                    />
                    {errors.slug && <p className={errorCls}>{errors.slug.message}</p>}
                  </div>

                  {/* Icon */}
                  <div>
                    <label className={labelCls}>Icon (Lucide Name)</label>
                    <input
                      {...register("icon")}
                      placeholder="e.g. Globe, Server, Code"
                      className={inputCls}
                    />
                    <p className="text-[11px] text-gray-400 mt-1">
                      Available: Globe, Server, Code, Database, Cloud, Monitor, Smartphone, Briefcase, Shield, Zap, Layers, Wrench, Search, Settings, Star
                    </p>
                    {errors.icon && <p className={errorCls}>{errors.icon.message}</p>}
                  </div>

                  {/* Price */}
                  <div>
                    <label className={labelCls}>Price</label>
                    <input
                      {...register("price")}
                      placeholder='e.g. "From $500" or "Custom"'
                      className={inputCls}
                    />
                    {errors.price && <p className={errorCls}>{errors.price.message}</p>}
                  </div>

                  {/* Order */}
                  <div>
                    <label className={labelCls}>Display Order</label>
                    <input
                      {...register("order")}
                      type="number"
                      min={0}
                      placeholder="0"
                      className={inputCls}
                    />
                    {errors.order && <p className={errorCls}>{errors.order.message}</p>}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className={labelCls}>Status</label>
                  <div className="flex gap-3">
                    {(["DRAFT", "PUBLISHED"] as const).map((s) => (
                      <label key={s} className="flex-1 cursor-pointer">
                        <input {...register("status")} type="radio" value={s} className="sr-only" />
                        <div
                          className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all border-2 ${
                            s === "PUBLISHED"
                              ? "border-green-400 text-green-700 bg-green-50"
                              : "border-amber-300 text-amber-700 bg-amber-50"
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${s === "PUBLISHED" ? "bg-green-500" : "bg-amber-400"}`} />
                          {s === "DRAFT" ? "Draft" : "Published"}
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.status && <p className={errorCls}>{errors.status.message}</p>}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 py-2.5 px-6 rounded-xl text-sm font-medium text-gray-600 transition-all"
                    style={{
                      background: "var(--neu-bg, #e8f0e8)",
                      boxShadow: "6px 6px 12px #c8d8c8, -6px -6px 12px #ffffff",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 py-2.5 px-6 rounded-xl text-sm font-semibold text-white bg-green-500 hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-[0_4px_20px_rgba(34,197,94,0.4)]"
                  >
                    {isPending ? "Saving…" : editItem ? "Update Service" : "Create Service"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Main Client Component ────────────────────────────────────────────────────

export default function ServicesClient({ services: initialServices }: ServicesClientProps) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Service | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [isDeleting, startDeleteTransition] = useTransition();

  // Refresh from server isn't possible in pure client, so we use router.refresh() via a wrapper
  // Pattern: force page re-render by navigating
  const refreshPage = () => {
    // Trigger a full route re-render
    window.location.reload();
  };

  const handleOpenCreate = () => {
    setEditItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (service: Service) => {
    setEditItem(service);
    setIsModalOpen(true);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    startDeleteTransition(async () => {
      const result = await deleteServiceAction(deleteTarget.id);
      if (result.success) {
        toast.success("Service deleted successfully!");
        setServices((prev) => prev.filter((s) => s.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        toast.error(result.error ?? "Failed to delete service");
      }
    });
  };

  const getI18n = (service: Service): I18nContent => {
    if (service.i18n && typeof service.i18n === "object") return service.i18n as I18nContent;
    return {};
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Services</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your portfolio services — {services.length} total
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-green-500 hover:bg-green-600 transition-all shadow-[0_4px_20px_rgba(34,197,94,0.4)] active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </motion.div>

      {/* Content */}
      {services.length === 0 ? (
        <EmptyState
          title="No services yet"
          description="Add your first service to showcase what you offer to clients."
          actionLabel="Add Service"
          onAction={handleOpenCreate}
          icon={<Briefcase className="w-8 h-8 text-green-600" />}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl overflow-hidden"
          style={{
            background: "var(--neu-bg, #e8f0e8)",
            boxShadow: "8px 8px 16px #c8d8c8, -8px -8px 16px #ffffff",
          }}
        >
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-green-200/60">
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Icon
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Title (EN)
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">
                    Slug
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">
                    Status
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">
                    Price
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">
                    Order
                  </th>
                  <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, i) => {
                  const i18n = getI18n(service);
                  const enTitle = i18n.en?.title ?? "—";

                  return (
                    <motion.tr
                      key={service.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="border-b border-green-100/50 last:border-0 hover:bg-green-50/40 transition-colors group"
                    >
                      {/* Icon */}
                      <td className="px-5 py-4">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center"
                          style={{
                            background: "var(--neu-bg, #e8f0e8)",
                            boxShadow: "4px 4px 8px #c8d8c8, -4px -4px 8px #ffffff",
                          }}
                        >
                          <DynamicIcon name={service.icon} className="w-4 h-4 text-green-600" />
                        </div>
                      </td>

                      {/* Title */}
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-semibold text-gray-800 truncate max-w-[180px]">
                            {enTitle}
                          </p>
                          {service.icon && (
                            <p className="text-xs text-gray-400 mt-0.5 font-mono">{service.icon}</p>
                          )}
                        </div>
                      </td>

                      {/* Slug */}
                      <td className="px-5 py-4 hidden md:table-cell">
                        <code className="text-xs bg-green-100/60 text-green-700 px-2 py-0.5 rounded-md font-mono">
                          {service.slug}
                        </code>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <StatusBadge status={service.status} />
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span className="text-gray-600 text-sm">
                          {service.price || <span className="text-gray-300">—</span>}
                        </span>
                      </td>

                      {/* Order */}
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span className="text-gray-500 text-sm font-mono">{service.order}</span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(service)}
                            className="p-2 rounded-xl text-green-600 hover:text-green-700 transition-all opacity-70 group-hover:opacity-100"
                            style={{
                              background: "var(--neu-bg, #e8f0e8)",
                              boxShadow: "3px 3px 6px #c8d8c8, -3px -3px 6px #ffffff",
                            }}
                            title="Edit service"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(service)}
                            className="p-2 rounded-xl text-red-500 hover:text-red-600 transition-all opacity-70 group-hover:opacity-100"
                            style={{
                              background: "var(--neu-bg, #e8f0e8)",
                              boxShadow: "3px 3px 6px #c8d8c8, -3px -3px 6px #ffffff",
                            }}
                            title="Delete service"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-green-200/40 flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {services.length} service{services.length !== 1 ? "s" : ""} total
            </span>
            <span className="text-xs text-gray-400">
              {services.filter((s) => s.status === "PUBLISHED").length} published ·{" "}
              {services.filter((s) => s.status === "DRAFT").length} draft
            </span>
          </div>
        </motion.div>
      )}

      {/* Create / Edit Modal */}
      <ServiceFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editItem={editItem}
        onSuccess={refreshPage}
      />

      {/* Delete Confirmation */}
      <DeleteDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={
          deleteTarget
            ? (getI18n(deleteTarget).en?.title ?? deleteTarget.slug)
            : ""
        }
      />
    </div>
  );
}
