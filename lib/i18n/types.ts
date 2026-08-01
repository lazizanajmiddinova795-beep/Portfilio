/**
 * TRANSLATIONS INTERFACE
 * ──────────────────────
 * Defines the shape of all translation objects.
 * Imported by en.ts, uz.ts, ru.ts to enforce type safety.
 * Content-heavy fields delegate to types from content/.
 */
import type { ProjectLang } from "@/content/projects";
import type { ProjectInDevLang } from "@/content/projectsInDev";
import type { ServiceLang } from "@/content/services";
import type { LearningItemLang } from "@/content/learning";

export interface Translations {
  nav: {
    home: string;
    about: string;
    skills: string;
    techStack: string;
    projects: string;
    learning: string;
    services: string;
    contact: string;
  };
  hero: {
    greeting: string;
    name: string;
    roles: readonly string[];
    tagline: string;
    cta: {
      projects: string;
      contact: string;
    };
    scrollHint: string;
  };
  about: {
    badge: string;
    title: string;
    p1: string;
    p2: string;
    p3: string;
    stats: {
      projects: string;
      technologies: string;
      team: string;
      age: string;
    };
    location: string;
    team: string;
    available: string;
  };
  skills: {
    badge: string;
    title: string;
    subtitle: string;
    categories: {
      frontend: string;
      backend: string;
      database: string;
      tools: string;
      ai: string;
    };
  };
  techStack: {
    badge: string;
    title: string;
    subtitle: string;
  };
  projects: {
    badge: string;
    title: string;
    subtitle: string;
    viewDetails: string;
    features: string;
    vrestro: ProjectLang & { name: string; gradient: string; id: string };
    gymMaster: ProjectLang & { name: string; gradient: string; id: string };
  };
  projectsInDev: {
    badge: string;
    title: string;
    subtitle: string;
    status: string;
    projects: ReadonlyArray<
      ProjectInDevLang & { id: string; icon: string; progress: number }
    >;
  };
  learning: {
    badge: string;
    title: string;
    subtitle: string;
    current: string;
    items: ReadonlyArray<LearningItemLang & { id: string }>;
  };
  services: {
    badge: string;
    title: string;
    subtitle: string;
    items: ReadonlyArray<ServiceLang & { id: string; icon: string }>;
  };
  contact: {
    badge: string;
    title: string;
    subtitle: string;
    form: {
      name: string;
      email: string;
      subject: string;
      message: string;
      send: string;
      sending: string;
      success: string;
      error: string;
    };
    info: {
      email: string;
      telegram: string;
      phone: string;
      location: string;
    };
  };
  footer: {
    tagline: string;
    rights: string;
    builtWith: string;
    and: string;
    passion: string;
  };
  theme: {
    light: string;
    dark: string;
  };
  language: {
    uz: string;
    en: string;
    ru: string;
  };
}
