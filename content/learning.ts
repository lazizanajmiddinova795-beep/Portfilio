/**
 * LEARNING JOURNEY CONTENT
 * ────────────────────────
 * Edit this file to update the learning timeline.
 * Add or remove items — the timeline renders them in order.
 * Each item has multilingual title and description.
 */

export interface LearningItemLang {
  title: string;
  description: string;
}

export interface LearningItem {
  id: string;
  en: LearningItemLang;
  uz: LearningItemLang;
  ru: LearningItemLang;
}

export const learningItems: LearningItem[] = [
  {
    id: "nextjs",
    en: {
      title: "Advanced Next.js",
      description:
        "App Router, Server Components, Streaming, Suspense, and full-stack patterns.",
    },
    uz: {
      title: "Kengaytirilgan Next.js",
      description:
        "App Router, Server Components, Streaming, Suspense va to'liq stek naqshlar.",
    },
    ru: {
      title: "Продвинутый Next.js",
      description:
        "App Router, Server Components, Streaming, Suspense и паттерны full-stack разработки.",
    },
  },

  {
    id: "nestjs",
    en: {
      title: "NestJS",
      description:
        "Building scalable, enterprise-grade Node.js backends with modular architecture.",
    },
    uz: {
      title: "NestJS",
      description:
        "Modulli arxitektura bilan kengaytiriladigan, korporativ darajadagi Node.js backlend qurishlar.",
    },
    ru: {
      title: "NestJS",
      description:
        "Создание масштабируемых корпоративных Node.js бэкендов с модульной архитектурой.",
    },
  },

  {
    id: "ai",
    en: {
      title: "Artificial Intelligence",
      description:
        "Machine learning fundamentals, LLMs, prompt engineering and AI integration in products.",
    },
    uz: {
      title: "Sun'iy Intellekt",
      description:
        "Mashinali o'rganish asoslari, LLMlar, prompt muhandisligi va mahsulotlarda AI integratsiyasi.",
    },
    ru: {
      title: "Искусственный Интеллект",
      description:
        "Основы машинного обучения, LLM, инжиниринг промптов и интеграция AI в продукты.",
    },
  },

  {
    id: "uiux",
    en: {
      title: "UI/UX Design",
      description:
        "Design systems, visual hierarchy, motion design and user-centered product thinking.",
    },
    uz: {
      title: "UI/UX Dizayn",
      description:
        "Dizayn tizimlari, vizual ierarxiya, harakat dizayni va foydalanuvchiga yo'naltirilgan mahsulot fikrlash.",
    },
    ru: {
      title: "UI/UX Дизайн",
      description:
        "Дизайн-системы, визуальная иерархия, моушн-дизайн и мышление продукта, ориентированное на пользователя.",
    },
  },

  {
    id: "design-systems",
    en: {
      title: "Design Systems",
      description:
        "Building consistent, scalable component libraries and token-based design systems.",
    },
    uz: {
      title: "Dizayn Tizimlari",
      description:
        "Izchil, kengaytiriladigan komponent kutubxonalari va token-ga asoslangan dizayn tizimlarini qurish.",
    },
    ru: {
      title: "Дизайн-Системы",
      description:
        "Создание последовательных, масштабируемых библиотек компонентов и дизайн-систем на основе токенов.",
    },
  },

  {
    id: "enterprise-arch",
    en: {
      title: "Enterprise Architecture",
      description:
        "Microservices, event-driven systems, domain-driven design and scalable system design.",
    },
    uz: {
      title: "Korporativ Arxitektura",
      description:
        "Mikroxizmatlar, hodisaga asoslangan tizimlar, domen-asoslangan dizayn va kengaytiriladigan tizim dizayni.",
    },
    ru: {
      title: "Корпоративная Архитектура",
      description:
        "Микросервисы, событийно-ориентированные системы, доменно-ориентированный дизайн и масштабируемый дизайн систем.",
    },
  },

  {
    id: "performance",
    en: {
      title: "Performance Optimization",
      description:
        "Core Web Vitals, bundle optimization, caching strategies and server-side rendering.",
    },
    uz: {
      title: "Ishlash Samaradorligini Optimallash",
      description:
        "Core Web Vitals, paket optimizatsiyasi, keshlash strategiyalari va server tomonida rendering.",
    },
    ru: {
      title: "Оптимизация Производительности",
      description:
        "Core Web Vitals, оптимизация бандла, стратегии кэширования и серверный рендеринг.",
    },
  },

  {
    id: "cloud",
    en: {
      title: "Cloud Deployment",
      description:
        "Deploying and managing applications on modern cloud infrastructure with CI/CD pipelines.",
    },
    uz: {
      title: "Bulutda Joylashtirish",
      description:
        "Zamonaviy bulut infratuzilmasida CI/CD quvurlari bilan ilovalarni joylashtirish va boshqarish.",
    },
    ru: {
      title: "Облачный Деплой",
      description:
        "Развёртывание и управление приложениями в современной облачной инфраструктуре с CI/CD пайплайнами.",
    },
  },
];

// ── Helper ────────────────────────────────────────────────────────────────────
type Lang = "en" | "uz" | "ru";

export function getLearningForLang(lang: Lang) {
  return learningItems.map((item) => ({
    id: item.id,
    ...item[lang],
  }));
}
