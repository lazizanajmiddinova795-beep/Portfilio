import type { Translations } from "./types";
export type { Translations };

import { profile, about, getProjectsForLang, getProjectsInDevForLang, getServicesForLang, getLearningForLang } from "@/content";

const lang = "en";

export const en: Translations = {
  nav: {
    home: "Home",
    about: "About",
    skills: "Skills",
    techStack: "Tech Stack",
    projects: "Projects",
    learning: "Learning",
    services: "Services",
    contact: "Contact",
  },

  hero: {
    greeting: "Hello, I'm",
    name: profile.name,
    roles: profile.roles.en,
    tagline: about.en.tagline,
    cta: {
      projects: "View Projects",
      contact: "Get in Touch",
    },
    scrollHint: "Scroll to explore",
  },

  about: {
    badge: "About Me",
    title: about.en.title,
    p1: about.en.p1,
    p2: about.en.p2,
    p3: about.en.p3,
    stats: {
      projects: "Projects Built",
      technologies: "Technologies",
      team: "Team",
      age: "Years Old",
    },
    location: profile.location,
    team: profile.team,
    available: "Available for projects",
  },

  skills: {
    badge: "Skills",
    title: "What I bring to the table",
    subtitle: "A curated set of technical skills refined through real-world project development.",
    categories: {
      frontend: "Frontend",
      backend: "Backend",
      database: "Database",
      tools: "Tools & DevOps",
      ai: "AI & ML",
    },
  },

  techStack: {
    badge: "Tech Stack",
    title: "Tools I work with",
    subtitle: "Carefully chosen technologies that power modern, scalable, enterprise-ready software.",
  },

  projects: {
    badge: "Featured Projects",
    title: "Production-ready systems",
    subtitle: "Enterprise software built with scalability, performance and user experience as top priorities.",
    viewDetails: "View Details",
    features: "Features",
    vrestro: getProjectsForLang(lang)[0],
    gymMaster: getProjectsForLang(lang)[1],
  },

  projectsInDev: {
    badge: "In Development",
    title: "Building the future",
    subtitle: "Projects currently under active development — pushing the boundaries of what modern software can do.",
    status: "In Development",
    projects: getProjectsInDevForLang(lang),
  },

  learning: {
    badge: "Learning Journey",
    title: "Always leveling up",
    subtitle: "Continuous learning is a core part of my engineering discipline. Here's what I'm currently mastering.",
    current: "Currently Learning",
    items: getLearningForLang(lang),
  },

  services: {
    badge: "Services",
    title: "What I can build for you",
    subtitle: "From enterprise ERP systems to AI-powered web applications — I deliver complete, production-ready software.",
    items: getServicesForLang(lang),
  },

  contact: {
    badge: "Contact",
    title: "Let's build something together",
    subtitle: "Have a project in mind? I'd love to hear about it. Send me a message and let's create something great.",
    form: {
      name: "Your Name",
      email: "Your Email",
      subject: "Subject",
      message: "Your Message",
      send: "Send Message",
      sending: "Sending...",
      success: "Message sent! I'll get back to you soon.",
      error: "Something went wrong. Please try again.",
    },
    info: {
      email: "Email",
      telegram: "Telegram",
      phone: "Phone",
      location: "Location",
    },
  },

  footer: {
    tagline: "Building enterprise software that scales.",
    rights: "All rights reserved.",
    builtWith: "Built with",
    and: "and",
    passion: "passion",
  },

  theme: {
    light: "Light",
    dark: "Dark",
  },

  language: {
    uz: "UZ",
    en: "EN",
    ru: "RU",
  },
};
