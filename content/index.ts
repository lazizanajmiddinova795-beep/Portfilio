/**
 * CONTENT BARREL EXPORT
 * ─────────────────────
 * Import everything from a single entry point:
 *
 *   import { profile, skills, techStack, projects } from "@/content";
 *
 * To edit portfolio content, modify only the files in this directory:
 *   - profile.ts       → personal info, contact, SEO
 *   - about.ts         → bio paragraphs (all 3 languages)
 *   - skills.ts        → skills with proficiency levels
 *   - techStack.ts     → technologies shown in Tech Stack grid
 *   - projects.ts      → featured projects (VRestro, GymMaster, …)
 *   - projectsInDev.ts → in-development projects
 *   - services.ts      → offered services
 *   - learning.ts      → learning journey timeline items
 */

export { profile } from "./profile";
export type { Profile } from "./profile";

export { about } from "./about";
export type { AboutLang } from "./about";

export { skills } from "./skills";
export type { Skill } from "./skills";

export { techStack } from "./techStack";
export type { TechItem } from "./techStack";

export { projects, getProjectsForLang } from "./projects";
export type { Project, ProjectLang } from "./projects";

export { projectsInDev, getProjectsInDevForLang } from "./projectsInDev";
export type { ProjectInDev, ProjectInDevLang } from "./projectsInDev";

export { services, getServicesForLang } from "./services";
export type { Service, ServiceLang } from "./services";

export { learningItems, getLearningForLang } from "./learning";
export type { LearningItem, LearningItemLang } from "./learning";
