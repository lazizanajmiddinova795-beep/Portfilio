import bcrypt from "bcryptjs";

// ── Types ─────────────────────────────────────────────────────────────────────

interface PrismaLike {
  user: {
    upsert: (args: unknown) => Promise<unknown>;
    findFirst: (args: unknown) => Promise<unknown | null>;
  };
  profile: { upsert: (args: unknown) => Promise<unknown> };
  about: { upsert: (args: unknown) => Promise<unknown> };
  skill: { createMany: (args: unknown) => Promise<unknown>; findFirst: (args: unknown) => Promise<unknown> };
  techStack: { createMany: (args: unknown) => Promise<unknown>; findFirst: (args: unknown) => Promise<unknown> };
  project: { upsert: (args: unknown) => Promise<unknown> };
  service: { upsert: (args: unknown) => Promise<unknown> };
  inDevelopment: { upsert: (args: unknown) => Promise<unknown> };
  socialLink: { createMany: (args: unknown) => Promise<unknown>; findFirst: (args: unknown) => Promise<unknown> };
  sEO: { upsert: (args: unknown) => Promise<unknown> };
  language: { upsert: (args: unknown) => Promise<unknown> };
  setting: { upsert: (args: unknown) => Promise<unknown> };
  $disconnect: () => Promise<void>;
}

// ── Import Prisma client ───────────────────────────────────────────────────────

async function getPrisma(): Promise<PrismaLike> {
  const { prisma } = await import("../lib/prisma.js");
  return prisma as unknown as PrismaLike;
}

// ── Main Seed ─────────────────────────────────────────────────────────────────

