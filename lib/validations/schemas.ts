import { z } from "zod";

// ── Auth ───────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(1, "Password required"),
});

// ── Account Settings ──────────────────────────────────────────────────────────

export const changeEmailSchema = z.object({
  newEmail: z.string().email("Valid email required"),
  currentPassword: z.string().min(1, "Current password required"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password required"),
    newPassword: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "At least one uppercase letter")
      .regex(/[0-9]/, "At least one number"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ── Profile ───────────────────────────────────────────────────────────────────

export const profileSchema = z.object({
  name: z.string().min(1, "Required"),
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  age: z.coerce.number().int().positive().optional(),
  location: z.string().optional(),
  team: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  telegram: z.string().optional(),
  telegramUrl: z.string().url().optional().or(z.literal("")),
  phone: z.string().optional(),
  phoneUrl: z.string().optional(),
  avatarUrl: z.string().url().optional().or(z.literal("")),
  cvUrl: z.string().url().optional().or(z.literal("")),
  roles: z.object({
    en: z.array(z.string()),
    uz: z.array(z.string()),
    ru: z.array(z.string()),
  }),
});

// ── About ─────────────────────────────────────────────────────────────────────

export const aboutSchema = z.object({
  content: z.object({
    en: z.string().min(1, "English content required"),
    uz: z.string().optional().default(""),
    ru: z.string().optional().default(""),
  }),
  highlights: z
    .array(
      z.object({
        icon: z.string(),
        en: z.string(),
        uz: z.string().optional().default(""),
        ru: z.string().optional().default(""),
      })
    )
    .optional()
    .default([]),
  imageUrl: z.string().url().optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
});

// ── Skill ─────────────────────────────────────────────────────────────────────

export const skillSchema = z.object({
  name: z.string().min(1, "Required"),
  level: z.coerce.number().int().min(0).max(100),
  category: z.enum(["frontend", "backend", "database", "tools", "ai"]),
  icon: z.string().optional(),
  order: z.coerce.number().int().default(0),
});

// ── Tech Stack ────────────────────────────────────────────────────────────────

export const techStackSchema = z.object({
  name: z.string().min(1, "Required"),
  icon: z.string().optional(),
  category: z.string().optional(),
  order: z.coerce.number().int().default(0),
});

// ── Project ───────────────────────────────────────────────────────────────────

const langContentSchema = z.object({
  tagline: z.string().optional().default(""),
  description: z.string().optional().default(""),
  features: z.array(z.string()).optional().default([]),
});

export const projectSchema = z.object({
  name: z.string().min(1, "Required"),
  slug: z.string().min(1, "Required").regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, hyphens"),
  gradient: z.string().optional(),
  i18n: z.object({
    en: langContentSchema,
    uz: langContentSchema,
    ru: langContentSchema,
  }),
  liveUrl: z.string().url().optional().or(z.literal("")),
  githubUrl: z.string().url().optional().or(z.literal("")),
  imageUrl: z.string().url().optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  featured: z.boolean().default(false),
  order: z.coerce.number().int().default(0),
});

// ── Service ───────────────────────────────────────────────────────────────────

const serviceLangSchema = z.object({
  title: z.string().optional().default(""),
  description: z.string().optional().default(""),
});

export const serviceSchema = z.object({
  slug: z.string().min(1, "Required").regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, hyphens"),
  icon: z.string().optional(),
  i18n: z.object({
    en: serviceLangSchema,
    uz: serviceLangSchema,
    ru: serviceLangSchema,
  }),
  price: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  order: z.coerce.number().int().default(0),
});

// ── In Development ────────────────────────────────────────────────────────────

const inDevLangSchema = z.object({
  title: z.string().optional().default(""),
  description: z.string().optional().default(""),
});

export const inDevSchema = z.object({
  slug: z.string().min(1, "Required").regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, hyphens"),
  icon: z.string().optional(),
  i18n: z.object({
    en: inDevLangSchema,
    uz: inDevLangSchema,
    ru: inDevLangSchema,
  }),
  tags: z.array(z.string()).optional().default([]),
  progress: z.coerce.number().int().min(0).max(100).default(0),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  order: z.coerce.number().int().default(0),
});

// ── Social Link ───────────────────────────────────────────────────────────────

export const socialLinkSchema = z.object({
  platform: z.string().min(1, "Required"),
  url: z.string().url("Valid URL required"),
  icon: z.string().optional(),
  label: z.string().optional(),
  order: z.coerce.number().int().default(0),
});

// ── SEO ───────────────────────────────────────────────────────────────────────

export const seoSchema = z.object({
  title: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  keywords: z.array(z.string()).optional().default([]),
  ogImageUrl: z.string().url().optional().or(z.literal("")),
  twitterHandle: z.string().optional(),
  canonicalUrl: z.string().url().optional().or(z.literal("")),
  robots: z.string().default("index, follow"),
  faviconUrl: z.string().url().optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
});

// ── Types ─────────────────────────────────────────────────────────────────────

export type LoginInput = z.infer<typeof loginSchema>;
export type ChangeEmailInput = z.infer<typeof changeEmailSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type AboutInput = z.infer<typeof aboutSchema>;
export type SkillInput = z.infer<typeof skillSchema>;
export type TechStackInput = z.infer<typeof techStackSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type InDevInput = z.infer<typeof inDevSchema>;
export type SocialLinkInput = z.infer<typeof socialLinkSchema>;
export type SEOInput = z.infer<typeof seoSchema>;
