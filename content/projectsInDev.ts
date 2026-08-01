/**
 * PROJECTS IN DEVELOPMENT CONTENT
 * ────────────────────────────────
 * Edit this file to add, remove, or update in-development projects.
 * - icon: Lucide icon name (string key from lucide-react)
 * - progress: 0–100 (approximate completion percentage shown on card)
 * - en / uz / ru: multilingual name and description
 */

export interface ProjectInDevLang {
  name: string;
  description: string;
}

export interface ProjectInDev {
  id: string;
  icon: string;
  progress: number;
  en: ProjectInDevLang;
  uz: ProjectInDevLang;
  ru: ProjectInDevLang;
}

export const projectsInDev: ProjectInDev[] = [
  {
    id: "business-card-builder",
    icon: "CreditCard",
    progress: 20,
    en: {
      name: "Business Card Builder",
      description:
        "A sleek platform for designing and sharing modern digital business cards with custom branding and analytics.",
    },
    uz: {
      name: "Vizitka Quruvchisi",
      description:
        "Maxsus brending va tahlil bilan zamonaviy raqamli vizitka kartochkalarini loyihalash va ulashish uchun elegant platforma.",
    },
    ru: {
      name: "Конструктор Визиток",
      description:
        "Элегантная платформа для создания и обмена современными цифровыми визитными карточками с фирменным дизайном и аналитикой.",
    },
  },

  {
    id: "futurenet-saas",
    icon: "Globe",
    progress: 32,
    en: {
      name: "FutureNet SaaS Platform",
      description:
        "An enterprise SaaS ecosystem combining five integrated business applications into one powerful, unified platform.",
    },
    uz: {
      name: "FutureNet SaaS Platformasi",
      description:
        "Beshta integratsiyalangan biznes ilovasini bitta kuchli, birlashtirilgan platformada birlashtirgan korporativ SaaS ekotizimi.",
    },
    ru: {
      name: "FutureNet SaaS Платформа",
      description:
        "Корпоративная SaaS экосистема, объединяющая пять интегрированных бизнес-приложений в одной мощной унифицированной платформе.",
    },
  },

  {
    id: "smart-hotel",
    icon: "Building2",
    progress: 44,
    en: {
      name: "Smart Hotel Management System",
      description:
        "An intelligent hotel operations platform covering reservations, housekeeping, billing and guest experience management.",
    },
    uz: {
      name: "Smart Mehmonxona Boshqaruv Tizimi",
      description:
        "Bronlash, xonalarni tozalash, hisob-kitob va mehmon tajribasini boshqarishni qamrab oluvchi aqlli mehmonxona operatsiyalari platformasi.",
    },
    ru: {
      name: "Умная Система Управления Отелем",
      description:
        "Интеллектуальная платформа для управления операциями отеля, охватывающая бронирование, уборку, выставление счетов и управление гостевым опытом.",
    },
  },

  {
    id: "library-management",
    icon: "BookOpen",
    progress: 56,
    en: {
      name: "Library Management System",
      description:
        "A modern digital library system with catalog management, member tracking, borrowing workflows and automated notifications.",
    },
    uz: {
      name: "Kutubxona Boshqaruv Tizimi",
      description:
        "Katalog boshqaruvi, a'zolarni kuzatish, kitob olish jarayonlari va avtomatlashtirilgan bildirishnomalar bilan zamonaviy raqamli kutubxona tizimi.",
    },
    ru: {
      name: "Система Управления Библиотекой",
      description:
        "Современная цифровая библиотечная система с управлением каталогом, отслеживанием участников, рабочими процессами выдачи книг и автоматическими уведомлениями.",
    },
  },

  {
    id: "camera-management",
    icon: "Camera",
    progress: 68,
    en: {
      name: "Camera Management Platform",
      description:
        "A centralized platform for managing surveillance cameras, live feeds, recordings and smart security event detection.",
    },
    uz: {
      name: "Kamera Boshqaruv Platformasi",
      description:
        "Kuzatuv kameralarini, jonli translyatsiyalarni, yozuvlarni va aqlli xavfsizlik hodisalarini aniqlashni boshqarish uchun markazlashtirilgan platforma.",
    },
    ru: {
      name: "Платформа Управления Камерами",
      description:
        "Централизованная платформа для управления камерами видеонаблюдения, прямыми трансляциями, записями и интеллектуальным обнаружением событий безопасности.",
    },
  },
];

// ── Helper ────────────────────────────────────────────────────────────────────
type Lang = "en" | "uz" | "ru";

export function getProjectsInDevForLang(lang: Lang) {
  return projectsInDev.map((p) => ({
    id: p.id,
    icon: p.icon,
    progress: p.progress,
    ...p[lang],
  }));
}