async function main() {
  const prisma = await getPrisma();

  console.log("🌱 Starting database seed...\n");

  // ── 1. Admin User ────────────────────────────────────────────────────────────

  const adminEmail = process.env.ADMIN_EMAIL || "admin@portfolio.local";
  const adminPassword = "admin123";
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
    },
  }) as { id: string };

  console.log(`✅ Admin user: ${adminEmail}`);

  // ── 2. Profile ───────────────────────────────────────────────────────────────

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

  console.log("✅ Profile seeded");

  // ── 3. About ─────────────────────────────────────────────────────────────────

  await prisma.about.upsert({
    where: { slug: "main" },
    update: {},
    create: {
      slug: "main",
      content: {
        en: "I'm Laziza Najmiddinova, a 17-year-old Full Stack Developer and AI Engineer from Uzbekistan. As a member of the Zenfinity Developer Team, I specialize in building scalable web applications, ERP systems, and AI-powered solutions that solve real business problems.",
        uz: "Men Laziza Najmiddinovaman, O'zbekistondan 17 yoshli Full Stack Dasturchi va AI Muhandisiman. Zenfinity Dasturchilar Jamoasining a'zosi sifatida, men haqiqiy biznes muammolarini hal qiluvchi kengaytiriladigan veb-ilovalar, ERP tizimlar va AI-powered yechimlar qurishga ixtisoslashganman.",
        ru: "Я Лазиза Наджмиддинова, 17-летний Full Stack разработчик и AI-инженер из Узбекистана. Как член команды Zenfinity, я специализируюсь на создании масштабируемых веб-приложений, ERP-систем и решений на базе AI.",
      },
      highlights: [
        { icon: "⚡", en: "Fast delivery", uz: "Tez yetkazib berish", ru: "Быстрая доставка" },
        { icon: "🔒", en: "Secure code", uz: "Xavfsiz kod", ru: "Безопасный код" },
        { icon: "📱", en: "Responsive design", uz: "Moslashuvchan dizayn", ru: "Адаптивный дизайн" },
      ],
      status: "PUBLISHED",
      createdBy: admin.id,
    },
  });

  console.log("✅ About seeded");

  // ── 4. Skills ────────────────────────────────────────────────────────────────

  const existingSkill = await prisma.skill.findFirst({ where: { name: "React / Next.js" } });
  if (!existingSkill) {
    await prisma.skill.createMany({
      data: [
        { name: "React / Next.js", level: 90, category: "frontend", order: 1, createdBy: admin.id },
        { name: "TypeScript", level: 85, category: "frontend", order: 2, createdBy: admin.id },
        { name: "TailwindCSS", level: 92, category: "frontend", order: 3, createdBy: admin.id },
        { name: "Framer Motion", level: 80, category: "frontend", order: 4, createdBy: admin.id },
        { name: "Node.js / Express", level: 82, category: "backend", order: 5, createdBy: admin.id },
        { name: "NestJS", level: 65, category: "backend", order: 6, createdBy: admin.id },
        { name: "REST APIs", level: 88, category: "backend", order: 7, createdBy: admin.id },
        { name: "PostgreSQL", level: 78, category: "database", order: 8, createdBy: admin.id },
        { name: "MongoDB", level: 75, category: "database", order: 9, createdBy: admin.id },
        { name: "Prisma ORM", level: 80, category: "database", order: 10, createdBy: admin.id },
        { name: "Git / GitHub", level: 90, category: "tools", order: 11, createdBy: admin.id },
        { name: "Docker", level: 60, category: "tools", order: 12, createdBy: admin.id },
        { name: "AI Integration", level: 72, category: "ai", order: 13, createdBy: admin.id },
        { name: "Prompt Engineering", level: 80, category: "ai", order: 14, createdBy: admin.id },
      ],
    });
    console.log("✅ Skills seeded");
  } else {
    console.log("⏭️  Skills already exist, skipping");
  }

  // ── 5. Tech Stack ────────────────────────────────────────────────────────────

  const existingTech = await prisma.techStack.findFirst({ where: { name: "Next.js" } });
  if (!existingTech) {
    await prisma.techStack.createMany({
      data: [
        { name: "Next.js", icon: "nextjs", category: "Frontend", order: 1, createdBy: admin.id },
        { name: "React", icon: "react", category: "Frontend", order: 2, createdBy: admin.id },
        { name: "TypeScript", icon: "typescript", category: "Frontend", order: 3, createdBy: admin.id },
        { name: "TailwindCSS", icon: "tailwind", category: "Frontend", order: 4, createdBy: admin.id },
        { name: "Node.js", icon: "nodejs", category: "Backend", order: 5, createdBy: admin.id },
        { name: "NestJS", icon: "nestjs", category: "Backend", order: 6, createdBy: admin.id },
        { name: "PostgreSQL", icon: "postgresql", category: "Database", order: 7, createdBy: admin.id },
        { name: "MongoDB", icon: "mongodb", category: "Database", order: 8, createdBy: admin.id },
        { name: "Prisma", icon: "prisma", category: "Database", order: 9, createdBy: admin.id },
        { name: "Git", icon: "git", category: "Tools", order: 10, createdBy: admin.id },
        { name: "Docker", icon: "docker", category: "Tools", order: 11, createdBy: admin.id },
        { name: "Vercel", icon: "vercel", category: "Deployment", order: 12, createdBy: admin.id },
      ],
    });
    console.log("✅ Tech Stack seeded");
  } else {
    console.log("⏭️  Tech Stack already exists, skipping");
  }

  // ── 6. Projects ──────────────────────────────────────────────────────────────

  const projects = [
    {
      id: "proj-vrestro",
      slug: "vrestro",
      name: "VRestro",
      gradient: "from-green-500 via-emerald-500 to-teal-500",
      i18n: {
        en: { tagline: "Restaurant ERP System", description: "A comprehensive restaurant management platform covering all operational needs — from point-of-sale to kitchen coordination, inventory control, and business analytics.", features: ["Point of Sale (POS)", "Inventory Management", "Kitchen Display System", "Employee Management", "CRM & Loyalty", "Analytics Dashboard", "Administration Panel"] },
        uz: { tagline: "Restoran ERP Tizimi", description: "Barcha operatsion ehtiyojlarni qoplaydigan keng qamrovli restoran boshqaruv platformasi.", features: ["Savdo Nuqtasi (POS)", "Inventar Boshqaruvi", "Oshxona Displey Tizimi", "Xodimlarni Boshqarish", "CRM va Sodiqlik", "Tahlil Paneli", "Boshqaruv Paneli"] },
        ru: { tagline: "Ресторанная ERP Система", description: "Комплексная платформа управления рестораном, охватывающая все операционные потребности.", features: ["Кассовая Система (POS)", "Управление Запасами", "Система Отображения Кухни", "Управление Персоналом", "CRM и Лояльность", "Аналитическая Панель", "Административная Панель"] },
      },
      status: "PUBLISHED",
      order: 1,
      featured: true,
    },
    {
      id: "proj-gymmaster",
      slug: "gymmaster",
      name: "Gym Master",
      gradient: "from-emerald-500 via-green-500 to-lime-500",
      i18n: {
        en: { tagline: "Gym Management System", description: "A full-featured gym management solution designed to streamline membership management, trainer scheduling, payment processing and business performance tracking.", features: ["Membership Management", "Attendance Tracking", "Trainer Management", "Payment Processing", "Scheduling System", "Analytics & Reports"] },
        uz: { tagline: "Sport Zal Boshqaruv Tizimi", description: "A'zolikni boshqarish, murabbiy jadvalini tuzish, to'lovlarni qayta ishlash va biznes samaradorligini kuzatish uchun to'liq funksiyali sport zal boshqaruv yechimi.", features: ["A'zolikni Boshqarish", "Davomat Kuzatuvi", "Murabbiy Boshqaruvi", "To'lovlarni Qayta Ishlash", "Jadval Tizimi", "Tahlil va Hisobotlar"] },
        ru: { tagline: "Система Управления Фитнес-Клубом", description: "Полнофункциональное решение для управления фитнес-клубом.", features: ["Управление Членством", "Учёт Посещаемости", "Управление Тренерами", "Обработка Платежей", "Система Расписания", "Аналитика и Отчёты"] },
      },
      status: "PUBLISHED",
      order: 2,
      featured: true,
    },
  ];

  for (const proj of projects) {
    await prisma.project.upsert({
      where: { slug: proj.slug },
      update: {},
      create: { ...proj, createdBy: admin.id },
    });
  }
  console.log("✅ Projects seeded");

  // ── 7. Services ──────────────────────────────────────────────────────────────

  const services = [
    { id: "svc-erp", slug: "erp", icon: "LayoutDashboard", i18n: { en: { title: "ERP Development", description: "Custom enterprise resource planning systems tailored to your business operations — POS, inventory, HR, CRM and analytics." }, uz: { title: "ERP Ishlab Chiqish", description: "Biznes operatsiyalaringizga moslashtirilgan maxsus korporativ resurs rejalashtirish tizimlari." }, ru: { title: "Разработка ERP", description: "Индивидуальные системы планирования ресурсов предприятия, адаптированные к вашим бизнес-операциям." } }, order: 1, status: "PUBLISHED" },
    { id: "svc-web", slug: "web-apps", icon: "Globe", i18n: { en: { title: "Web Applications", description: "Modern, responsive web applications built with the latest technologies for performance, scalability and excellent UX." }, uz: { title: "Veb Ilovalar", description: "Ishlash samaradorligi, kengaytiriluvchanlik va ajoyib UX uchun eng yangi texnologiyalar bilan qurilgan zamonaviy veb ilovalar." }, ru: { title: "Веб-Приложения", description: "Современные адаптивные веб-приложения, созданные с использованием новейших технологий." } }, order: 2, status: "PUBLISHED" },
    { id: "svc-auto", slug: "automation", icon: "Zap", i18n: { en: { title: "Business Automation", description: "Automate repetitive business workflows, reduce manual errors and dramatically improve operational efficiency." }, uz: { title: "Biznesni Avtomatlashtirish", description: "Takrorlanadigan biznes jarayonlarini avtomatlashtiring va operatsion samaradorlikni oshiring." }, ru: { title: "Бизнес-Автоматизация", description: "Автоматизируйте повторяющиеся бизнес-процессы и повысьте операционную эффективность." } }, order: 3, status: "PUBLISHED" },
    { id: "svc-ai", slug: "ai-solutions", icon: "BrainCircuit", i18n: { en: { title: "AI Solutions", description: "Integrate AI and machine learning into your products — from smart recommendations to intelligent document processing." }, uz: { title: "AI Yechimlari", description: "Mahsulotlaringizga AI va mashinali o'rganishni integratsiyalash." }, ru: { title: "AI Решения", description: "Интеграция AI и машинного обучения в ваши продукты." } }, order: 4, status: "PUBLISHED" },
    { id: "svc-saas", slug: "saas", icon: "Server", i18n: { en: { title: "SaaS Development", description: "Full-cycle SaaS product development from architecture design to multi-tenant deployment and subscription management." }, uz: { title: "SaaS Ishlab Chiqish", description: "Arxitektura dizaynidan ko'p ijarachilik joylashtirishgacha to'liq tsikldagi SaaS mahsulotlarini ishlab chiqish." }, ru: { title: "Разработка SaaS", description: "Полноцикловая разработка SaaS-продуктов от проектирования архитектуры до многопользовательского развёртывания." } }, order: 5, status: "PUBLISHED" },
    { id: "svc-full", slug: "fullstack", icon: "Code2", i18n: { en: { title: "Full Stack Development", description: "End-to-end development covering frontend, backend, database design, API architecture and deployment." }, uz: { title: "Full Stack Ishlab Chiqish", description: "Frontend, backend, ma'lumotlar bazasi dizayni, API arxitekturasi va joylashtirishni qamrab oluvchi ishlab chiqish." }, ru: { title: "Full Stack Разработка", description: "Разработка от начала до конца, охватывающая frontend, backend, проектирование баз данных и деплой." } }, order: 6, status: "PUBLISHED" },
  ];

  for (const svc of services) {
    await prisma.service.upsert({
      where: { slug: svc.slug },
      update: {},
      create: { ...svc, createdBy: admin.id },
    });
  }
  console.log("✅ Services seeded");

  // ── 8. Social Links ──────────────────────────────────────────────────────────

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
    console.log("✅ Social Links seeded");
  } else {
    console.log("⏭️  Social Links already exist, skipping");
  }

  // ── 9. SEO ───────────────────────────────────────────────────────────────────

  await prisma.sEO.upsert({
    where: { slug: "main" },
    update: {},
    create: {
      slug: "main",
      title: "Laziza Najmiddinova — Full Stack Developer & AI Engineer",
      description: "Portfolio of Laziza Najmiddinova, a Full Stack Developer, AI Engineer, and ERP Systems Developer from Uzbekistan. Member of the Zenfinity Developer Team.",
      keywords: ["Laziza Najmiddinova", "Full Stack Developer", "AI Engineer", "ERP Systems", "Next.js", "React", "TypeScript", "Uzbekistan", "Zenfinity", "Portfolio", "Web Developer", "SaaS"],
      robots: "index, follow",
      twitterHandle: "@nlemni",
      status: "PUBLISHED",
      createdBy: admin.id,
    },
  });
  console.log("✅ SEO seeded");

  // ── 10. Languages ────────────────────────────────────────────────────────────

  const langs = [
    { code: "en", name: "English", flag: "🇬🇧", enabled: true, isDefault: true, order: 1 },
    { code: "uz", name: "O'zbek", flag: "🇺🇿", enabled: true, isDefault: false, order: 2 },
    { code: "ru", name: "Русский", flag: "🇷🇺", enabled: true, isDefault: false, order: 3 },
  ];

  for (const lang of langs) {
    await prisma.language.upsert({
      where: { code: lang.code },
      update: {},
      create: lang,
    });
  }
  console.log("✅ Languages seeded");

  // ── 11. Default Settings ─────────────────────────────────────────────────────

  const settings = [
    { key: "site_name", value: "Laziza Najmiddinova Portfolio", label: "Site Name", group: "general" },
    { key: "contact_email", value: "lazizanajmiddinova795@gmail.com", label: "Contact Email", group: "contact" },
    { key: "telegram_bot_enabled", value: "true", label: "Telegram Bot Enabled", group: "contact" },
    { key: "theme_default", value: "light", label: "Default Theme", group: "appearance" },
  ];

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: { ...setting, createdBy: admin.id },
    });
  }
  console.log("✅ Settings seeded");

  console.log("\n🎉 Database seed complete!\n");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`Admin Email:    ${adminEmail}`);
  console.log(`Admin Password: admin123`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    const { prisma } = await import("../lib/prisma.js") as { prisma: { $disconnect: () => Promise<void> } };
    await prisma.$disconnect();
  });
