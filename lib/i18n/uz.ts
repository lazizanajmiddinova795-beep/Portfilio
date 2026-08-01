import type { Translations } from "./types";

import { profile, about, getProjectsForLang, getProjectsInDevForLang, getServicesForLang, getLearningForLang } from "@/content";

const lang = "uz";

export const uz: Translations = {
  nav: {
    home: "Bosh sahifa",
    about: "Men haqimda",
    skills: "Ko'nikmalar",
    techStack: "Texnologiyalar",
    projects: "Loyihalar",
    learning: "O'rganish",
    services: "Xizmatlar",
    contact: "Aloqa",
  },

  hero: {
    greeting: "Salom, men",
    name: profile.name,
    roles: profile.roles.uz,
    tagline: about.uz.tagline,
    cta: {
      projects: "Loyihalarni Ko'rish",
      contact: "Bog'lanish",
    },
    scrollHint: "O'rganish uchun aylantiring",
  },

  about: {
    badge: "Men Haqimda",
    title: about.uz.title,
    p1: about.uz.p1,
    p2: about.uz.p2,
    p3: about.uz.p3,
    stats: {
      projects: "Qurilgan Loyihalar",
      technologies: "Texnologiyalar",
      team: "Jamoa",
      age: "Yoshda",
    },
    location: profile.location,
    team: profile.team,
    available: "Loyihalar uchun mavjud",
  },

  skills: {
    badge: "Ko'nikmalar",
    title: "Men olib keladigan narsalar",
    subtitle: "Real loyihalar orqali sayqallangan texnik ko'nikmalar to'plami.",
    categories: {
      frontend: "Frontend",
      backend: "Backend",
      database: "Ma'lumotlar bazasi",
      tools: "Vositalar va DevOps",
      ai: "AI va ML",
    },
  },

  techStack: {
    badge: "Texnologiyalar",
    title: "Men ishlatiyadigan vositalar",
    subtitle: "Zamonaviy, kengaytiriladigan, korporativ dasturiy ta'minotni quvvatlaydigan texnologiyalar.",
  },

  projects: {
    badge: "Tanlangan Loyihalar",
    title: "Ishlab chiqarishga tayyor tizimlar",
    subtitle: "Kengaytiriluvchanlik, ishlash samaradorligi va foydalanuvchi tajribasini ustuvor qilib qurilgan korporativ dasturiy ta'minot.",
    viewDetails: "Batafsil Ko'rish",
    features: "Xususiyatlar",
    vrestro: getProjectsForLang(lang)[0],
    gymMaster: getProjectsForLang(lang)[1],
  },

  projectsInDev: {
    badge: "Ishlab Chiqilmoqda",
    title: "Kelajakni qurish",
    subtitle: "Hozirda faol ishlab chiqilayotgan loyihalar — zamonaviy dasturiy ta'minot chegaralarini kengaytirish.",
    status: "Ishlab Chiqilmoqda",
    projects: getProjectsInDevForLang(lang),
  },

  learning: {
    badge: "O'rganish Safari",
    title: "Doimo rivojlanish",
    subtitle: "Uzluksiz o'rganish mening muhandislik intizomimning asosiy qismidir. Men hozir nima o'rganyapman.",
    current: "Hozir O'rganyapman",
    items: getLearningForLang(lang),
  },

  services: {
    badge: "Xizmatlar",
    title: "Men siz uchun nima qura olaman",
    subtitle: "Korporativ ERP tizimlaridan AI-ga asoslangan veb-ilovalarigacha — to'liq, ishlab chiqarishga tayyor dasturiy ta'minot yetkazib beraman.",
    items: getServicesForLang(lang),
  },

  contact: {
    badge: "Aloqa",
    title: "Keling, birgalikda nimadir quraylik",
    subtitle: "Loyiha g'oyangiz bormi? Men uni eshitmoqchiman. Menga xabar yuboring va kelin biror ajoyib narsa yarataylik.",
    form: {
      name: "Ismingiz",
      email: "Emailingiz",
      subject: "Mavzu",
      message: "Xabaringiz",
      send: "Xabar Yuborish",
      sending: "Yuborilmoqda...",
      success: "Xabar yuborildi! Tez orada javob beraman.",
      error: "Nimadir noto'g'ri ketdi. Iltimos, qayta urinib ko'ring.",
    },
    info: {
      email: "Email",
      telegram: "Telegram",
      phone: "Telefon",
      location: "Joylashuv",
    },
  },

  footer: {
    tagline: "Kengayadigan korporativ dasturiy ta'minot qurishlar.",
    rights: "Barcha huquqlar himoyalangan.",
    builtWith: "Bilan qurilgan",
    and: "va",
    passion: "ishtiyoq",
  },

  theme: {
    light: "Kunduz",
    dark: "Tungi",
  },

  language: {
    uz: "UZ",
    en: "EN",
    ru: "RU",
  },
};
