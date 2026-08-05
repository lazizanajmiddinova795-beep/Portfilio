"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Globe,
  FolderKanban,
  Zap,
  Briefcase,
  Layers,
  Link as LinkIcon,
  User,
  Search,
  Settings,
  Info,
  Image as ImageIcon,
  Wrench,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Stats {
  profileCount: number;
  projectCount: number;
  skillCount: number;
  serviceCount: number;
  techCount: number;
  socialCount: number;
}

interface StatusData {
  dbStatus: "connected" | "error";
  telegramStatus: "connected" | "disconnected" | "error";
  seoStatus: "DRAFT" | "PUBLISHED" | null;
  seoTitle: string | null;
  seoUpdatedAt: string | null;
}

interface DashboardClientProps {
  stats: Stats;
  statusData: StatusData;
  settingsMap: Record<string, string>;
}

// ── Animated Counter Hook ──────────────────────────────────────────────────────

function useAnimatedCounter(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return count;
}

// ── Status Indicator ───────────────────────────────────────────────────────────

type StatusVariant = "live" | "connected" | "disconnected" | "error";

function StatusDot({ variant }: { variant: StatusVariant }) {
  const colors: Record<StatusVariant, string> = {
    live: "bg-green-500",
    connected: "bg-green-500",
    disconnected: "bg-gray-400",
    error: "bg-red-500",
  };
  const pulse = variant === "live" || variant === "connected";

  return (
    <span className="relative inline-flex h-3 w-3">
      {pulse && (
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colors[variant]} opacity-60`}
        />
      )}
      <span
        className={`relative inline-flex rounded-full h-3 w-3 ${colors[variant]}`}
      />
    </span>
  );
}

function StatusChip({
  label,
  variant,
  sublabel,
}: {
  label: string;
  variant: StatusVariant;
  sublabel: string;
}) {
  const textColor: Record<StatusVariant, string> = {
    live: "text-green-700",
    connected: "text-green-700",
    disconnected: "text-gray-500",
    error: "text-red-600",
  };
  const Icon =
    variant === "error"
      ? XCircle
      : variant === "disconnected"
      ? AlertTriangle
      : CheckCircle2;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 bg-[#e8f0e8] rounded-2xl px-5 py-4
        shadow-[8px_8px_16px_#c8d8c8,-8px_-8px_16px_#ffffff]
        flex-1 min-w-[160px]"
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center
          bg-[#e8f0e8] shadow-[4px_4px_8px_#c8d8c8,-4px_-4px_8px_#ffffff]"
      >
        <Icon
          className={`w-5 h-5 ${variant === "error" ? "text-red-500" : variant === "disconnected" ? "text-gray-400" : "text-green-500"}`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          {label}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <StatusDot variant={variant} />
          <span className={`text-sm font-bold ${textColor[variant]}`}>
            {sublabel}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Stat Card ──────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ElementType;
  gradient: string;
  delay?: number;
  href: string;
}

function StatCard({
  label,
  value,
  icon: Icon,
  gradient,
  delay = 0,
  href,
}: StatCardProps) {
  const count = useAnimatedCounter(value, 1000 + delay * 200);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.08, duration: 0.5 }}
    >
      <Link href={href} className="block group">
        <div
          className="bg-[#e8f0e8] rounded-2xl p-5
            shadow-[8px_8px_16px_#c8d8c8,-8px_-8px_16px_#ffffff]
            hover:shadow-[4px_4px_10px_#c8d8c8,-4px_-4px_10px_#ffffff]
            active:shadow-[inset_4px_4px_8px_#c8d8c8,inset_-4px_-4px_8px_#ffffff]
            transition-all duration-200 cursor-pointer"
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
          </div>
          <p className="text-4xl font-extrabold text-gray-800 tabular-nums leading-none mb-1">
            {count}
          </p>
          <p className="text-sm font-medium text-gray-500">{label}</p>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Quick Action Button ────────────────────────────────────────────────────────

function QuickAction({
  label,
  href,
  icon: Icon,
  delay = 0,
}: {
  label: string;
  href: string;
  icon: React.ElementType;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay * 0.06 + 0.3, duration: 0.35 }}
    >
      <Link href={href}>
        <div
          className="flex flex-col items-center gap-2 p-4 bg-[#e8f0e8] rounded-xl
            shadow-[6px_6px_12px_#c8d8c8,-6px_-6px_12px_#ffffff]
            hover:shadow-[3px_3px_6px_#c8d8c8,-3px_-3px_6px_#ffffff]
            active:shadow-[inset_3px_3px_6px_#c8d8c8,inset_-3px_-3px_6px_#ffffff]
            transition-all duration-200 cursor-pointer group text-center"
        >
          <div
            className="w-10 h-10 rounded-xl bg-[#e8f0e8] flex items-center justify-center
              shadow-[4px_4px_8px_#c8d8c8,-4px_-4px_8px_#ffffff]
              group-hover:bg-green-50 transition-colors"
          >
            <Icon className="w-5 h-5 text-gray-500 group-hover:text-green-600 transition-colors" />
          </div>
          <span className="text-xs font-semibold text-gray-600 group-hover:text-green-700 transition-colors">
            {label}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Section Header ─────────────────────────────────────────────────────────────

function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-lg font-bold text-gray-700">{title}</h2>
      {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  );
}

// ── Main Dashboard Client ──────────────────────────────────────────────────────

export function DashboardClient({
  stats,
  statusData,
  settingsMap,
}: DashboardClientProps) {
  const { dbStatus, telegramStatus, seoStatus, seoTitle, seoUpdatedAt } =
    statusData;

  const statCards: StatCardProps[] = [
    {
      label: "Projects",
      value: stats.projectCount,
      icon: FolderKanban,
      gradient: "from-blue-500 to-indigo-500",
      href: "/admin/projects",
    },
    {
      label: "Skills",
      value: stats.skillCount,
      icon: Zap,
      gradient: "from-green-500 to-emerald-500",
      href: "/admin/skills",
    },
    {
      label: "Services",
      value: stats.serviceCount,
      icon: Briefcase,
      gradient: "from-purple-500 to-violet-500",
      href: "/admin/services",
    },
    {
      label: "Tech Stack",
      value: stats.techCount,
      icon: Layers,
      gradient: "from-amber-500 to-orange-500",
      href: "/admin/tech-stack",
    },
    {
      label: "Social Links",
      value: stats.socialCount,
      icon: LinkIcon,
      gradient: "from-pink-500 to-rose-500",
      href: "/admin/social-links",
    },
  ];

  const quickActions = [
    { label: "Profile", href: "/admin/profile", icon: User },
    { label: "About", href: "/admin/about", icon: Info },
    { label: "Projects", href: "/admin/projects", icon: FolderKanban },
    { label: "Skills", href: "/admin/skills", icon: Zap },
    { label: "Tech Stack", href: "/admin/tech-stack", icon: Layers },
    { label: "Services", href: "/admin/services", icon: Briefcase },
    { label: "In Dev", href: "/admin/in-development", icon: Wrench },
    { label: "Social", href: "/admin/social-links", icon: LinkIcon },
    { label: "Contact", href: "/admin/contact", icon: MessageSquare },
    { label: "Media", href: "/admin/media", icon: ImageIcon },
    { label: "SEO", href: "/admin/seo", icon: Search },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const seoPublished = seoStatus === "PUBLISHED";

  return (
    <div className="space-y-10 pb-8">
      {/* ── Page Heading ────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-500">
          Dashboard
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Welcome back! Here&apos;s your portfolio at a glance.
        </p>
      </motion.div>

      {/* ── Status Row ──────────────────────────────────────────────────────── */}
      <section>
        <SectionHeader title="System Status" subtitle="Live connectivity overview" />
        <div className="flex flex-wrap gap-4">
          {/* Website */}
          <StatusChip
            label="Website"
            variant="live"
            sublabel="Live"
          />
          {/* Database */}
          <StatusChip
            label="Database"
            variant={dbStatus === "connected" ? "connected" : "error"}
            sublabel={dbStatus === "connected" ? "Connected" : "Error"}
          />
          {/* Telegram */}
          <StatusChip
            label="Telegram Bot"
            variant={
              telegramStatus === "connected"
                ? "connected"
                : telegramStatus === "error"
                ? "error"
                : "disconnected"
            }
            sublabel={
              telegramStatus === "connected"
                ? "Connected"
                : telegramStatus === "error"
                ? "Error"
                : "Disconnected"
            }
          />
        </div>
      </section>

      {/* ── Statistics Cards ─────────────────────────────────────────────────── */}
      <section>
        <SectionHeader
          title="Content Statistics"
          subtitle="Active records in the database"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {statCards.map((card, i) => (
            <StatCard key={card.label} {...card} delay={i} />
          ))}
        </div>
      </section>

      {/* ── Quick Actions + SEO Card (side by side on large screens) ───────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25, duration: 0.45 }}
          className="lg:col-span-2 bg-[#e8f0e8] rounded-2xl p-6
            shadow-[8px_8px_16px_#c8d8c8,-8px_-8px_16px_#ffffff]"
        >
          <SectionHeader
            title="Quick Actions"
            subtitle="Jump to any CMS module"
          />
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
            {quickActions.map((action, i) => (
              <QuickAction key={action.href} {...action} delay={i} />
            ))}
          </div>
        </motion.section>

        {/* SEO Status Card */}
        <motion.section
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.45 }}
          className="bg-[#e8f0e8] rounded-2xl p-6
            shadow-[8px_8px_16px_#c8d8c8,-8px_-8px_16px_#ffffff]
            flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-gray-700">SEO Status</h2>
              <p className="text-xs text-gray-400 mt-0.5">Main SEO configuration</p>
            </div>
            <div
              className="w-11 h-11 rounded-xl bg-[#e8f0e8] flex items-center justify-center
                shadow-[4px_4px_8px_#c8d8c8,-4px_-4px_8px_#ffffff]"
            >
              <Search className="w-5 h-5 text-green-600" />
            </div>
          </div>

          {seoStatus === null ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 py-6">
              <div
                className="w-14 h-14 rounded-2xl bg-[#e8f0e8] flex items-center justify-center
                  shadow-[inset_4px_4px_8px_#c8d8c8,inset_-4px_-4px_8px_#ffffff]"
              >
                <Search className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-sm text-gray-400 font-medium text-center">
                No SEO data configured
              </p>
              <Link
                href="/admin/seo"
                className="mt-1 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold
                  text-white bg-gradient-to-r from-green-500 to-emerald-500
                  shadow-[4px_4px_8px_#c8d8c8,-4px_-4px_8px_#ffffff]
                  hover:from-green-600 hover:to-emerald-600 transition-all"
              >
                Configure SEO
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          ) : (
            <div className="flex-1 space-y-4">
              {/* Status badge */}
              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${
                  seoPublished
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
              >
                <StatusDot variant={seoPublished ? "live" : "disconnected"} />
                {seoPublished ? "Published" : "Draft"}
              </div>

              {/* Title */}
              {seoTitle && (
                <div className="bg-[#e8f0e8] rounded-xl p-3 shadow-[inset_3px_3px_6px_#c8d8c8,inset_-3px_-3px_6px_#ffffff]">
                  <p className="text-xs text-gray-400 mb-0.5 font-medium">
                    SEO Title
                  </p>
                  <p className="text-sm font-semibold text-gray-700 line-clamp-2">
                    {seoTitle}
                  </p>
                </div>
              )}

              {/* Last updated */}
              {seoUpdatedAt && (
                <p className="text-xs text-gray-400">
                  Last updated:{" "}
                  <span className="font-medium text-gray-500">
                    {new Date(seoUpdatedAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </p>
              )}

              {/* Edit link */}
              <Link
                href="/admin/seo"
                className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-green-600
                  hover:text-green-700 transition-colors"
              >
                Edit SEO settings
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </motion.section>
      </div>

      {/* ── Website Status Banner ────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.45 }}
        className="bg-[#e8f0e8] rounded-2xl p-5
          shadow-[8px_8px_16px_#c8d8c8,-8px_-8px_16px_#ffffff]
          flex items-center justify-between gap-4 flex-wrap"
      >
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500
              flex items-center justify-center shadow-md"
          >
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-700">Portfolio Website</p>
            <div className="flex items-center gap-2 mt-0.5">
              <StatusDot variant="live" />
              <span className="text-sm text-green-600 font-semibold">
                Live &amp; running
              </span>
              {settingsMap["site_url"] && (
                <span className="text-xs text-gray-400 hidden sm:inline">
                  — {settingsMap["site_url"]}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {settingsMap["site_url"] && (
            <a
              href={settingsMap["site_url"]}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                text-white bg-gradient-to-r from-green-500 to-emerald-500
                shadow-[6px_6px_12px_#c8d8c8,-6px_-6px_12px_#ffffff]
                hover:from-green-600 hover:to-emerald-600 transition-all active:scale-95"
            >
              <Globe className="w-4 h-4" />
              View Site
            </a>
          )}
          <Link
            href="/admin/settings"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
              text-gray-600 bg-[#e8f0e8]
              shadow-[6px_6px_12px_#c8d8c8,-6px_-6px_12px_#ffffff]
              hover:text-green-700 hover:shadow-[4px_4px_8px_#c8d8c8,-4px_-4px_8px_#ffffff]
              transition-all"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
