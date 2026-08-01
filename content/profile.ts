/**
 * PROFILE CONTENT
 * ───────────────
 * Edit this file to update personal information.
 * All components that display profile data import from here.
 */

export const profile = {
  // ── Personal Info ──────────────────────────────────────────
  name: "Laziza Najmiddinova",
  firstName: "Laziza",
  lastName: "Najmiddinova",
  age: 17,
  location: "Uzbekistan",
  team: "Zenfinity Developer Team",

  // ── Roles (shown in typing animation) ──────────────────────
  roles: {
    en: [
      "Full Stack Developer",
      "AI Engineer",
      "ERP Systems Developer",
      "Zenfinity Team Member",
    ],
    uz: [
      "Full Stack Dasturchi",
      "AI Muhandis",
      "ERP Tizimlar Dasturchisi",
      "Zenfinity Jamoasi A'zosi",
    ],
    ru: [
      "Full Stack Разработчик",
      "AI Инженер",
      "Разработчик ERP Систем",
      "Участник команды Zenfinity",
    ],
  },

  // ── Contact ─────────────────────────────────────────────────
  contact: {
    email: "lazizanajmiddinova795@gmail.com",
    telegram: "@nlemni",
    telegramUrl: "https://t.me/nlemni",
    phone: "+998 90 605 96 04",
    phoneUrl: "tel:+998906059604",
  },

  // ── Spoken Languages ────────────────────────────────────────
  languages: [
    { flag: "🇺🇿", label: "Uzbek" },
    { flag: "🇬🇧", label: "English" },
    { flag: "🇷🇺", label: "Russian" },
  ],

  // ── Social Links (for footer & contact) ─────────────────────
  socials: [
    {
      label: "Email",
      icon: "Mail",
      href: "mailto:lazizanajmiddinova795@gmail.com",
    },
    {
      label: "Telegram",
      icon: "Send",
      href: "https://t.me/nlemni",
    },
  ],

  // ── SEO / Meta ───────────────────────────────────────────────
  seo: {
    title: "Laziza Najmiddinova — Full Stack Developer & AI Engineer",
    description:
      "Portfolio of Laziza Najmiddinova, a Full Stack Developer, AI Engineer, and ERP Systems Developer from Uzbekistan. Member of the Zenfinity Developer Team.",
    keywords: [
      "Laziza Najmiddinova",
      "Full Stack Developer",
      "AI Engineer",
      "ERP Systems",
      "Next.js",
      "React",
      "TypeScript",
      "Uzbekistan",
      "Zenfinity",
      "Portfolio",
      "Web Developer",
      "SaaS",
    ],
  },
} as const;

export type Profile = typeof profile;
