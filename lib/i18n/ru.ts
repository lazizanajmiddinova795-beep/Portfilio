import type { Translations } from "./types";

import { profile, about, getProjectsForLang, getProjectsInDevForLang, getServicesForLang, getLearningForLang } from "@/content";

const lang = "ru";

export const ru: Translations = {
  nav: {
    home: "Главная",
    about: "Обо мне",
    skills: "Навыки",
    techStack: "Технологии",
    projects: "Проекты",
    learning: "Обучение",
    services: "Услуги",
    contact: "Контакт",
  },

  hero: {
    greeting: "Привет, я",
    name: profile.name,
    roles: profile.roles.ru,
    tagline: about.ru.tagline,
    cta: {
      projects: "Посмотреть Проекты",
      contact: "Связаться",
    },
    scrollHint: "Прокрутите для изучения",
  },

  about: {
    badge: "Обо Мне",
    title: about.ru.title,
    p1: about.ru.p1,
    p2: about.ru.p2,
    p3: about.ru.p3,
    stats: {
      projects: "Создано Проектов",
      technologies: "Технологий",
      team: "Команда",
      age: "Лет",
    },
    location: profile.location,
    team: profile.team,
    available: "Доступна для проектов",
  },

  skills: {
    badge: "Навыки",
    title: "Что я привношу",
    subtitle: "Тщательно подобранный набор технических навыков, отточенных в реальных проектах.",
    categories: {
      frontend: "Frontend",
      backend: "Backend",
      database: "База Данных",
      tools: "Инструменты и DevOps",
      ai: "AI и ML",
    },
  },

  techStack: {
    badge: "Технологии",
    title: "Инструменты, с которыми я работаю",
    subtitle: "Тщательно выбранные технологии, обеспечивающие современное масштабируемое корпоративное ПО.",
  },

  projects: {
    badge: "Избранные Проекты",
    title: "Системы, готовые к производству",
    subtitle: "Корпоративное программное обеспечение, созданное с приоритетом масштабируемости, производительности и пользовательского опыта.",
    viewDetails: "Подробнее",
    features: "Возможности",
    vrestro: getProjectsForLang(lang)[0],
    gymMaster: getProjectsForLang(lang)[1],
  },

  projectsInDev: {
    badge: "В Разработке",
    title: "Строим будущее",
    subtitle: "Проекты, находящиеся в активной разработке — расширяющие границы возможного в современном ПО.",
    status: "В Разработке",
    availableStatus: "Доступно",
    projects: getProjectsInDevForLang(lang),
  },

  learning: {
    badge: "Путь Обучения",
    title: "Всегда развиваюсь",
    subtitle: "Непрерывное обучение — ключевая часть моей инженерной дисциплины. Вот что я изучаю прямо сейчас.",
    current: "Изучаю Сейчас",
    items: getLearningForLang(lang),
  },

  services: {
    badge: "Услуги",
    title: "Что я могу построить для вас",
    subtitle: "От корпоративных ERP-систем до AI-веб-приложений — предоставляю полноценное, готовое к производству программное обеспечение.",
    items: getServicesForLang(lang),
  },

  contact: {
    badge: "Контакт",
    title: "Давайте вместе создадим что-то",
    subtitle: "Есть идея проекта? Я хотела бы её услышать. Напишите мне и создадим что-то замечательное вместе.",
    form: {
      name: "Ваше Имя",
      email: "Ваш Email",
      subject: "Тема",
      message: "Ваше Сообщение",
      send: "Отправить Сообщение",
      sending: "Отправка...",
      success: "Сообщение отправлено! Скоро свяжусь с вами.",
      error: "Что-то пошло не так. Пожалуйста, попробуйте снова.",
    },
    info: {
      email: "Email",
      telegram: "Telegram",
      phone: "Телефон",
      location: "Местоположение",
    },
  },

  footer: {
    tagline: "Создаю масштабируемое корпоративное программное обеспечение.",
    rights: "Все права защищены.",
    builtWith: "Создано с",
    and: "и",
    passion: "страстью",
  },

  theme: {
    light: "Светлая",
    dark: "Тёмная",
  },

  language: {
    uz: "UZ",
    en: "EN",
    ru: "RU",
  },
};
