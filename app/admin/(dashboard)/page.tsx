import { prisma } from "@/lib/prisma";
import { DashboardClient } from "@/components/admin/DashboardClient";

export const metadata = {
  title: "Dashboard | Portfolio CMS",
};

// Opt out of caching so stats are always fresh
export const revalidate = 0;

export default async function AdminDashboard() {
  // ── Parallel data fetch ────────────────────────────────────────────────────
  const [
    profileCount,
    projectCount,
    skillCount,
    serviceCount,
    techCount,
    socialCount,
    seoData,
    settings,
  ] = await Promise.all([
    prisma.profile.count({ where: { deletedAt: null } }),
    prisma.project.count({ where: { deletedAt: null } }),
    prisma.skill.count({ where: { deletedAt: null } }),
    prisma.service.count({ where: { deletedAt: null } }),
    prisma.techStack.count({ where: { deletedAt: null } }),
    prisma.socialLink.count({ where: { deletedAt: null } }),
    prisma.sEO.findUnique({ where: { slug: "main" } }),
    prisma.setting.findMany(),
  ]);

  // ── Database connectivity check ────────────────────────────────────────────
  let dbStatus: "connected" | "error" = "connected";
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    dbStatus = "error";
  }

  // ── Telegram Bot connectivity check ───────────────────────────────────────
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
  let telegramStatus: "connected" | "disconnected" | "error" = "disconnected";
  if (telegramToken) {
    try {
      const res = await fetch(
        `https://api.telegram.org/bot${telegramToken}/getMe`,
        { cache: "no-store" }
      );
      const data = await res.json();
      telegramStatus = data.ok ? "connected" : "error";
    } catch {
      telegramStatus = "error";
    }
  }

  // ── Build settings map ────────────────────────────────────────────────────
  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  return (
    <DashboardClient
      stats={{
        profileCount,
        projectCount,
        skillCount,
        serviceCount,
        techCount,
        socialCount,
      }}
      statusData={{
        dbStatus,
        telegramStatus,
        seoStatus: seoData?.status ?? null,
        seoTitle: seoData?.title ?? null,
        seoUpdatedAt: seoData?.updatedAt?.toISOString() ?? null,
      }}
      settingsMap={settingsMap}
    />
  );
}
