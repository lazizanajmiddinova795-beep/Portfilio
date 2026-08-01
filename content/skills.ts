/**
 * SKILLS CONTENT
 * ──────────────
 * Edit this file to add, remove, or update skill levels.
 * - name: displayed skill name
 * - level: 0–100 (percentage)
 * - category: groups skills into cards
 *
 * Categories: "frontend" | "backend" | "database" | "tools" | "ai"
 */

export interface Skill {
  name: string;
  level: number;
  category: "frontend" | "backend" | "database" | "tools" | "ai";
}

export const skills: Skill[] = [
  // ── Frontend ─────────────────────────────────────────────────
  { name: "React / Next.js",  level: 90, category: "frontend" },
  { name: "TypeScript",       level: 85, category: "frontend" },
  { name: "TailwindCSS",      level: 92, category: "frontend" },
  { name: "Framer Motion",    level: 80, category: "frontend" },

  // ── Backend ──────────────────────────────────────────────────
  { name: "Node.js / Express", level: 82, category: "backend" },
  { name: "NestJS",            level: 65, category: "backend" },
  { name: "REST APIs",         level: 88, category: "backend" },

  // ── Database ─────────────────────────────────────────────────
  { name: "PostgreSQL", level: 78, category: "database" },
  { name: "MongoDB",    level: 75, category: "database" },
  { name: "Prisma ORM", level: 80, category: "database" },

  // ── Tools & DevOps ───────────────────────────────────────────
  { name: "Git / GitHub", level: 90, category: "tools" },
  { name: "Docker",       level: 60, category: "tools" },

  // ── AI & ML ──────────────────────────────────────────────────
  { name: "AI Integration",    level: 72, category: "ai" },
  { name: "Prompt Engineering", level: 80, category: "ai" },
];
