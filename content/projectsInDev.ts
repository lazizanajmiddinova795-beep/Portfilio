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
  features?: string[];
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
    id: "crm-development",
    icon: "Users",
    progress: 100,
    en: {
      name: "CRM Development",
      description: "Design and build custom CRM systems tailored to business workflows.",
      features: [
        "Customer Management",
        "Sales Pipeline",
        "Lead Tracking",
        "Task Management",
        "Employee Management",
        "Analytics Dashboard",
        "Automation",
        "Reporting",
        "Role & Permission System"
      ],
    },
    uz: {
      name: "CRM Ishlab Chiqish",
      description: "Biznes jarayonlariga moslashtirilgan maxsus CRM tizimlarini loyihalash va yaratish.",
      features: [
        "Mijozlarni Boshqarish",
        "Savdo Tizimi",
        "Lidlarni Kuzatish",
        "Vazifalarni Boshqarish",
        "Xodimlarni Boshqarish",
        "Tahlil Paneli",
        "Avtomatlashtirish",
        "Hisobotlar",
        "Rollar va Ruxsatlar Tizimi"
      ],
    },
    ru: {
      name: "Разработка CRM",
      description: "Проектирование и создание пользовательских CRM-систем, адаптированных к рабочим процессам бизнеса.",
      features: [
        "Управление Клиентами",
        "Воронка Продаж",
        "Отслеживание Лидов",
        "Управление Задачами",
        "Управление Сотрудниками",
        "Аналитическая Панель",
        "Автоматизация",
        "Отчетность",
        "Система Ролей и Разрешений"
      ],
    },
  },

  {
    id: "business-automation-bots",
    icon: "Bot",
    progress: 100,
    en: {
      name: "Business Automation Bots",
      description: "Develop intelligent automation bots for businesses to improve communication, customer support and internal workflows.",
      features: [
        "Telegram Bot",
        "WhatsApp Bot",
        "Discord Bot",
        "AI Assistant",
        "Customer Support Bot",
        "Notification Bot",
        "Order Management Bot",
        "Booking Bot"
      ],
    },
    uz: {
      name: "Biznesni Avtomatlashtirish Botlari",
      description: "Aloqa, mijozlarni qo'llab-quvvatlash va ichki jarayonlarni yaxshilash uchun korxonalar uchun aqlli avtomatlashtirish botlarini ishlab chiqish.",
      features: [
        "Telegram Bot",
        "WhatsApp Bot",
        "Discord Bot",
        "AI Yordamchi",
        "Mijozlarni Qo'llab-quvvatlash Boti",
        "Bildirishnoma Boti",
        "Buyurtmalarni Boshqarish Boti",
        "Bronlash Boti"
      ],
    },
    ru: {
      name: "Боты Автоматизации Бизнеса",
      description: "Разработка интеллектуальных ботов автоматизации для бизнеса с целью улучшения коммуникации, поддержки клиентов и внутренних рабочих процессов.",
      features: [
        "Telegram Бот",
        "WhatsApp Бот",
        "Discord Бот",
        "AI Ассистент",
        "Бот Поддержки Клиентов",
        "Бот Уведомлений",
        "Бот Управления Заказами",
        "Бот Бронирования"
      ],
    },
  },

  {
    id: "custom-business-solutions",
    icon: "Briefcase",
    progress: 100,
    en: {
      name: "Custom Business Solutions",
      description: "Develop tailor-made software solutions for companies including ERP systems, management platforms, dashboards, SaaS applications and workflow automation.",
      features: [
        "ERP Systems",
        "SaaS Platforms",
        "Management Systems",
        "Business Dashboards",
        "Internal Company Software",
        "Web Portals"
      ],
    },
    uz: {
      name: "Maxsus Biznes Yechimlari",
      description: "Kompaniyalar uchun ERP tizimlari, boshqaruv platformalari, panellar, SaaS ilovalari va ish oqimini avtomatlashtirish kabi maxsus dasturiy yechimlarni ishlab chiqish.",
      features: [
        "ERP Tizimlari",
        "SaaS Platformalari",
        "Boshqaruv Tizimlari",
        "Biznes Panellari",
        "Ichki Kompaniya Dasturlari",
        "Veb Portallar"
      ],
    },
    ru: {
      name: "Пользовательские Бизнес-Решения",
      description: "Разработка индивидуальных программных решений для компаний, включая ERP-системы, платформы управления, панели мониторинга, SaaS-приложения и автоматизацию рабочих процессов.",
      features: [
        "ERP Системы",
        "SaaS Платформы",
        "Системы Управления",
        "Бизнес-Панели",
        "Внутреннее Программное Обеспечение",
        "Веб-Порталы"
      ],
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
