/**
 * PROJECTS CONTENT
 * ────────────────
 * Edit this file to update featured project details.
 * Each project has multilingual fields: { en, uz, ru }.
 * The `name` field is the same in all languages (product name).
 * The `gradient` field controls the card header color.
 */

export interface ProjectLang {
  tagline: string;
  description: string;
  features: string[];
}

export interface Project {
  id: string;
  name: string;
  gradient: string;
  en: ProjectLang;
  uz: ProjectLang;
  ru: ProjectLang;
}

export const projects: Project[] = [
  {
    id: "vrestro",
    name: "VRestro",
    gradient: "from-green-500 via-emerald-500 to-teal-500",

    en: {
      tagline: "Restaurant ERP System",
      description:
        "A comprehensive restaurant management platform covering all operational needs — from point-of-sale to kitchen coordination, inventory control, and business analytics.",
      features: [
        "Point of Sale (POS)",
        "Inventory Management",
        "Kitchen Display System",
        "Employee Management",
        "CRM & Loyalty",
        "Analytics Dashboard",
        "Administration Panel",
      ],
    },

    uz: {
      tagline: "Restoran ERP Tizimi",
      description:
        "Barcha operatsion ehtiyojlarni qoplaydigan keng qamrovli restoran boshqaruv platformasi — savdo nuqtasidan oshxona muvofiqlashtirish, inventar nazorati va biznes tahlillarigacha.",
      features: [
        "Savdo Nuqtasi (POS)",
        "Inventar Boshqaruvi",
        "Oshxona Displey Tizimi",
        "Xodimlarni Boshqarish",
        "CRM va Sodiqlik",
        "Tahlil Paneli",
        "Boshqaruv Paneli",
      ],
    },

    ru: {
      tagline: "Ресторанная ERP Система",
      description:
        "Комплексная платформа управления рестораном, охватывающая все операционные потребности — от кассы до координации кухни, контроля запасов и бизнес-аналитики.",
      features: [
        "Кассовая Система (POS)",
        "Управление Запасами",
        "Система Отображения Кухни",
        "Управление Персоналом",
        "CRM и Лояльность",
        "Аналитическая Панель",
        "Административная Панель",
      ],
    },
  },

  {
    id: "gymMaster",
    name: "Gym Master",
    gradient: "from-emerald-500 via-green-500 to-lime-500",

    en: {
      tagline: "Gym Management System",
      description:
        "A full-featured gym management solution designed to streamline membership management, trainer scheduling, payment processing and business performance tracking.",
      features: [
        "Membership Management",
        "Attendance Tracking",
        "Trainer Management",
        "Payment Processing",
        "Scheduling System",
        "Analytics & Reports",
      ],
    },

    uz: {
      tagline: "Sport Zal Boshqaruv Tizimi",
      description:
        "A'zolikni boshqarish, murabbiy jadvalini tuzish, to'lovlarni qayta ishlash va biznes samaradorligini kuzatishni soddalashtirish uchun mo'ljallangan to'liq funksiyali sport zal boshqaruv yechimi.",
      features: [
        "A'zolikni Boshqarish",
        "Davomat Kuzatuvi",
        "Murabbiy Boshqaruvi",
        "To'lovlarni Qayta Ishlash",
        "Jadval Tizimi",
        "Tahlil va Hisobotlar",
      ],
    },

    ru: {
      tagline: "Система Управления Фитнес-Клубом",
      description:
        "Полнофункциональное решение для управления фитнес-клубом, призванное упростить управление членством, расписание тренеров, обработку платежей и отслеживание эффективности.",
      features: [
        "Управление Членством",
        "Учёт Посещаемости",
        "Управление Тренерами",
        "Обработка Платежей",
        "Система Расписания",
        "Аналитика и Отчёты",
      ],
    },
  },
];

// ── Helper ────────────────────────────────────────────────────────────────────
type Lang = "en" | "uz" | "ru";

export function getProjectsForLang(lang: Lang) {
  return projects.map((p) => ({
    id: p.id,
    name: p.name,
    gradient: p.gradient,
    ...p[lang],
  }));
}
