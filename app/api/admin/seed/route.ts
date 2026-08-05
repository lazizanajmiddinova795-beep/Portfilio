import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return handleSeed(req);
}

export async function POST(req: Request) {
  return handleSeed(req);
}

async function handleSeed(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get("secret");

  // Bypass auth if the secret matches (for initial setup)
  if (secret !== "init123") {
    // Only allow in production for authenticated admins if no secret is provided
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    const bcrypt = await import("bcryptjs");

    const adminEmail = process.env.ADMIN_EMAIL || "admin@portfolio.local";
    const adminPassword = "admin123";
    const hashedPassword = await bcrypt.default.hash(adminPassword, 12);

    // Upsert admin user
    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {},
      create: { name: "Admin", email: adminEmail, password: hashedPassword, role: "ADMIN" },
    });

    // Upsert profile
    await prisma.profile.upsert({
      where: { id: "main-profile" },
      update: {},
      create: {
        id: "main-profile",
        name: "Laziza Najmiddinova",
        firstName: "Laziza",
        lastName: "Najmiddinova",
        age: 17,
        location: "Uzbekistan",
        team: "Zenfinity Developer Team",
        email: "lazizanajmiddinova795@gmail.com",
        telegram: "@nlemni",
        telegramUrl: "https://t.me/nlemni",
        roles: {
          en: ["Full Stack Developer", "AI Engineer", "ERP Systems Developer", "Zenfinity Team Member"],
          uz: ["Full Stack Dasturchi", "AI Muhandis", "ERP Tizimlar Dasturchisi", "Zenfinity Jamoasi A'zosi"],
          ru: ["Full Stack Разработчик", "AI Инженер", "Разработчик ERP Систем", "Участник команды Zenfinity"],
        },
        createdBy: admin.id,
      },
    });

    // About
    await prisma.about.upsert({
      where: { slug: "main" },
      update: {},
      create: {
        slug: "main",
        content: {
          en: "I'm Laziza Najmiddinova, a 17-year-old Full Stack Developer and AI Engineer from Uzbekistan.",
          uz: "Men Laziza Najmiddinovaman, O'zbekistondan 17 yoshli Full Stack Dasturchi va AI Muhandisiman.",
          ru: "Я Лазиза Наджмиддинова, 17-летний Full Stack разработчик и AI-инженер из Узбекистана.",
        },
        highlights: [
          { icon: "⚡", en: "Fast delivery", uz: "Tez yetkazib berish", ru: "Быстрая доставка" },
          { icon: "🔒", en: "Secure code", uz: "Xavfsiz kod", ru: "Безопасный код" },
        ],
        status: "PUBLISHED",
        createdBy: admin.id,
      },
    });

    // Skills
    const existingSkill = await prisma.skill.findFirst({ where: { name: "React / Next.js" } });
    if (!existingSkill) {
      await prisma.skill.createMany({
        data: [
          { name: "React / Next.js", level: 90, category: "frontend", order: 1, createdBy: admin.id },
          { name: "TypeScript", level: 85, category: "frontend", order: 2, createdBy: admin.id },
          { name: "TailwindCSS", level: 92, category: "frontend", order: 3, createdBy: admin.id },
          { name: "Node.js / Express", level: 82, category: "backend", order: 4, createdBy: admin.id },
          { name: "PostgreSQL", level: 78, category: "database", order: 5, createdBy: admin.id },
          { name: "Git / GitHub", level: 90, category: "tools", order: 6, createdBy: admin.id },
          { name: "AI Integration", level: 72, category: "ai", order: 7, createdBy: admin.id },
        ],
      });
    }

    // Projects
    await prisma.project.upsert({
      where: { slug: "vrestro" },
      update: {},
      create: {
        slug: "vrestro",
        name: "VRestro",
        gradient: "from-green-500 via-emerald-500 to-teal-500",
        i18n: {
          en: { tagline: "Restaurant ERP System", description: "A comprehensive restaurant management platform.", features: ["POS", "Inventory", "Kitchen Display", "Analytics"] },
          uz: { tagline: "Restoran ERP Tizimi", description: "Keng qamrovli restoran boshqaruv platformasi.", features: ["POS", "Inventar", "Oshxona Displey", "Tahlil"] },
          ru: { tagline: "Ресторанная ERP Система", description: "Комплексная платформа управления рестораном.", features: ["POS", "Инвентарь", "Дисплей кухни", "Аналитика"] },
        },
        status: "PUBLISHED",
        order: 1,
        featured: true,
        createdBy: admin.id,
      },
    });

    // SEO
    await prisma.sEO.upsert({
      where: { slug: "main" },
      update: {},
      create: {
        slug: "main",
        title: "Laziza Najmiddinova — Full Stack Developer & AI Engineer",
        description: "Portfolio of Laziza Najmiddinova, Full Stack Developer and AI Engineer from Uzbekistan.",
        keywords: ["Laziza Najmiddinova", "Full Stack Developer", "AI Engineer", "Uzbekistan"],
        robots: "index, follow",
        status: "PUBLISHED",
        createdBy: admin.id,
      },
    });

    // Social links
    const existingSocial = await prisma.socialLink.findFirst({ where: { platform: "github" } });
    if (!existingSocial) {
      await prisma.socialLink.createMany({
        data: [
          { platform: "github", url: "https://github.com/lazizanajmiddinova795-beep", icon: "Github", label: "GitHub", order: 1, createdBy: admin.id },
          { platform: "linkedin", url: "https://www.linkedin.com/in/laziza-najmiddinova-8a7187427", icon: "Linkedin", label: "LinkedIn", order: 2, createdBy: admin.id },
          { platform: "telegram", url: "https://t.me/nlemni", icon: "Send", label: "Telegram", order: 3, createdBy: admin.id },
          { platform: "email", url: "mailto:lazizanajmiddinova795@gmail.com", icon: "Mail", label: "Email", order: 4, createdBy: admin.id },
        ],
      });
    }

    // Languages
    for (const lang of [
      { code: "en", name: "English", flag: "🇬🇧", enabled: true, isDefault: true, order: 1 },
      { code: "uz", name: "O'zbek", flag: "🇺🇿", enabled: true, isDefault: false, order: 2 },
      { code: "ru", name: "Русский", flag: "🇷🇺", enabled: true, isDefault: false, order: 3 },
    ]) {
      await prisma.language.upsert({ where: { code: lang.code }, update: {}, create: lang });
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      admin: adminEmail,
      dbUrl: process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Seed failed" },
      { status: 500 }
    );
  }
}
