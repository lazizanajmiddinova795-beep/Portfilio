# Laziza Najmiddinova — Portfolio

A world-class personal portfolio built with Next.js 16, React 19, TypeScript, TailwindCSS v4, and Framer Motion v12.

---

## ✏️ How to Edit Your Portfolio Content

All editable content lives in the **`content/`** directory.  
You **never need to touch any component files** to update your information.

```
content/
├── profile.ts       → Your name, contact info, location, SEO metadata
├── about.ts         → Biography paragraphs (EN / UZ / RU)
├── skills.ts        → Skills with proficiency levels (0–100)
├── techStack.ts     → Technologies shown in the Tech Stack grid
├── projects.ts      → Featured projects (VRestro, GymMaster, ...)
├── projectsInDev.ts → In-development projects with progress %
├── services.ts      → Services you offer
├── learning.ts      → Learning journey timeline items
└── index.ts         → Barrel export (don't edit)
```

### Examples

**Change your email:**
```ts
// content/profile.ts
contact: {
  email: "your-new-email@gmail.com",
  ...
}
```

**Add a new skill:**
```ts
// content/skills.ts
{ name: "Rust", level: 45, category: "backend" },
```

**Add a new project:**
```ts
// content/projects.ts
{
  id: "my-new-project",
  name: "My Project",
  gradient: "from-blue-500 to-purple-500",
  en: { tagline: "...", description: "...", features: [...] },
  uz: { tagline: "...", description: "...", features: [...] },
  ru: { tagline: "...", description: "...", features: [...] },
}
```

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

**Dev server:** http://localhost:3000

---

## 🏗️ Architecture

```
app/              → Next.js App Router pages + layout
components/
  effects/        → LoadingScreen, CustomCursor, AuroraBackground, etc.
  layout/         → Navbar, Footer
  providers/      → ThemeProvider, I18nProvider
  sections/       → Hero, About, Skills, TechStack, Projects, ...
content/          → ✏️ All editable content (edit these files)
hooks/            → useTypingEffect, useAnimatedCounter
lib/
  i18n/           → Translation files (import from content/)
    en.ts         → English UI strings
    uz.ts         → Uzbek UI strings
    ru.ts         → Russian UI strings
    types.ts      → TypeScript interface for translations
```

---

## 🌐 Internationalization

The portfolio supports **3 languages**: English, Uzbek, Russian.

- Language is saved in `localStorage` and restored on next visit.
- UI strings (nav, buttons) live in `lib/i18n/*.ts`.
- Content strings (bio, descriptions) live in `content/*.ts`.

---

Built with ❤️ by Laziza Najmiddinova
