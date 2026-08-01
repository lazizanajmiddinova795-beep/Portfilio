/**
 * SERVICES CONTENT
 * ────────────────
 * Edit this file to add, remove, or update services.
 * - icon: Lucide icon name
 * - en / uz / ru: multilingual title and description
 */

export interface ServiceLang {
  title: string;
  description: string;
}

export interface Service {
  id: string;
  icon: string;
  en: ServiceLang;
  uz: ServiceLang;
  ru: ServiceLang;
}

export const services: Service[] = [
  {
    id: "erp",
    icon: "LayoutDashboard",
    en: {
      title: "ERP Development",
      description:
        "Custom enterprise resource planning systems tailored to your business operations — POS, inventory, HR, CRM and analytics.",
    },
    uz: {
      title: "ERP Ishlab Chiqish",
      description:
        "Biznes operatsiyalaringizga moslashtirilgan maxsus korporativ resurs rejalashtirish tizimlari — POS, inventar, HR, CRM va tahlil.",
    },
    ru: {
      title: "Разработка ERP",
      description:
        "Индивидуальные системы планирования ресурсов предприятия, адаптированные к вашим бизнес-операциям — POS, склад, HR, CRM и аналитика.",
    },
  },

  {
    id: "web-apps",
    icon: "Globe",
    en: {
      title: "Web Applications",
      description:
        "Modern, responsive web applications built with the latest technologies for performance, scalability and excellent UX.",
    },
    uz: {
      title: "Veb Ilovalar",
      description:
        "Ishlash samaradorligi, kengaytiriluvchanlik va ajoyib UX uchun eng yangi texnologiyalar bilan qurilgan zamonaviy, moslashuvchan veb ilovalar.",
    },
    ru: {
      title: "Веб-Приложения",
      description:
        "Современные адаптивные веб-приложения, созданные с использованием новейших технологий для обеспечения производительности, масштабируемости и отличного UX.",
    },
  },

  {
    id: "automation",
    icon: "Zap",
    en: {
      title: "Business Automation",
      description:
        "Automate repetitive business workflows, reduce manual errors and dramatically improve operational efficiency.",
    },
    uz: {
      title: "Biznesni Avtomatlashtirish",
      description:
        "Takrorlanadigan biznes jarayonlarini avtomatlashtirineg, qo'lda xatolarni kamaytiring va operatsion samaradorlikni sezilarli darajada oshiring.",
    },
    ru: {
      title: "Бизнес-Автоматизация",
      description:
        "Автоматизируйте повторяющиеся бизнес-процессы, сократите ручные ошибки и значительно повысьте операционную эффективность.",
    },
  },

  {
    id: "ai",
    icon: "BrainCircuit",
    en: {
      title: "AI Solutions",
      description:
        "Integrate AI and machine learning into your products — from smart recommendations to intelligent document processing.",
    },
    uz: {
      title: "AI Yechimlari",
      description:
        "Mahsulotlaringizga AI va mashinali o'rganishni integratsiyalash — aqlli tavsiyalardan tortib aqlli hujjatlarni qayta ishlashgacha.",
    },
    ru: {
      title: "AI Решения",
      description:
        "Интеграция AI и машинного обучения в ваши продукты — от умных рекомендаций до интеллектуальной обработки документов.",
    },
  },

  {
    id: "saas",
    icon: "Server",
    en: {
      title: "SaaS Development",
      description:
        "Full-cycle SaaS product development from architecture design to multi-tenant deployment and subscription management.",
    },
    uz: {
      title: "SaaS Ishlab Chiqish",
      description:
        "Arxitektura dizaynidan ko'p ijarachilik joylashtirishgacha va obuna boshqaruvigacha to'liq tsikldagi SaaS mahsulotlarini ishlab chiqish.",
    },
    ru: {
      title: "Разработка SaaS",
      description:
        "Полноцикловая разработка SaaS-продуктов от проектирования архитектуры до многопользовательского развёртывания и управления подписками.",
    },
  },

  {
    id: "fullstack",
    icon: "Code2",
    en: {
      title: "Full Stack Development",
      description:
        "End-to-end development covering frontend, backend, database design, API architecture and deployment.",
    },
    uz: {
      title: "Full Stack Ishlab Chiqish",
      description:
        "Frontend, backend, ma'lumotlar bazasi dizayni, API arxitekturasi va joylashtirishni qamrab oluvchi boshidan oxirigacha ishlab chiqish.",
    },
    ru: {
      title: "Full Stack Разработка",
      description:
        "Разработка от начала до конца, охватывающая frontend, backend, проектирование баз данных, архитектуру API и деплой.",
    },
  },
];

// ── Helper ────────────────────────────────────────────────────────────────────
type Lang = "en" | "uz" | "ru";

export function getServicesForLang(lang: Lang) {
  return services.map((s) => ({
    id: s.id,
    icon: s.icon,
    ...s[lang],
  }));
}
