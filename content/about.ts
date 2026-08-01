/**
 * ABOUT / BIO CONTENT
 * ───────────────────
 * Edit this file to update the About section bio paragraphs.
 * Each language has three paragraphs (p1, p2, p3).
 */

export interface AboutLang {
  title: string;
  p1: string;
  p2: string;
  p3: string;
  tagline: string;
}

export const about: Record<"en" | "uz" | "ru", AboutLang> = {
  en: {
    title: "Crafting software that matters",
    tagline:
      "Building premium enterprise software that scales — from ERP systems to AI-powered SaaS platforms.",
    p1: "I'm a passionate software engineer focused on building enterprise-grade systems, scalable web applications, and AI-integrated solutions that solve real business problems.",
    p2: "As a member of the Zenfinity Developer Team, I design and develop full-stack products — from ERP systems managing entire business operations to modern SaaS platforms. My focus is always on clean architecture, performance, and exceptional user experience.",
    p3: "I believe great software should feel invisible — powerful under the hood, effortless to use. Every line of code I write is aimed at delivering real value, not just meeting requirements.",
  },

  uz: {
    title: "Muhim dasturiy ta'minot yaratish",
    tagline:
      "ERP tizimlaridan AI-ga asoslangan SaaS platformalargacha — premium korporativ dasturiy ta'minot yarataman.",
    p1: "Men korporativ darajadagi tizimlar, kengaytiriladigan veb-ilovalar va real biznes muammolarini hal qiluvchi AI-integratsiyalangan yechimlarni yaratishga ishtiyoqmand dasturiy muhandissman.",
    p2: "Zenfinity Developer Team a'zosi sifatida men to'liq stek mahsulotlarni loyihalash va ishlab chiqaman — butun biznes operatsiyalarini boshqaradigan ERP tizimlaridan zamonaviy SaaS platformalargacha. Mening asosiy e'tiborim doimo toza arxitektura, ishlash samaradorligi va ajoyib foydalanuvchi tajribasiga qaratilgan.",
    p3: "Men shunday dasturiy ta'minotga ishonamanki, u ko'rinmas bo'lishi kerak — ichida kuchli, foydalanish oson. Men yozgan har bir kod qatori talablarga javob berishdan ko'ra, haqiqiy qiymat berishga qaratilgan.",
  },

  ru: {
    title: "Создаю программное обеспечение, которое важно",
    tagline:
      "Создаю премиальное корпоративное программное обеспечение — от ERP систем до AI-платформ SaaS.",
    p1: "Я увлечённый разработчик программного обеспечения, сосредоточенный на создании корпоративных систем, масштабируемых веб-приложений и AI-интегрированных решений, которые решают реальные бизнес-задачи.",
    p2: "Как член команды Zenfinity Developer Team, я проектирую и разрабатываю полноценные продукты — от ERP-систем, управляющих целыми бизнес-операциями, до современных SaaS-платформ. Мой фокус всегда на чистой архитектуре, производительности и исключительном пользовательском опыте.",
    p3: "Я верю, что отличное программное обеспечение должно быть невидимым — мощным внутри, простым в использовании. Каждая строка кода, которую я пишу, направлена на создание реальной ценности, а не просто на выполнение требований.",
  },
};
