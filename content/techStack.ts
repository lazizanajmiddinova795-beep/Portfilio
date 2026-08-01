/**
 * TECH STACK CONTENT
 * ──────────────────
 * Edit this file to add or remove technologies from the Tech Stack section.
 * - name: display name
 * - icon: emoji or short abbreviation shown in the card
 * - color: hex color for the icon background tint and glow
 * - category: label shown below the icon
 */

export interface TechItem {
  name: string;
  icon: string;
  color: string;
  category: string;
}

export const techStack: TechItem[] = [
  // ── Frontend ─────────────────────────────────────────────────
  { name: "Next.js",      icon: "▲",  color: "#000000", category: "Frontend" },
  { name: "React",        icon: "⚛",  color: "#61DAFB", category: "Frontend" },
  { name: "TypeScript",   icon: "TS", color: "#3178C6", category: "Frontend" },
  { name: "TailwindCSS",  icon: "TW", color: "#06B6D4", category: "Frontend" },
  { name: "Framer Motion",icon: "FM", color: "#BB4B96", category: "Frontend" },

  // ── Backend ──────────────────────────────────────────────────
  { name: "Node.js",   icon: "⬡",  color: "#339933", category: "Backend" },
  { name: "NestJS",    icon: "🐈", color: "#E0234E", category: "Backend" },
  { name: "Express",   icon: "EX", color: "#404040", category: "Backend" },

  // ── Database ─────────────────────────────────────────────────
  { name: "PostgreSQL", icon: "🐘", color: "#336791", category: "Database" },
  { name: "MongoDB",    icon: "🍃", color: "#47A248", category: "Database" },
  { name: "Prisma",     icon: "◆",  color: "#2D3748", category: "Database" },
  { name: "Redis",      icon: "⬡",  color: "#DC382D", category: "Database" },

  // ── Tools ────────────────────────────────────────────────────
  { name: "Git",    icon: "⎇",  color: "#F05032", category: "Tools" },
  { name: "Docker", icon: "🐳", color: "#2496ED", category: "Tools" },
  { name: "Vercel", icon: "▲",  color: "#000000", category: "Tools" },

  // ── Design ───────────────────────────────────────────────────
  { name: "Figma", icon: "◈", color: "#F24E1E", category: "Design" },
];
