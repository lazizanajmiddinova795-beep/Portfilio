"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import {
  changeEmailSchema,
  changePasswordSchema,
  profileSchema,
  aboutSchema,
  skillSchema,
  techStackSchema,
  projectSchema,
  serviceSchema,
  inDevSchema,
  socialLinkSchema,
  seoSchema,
} from "@/lib/validations/schemas";
import type {
  ChangeEmailInput,
  ChangePasswordInput,
  ProfileInput,
  AboutInput,
  SkillInput,
  TechStackInput,
  ProjectInput,
  ServiceInput,
  InDevInput,
  SocialLinkInput,
  SEOInput,
} from "@/lib/validations/schemas";

// ── Helpers ───────────────────────────────────────────────────────────────────

type ActionResult<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string };

async function getAdminUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");
  return session.user.email;
}

// ── Account Settings ──────────────────────────────────────────────────────────

export async function changeEmailAction(
  input: ChangeEmailInput
): Promise<ActionResult<{ email: string }>> {
  try {
    const email = await getAdminUser();
    const data = changeEmailSchema.parse(input);

    const user = await prisma.user.findFirst({
      where: { email, deletedAt: null },
    });
    if (!user) return { success: false, error: "User not found" };

    const valid = await bcrypt.compare(data.currentPassword, user.password);
    if (!valid) return { success: false, error: "Incorrect current password" };

    const existing = await prisma.user.findFirst({
      where: { email: data.newEmail, deletedAt: null },
    });
    if (existing) return { success: false, error: "Email already in use" };

    await prisma.user.update({
      where: { id: user.id },
      data: { email: data.newEmail, updatedBy: user.id },
    });

    return { success: true, data: { email: data.newEmail } };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

export async function changePasswordAction(
  input: ChangePasswordInput
): Promise<ActionResult> {
  try {
    const email = await getAdminUser();
    const data = changePasswordSchema.parse(input);

    const user = await prisma.user.findFirst({
      where: { email, deletedAt: null },
    });
    if (!user) return { success: false, error: "User not found" };

    const valid = await bcrypt.compare(data.currentPassword, user.password);
    if (!valid) return { success: false, error: "Incorrect current password" };

    const hashed = await bcrypt.hash(data.newPassword, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed, updatedBy: user.id },
    });

    return { success: true, data: null };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

// ── Profile ───────────────────────────────────────────────────────────────────

export async function saveProfileAction(input: ProfileInput): Promise<ActionResult> {
  try {
    const adminEmail = await getAdminUser();
    const data = profileSchema.parse(input);

    await prisma.profile.upsert({
      where: { id: "main-profile" },
      update: { ...data, updatedBy: adminEmail },
      create: { id: "main-profile", ...data, createdBy: adminEmail },
    });

    revalidatePath("/");
    revalidatePath("/admin/profile");
    return { success: true, data: null };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

// ── About ─────────────────────────────────────────────────────────────────────

export async function saveAboutAction(input: AboutInput): Promise<ActionResult> {
  try {
    const adminEmail = await getAdminUser();
    const data = aboutSchema.parse(input);

    await prisma.about.upsert({
      where: { slug: "main" },
      update: { ...data, updatedBy: adminEmail },
      create: { slug: "main", ...data, createdBy: adminEmail },
    });

    revalidatePath("/");
    revalidatePath("/admin/about");
    return { success: true, data: null };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

// ── Skills ────────────────────────────────────────────────────────────────────

export async function createSkillAction(input: SkillInput): Promise<ActionResult> {
  try {
    const adminEmail = await getAdminUser();
    const data = skillSchema.parse(input);
    const skill = await prisma.skill.create({ data: { ...data, createdBy: adminEmail } });
    revalidatePath("/");
    revalidatePath("/admin/skills");
    return { success: true, data: skill };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

export async function updateSkillAction(id: string, input: SkillInput): Promise<ActionResult> {
  try {
    const adminEmail = await getAdminUser();
    const data = skillSchema.parse(input);
    const skill = await prisma.skill.update({ where: { id }, data: { ...data, updatedBy: adminEmail } });
    revalidatePath("/");
    revalidatePath("/admin/skills");
    return { success: true, data: skill };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

export async function deleteSkillAction(id: string): Promise<ActionResult> {
  try {
    const adminEmail = await getAdminUser();
    await prisma.skill.update({ where: { id }, data: { deletedAt: new Date(), updatedBy: adminEmail } });
    revalidatePath("/");
    revalidatePath("/admin/skills");
    return { success: true, data: null };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

// ── Tech Stack ────────────────────────────────────────────────────────────────

export async function createTechStackAction(input: TechStackInput): Promise<ActionResult> {
  try {
    const adminEmail = await getAdminUser();
    const data = techStackSchema.parse(input);
    const item = await prisma.techStack.create({ data: { ...data, createdBy: adminEmail } });
    revalidatePath("/");
    revalidatePath("/admin/tech-stack");
    return { success: true, data: item };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

export async function updateTechStackAction(id: string, input: TechStackInput): Promise<ActionResult> {
  try {
    const adminEmail = await getAdminUser();
    const data = techStackSchema.parse(input);
    const item = await prisma.techStack.update({ where: { id }, data: { ...data, updatedBy: adminEmail } });
    revalidatePath("/");
    revalidatePath("/admin/tech-stack");
    return { success: true, data: item };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

export async function deleteTechStackAction(id: string): Promise<ActionResult> {
  try {
    const adminEmail = await getAdminUser();
    await prisma.techStack.update({ where: { id }, data: { deletedAt: new Date(), updatedBy: adminEmail } });
    revalidatePath("/");
    revalidatePath("/admin/tech-stack");
    return { success: true, data: null };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

// ── Projects ──────────────────────────────────────────────────────────────────

export async function createProjectAction(input: ProjectInput): Promise<ActionResult> {
  try {
    const adminEmail = await getAdminUser();
    const data = projectSchema.parse(input);
    const item = await prisma.project.create({ data: { ...data, createdBy: adminEmail } });
    revalidatePath("/");
    revalidatePath("/admin/projects");
    return { success: true, data: item };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

export async function updateProjectAction(id: string, input: ProjectInput): Promise<ActionResult> {
  try {
    const adminEmail = await getAdminUser();
    const data = projectSchema.parse(input);
    const item = await prisma.project.update({ where: { id }, data: { ...data, updatedBy: adminEmail } });
    revalidatePath("/");
    revalidatePath("/admin/projects");
    return { success: true, data: item };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

export async function deleteProjectAction(id: string): Promise<ActionResult> {
  try {
    const adminEmail = await getAdminUser();
    await prisma.project.update({ where: { id }, data: { deletedAt: new Date(), updatedBy: adminEmail } });
    revalidatePath("/");
    revalidatePath("/admin/projects");
    return { success: true, data: null };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

// ── Services ──────────────────────────────────────────────────────────────────

export async function createServiceAction(input: ServiceInput): Promise<ActionResult> {
  try {
    const adminEmail = await getAdminUser();
    const data = serviceSchema.parse(input);
    const item = await prisma.service.create({ data: { ...data, createdBy: adminEmail } });
    revalidatePath("/");
    revalidatePath("/admin/services");
    return { success: true, data: item };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

export async function updateServiceAction(id: string, input: ServiceInput): Promise<ActionResult> {
  try {
    const adminEmail = await getAdminUser();
    const data = serviceSchema.parse(input);
    const item = await prisma.service.update({ where: { id }, data: { ...data, updatedBy: adminEmail } });
    revalidatePath("/");
    revalidatePath("/admin/services");
    return { success: true, data: item };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

export async function deleteServiceAction(id: string): Promise<ActionResult> {
  try {
    const adminEmail = await getAdminUser();
    await prisma.service.update({ where: { id }, data: { deletedAt: new Date(), updatedBy: adminEmail } });
    revalidatePath("/");
    revalidatePath("/admin/services");
    return { success: true, data: null };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

// ── In Development ────────────────────────────────────────────────────────────

export async function createInDevAction(input: InDevInput): Promise<ActionResult> {
  try {
    const adminEmail = await getAdminUser();
    const data = inDevSchema.parse(input);
    const item = await prisma.inDevelopment.create({ data: { ...data, createdBy: adminEmail } });
    revalidatePath("/");
    revalidatePath("/admin/in-development");
    return { success: true, data: item };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

export async function updateInDevAction(id: string, input: InDevInput): Promise<ActionResult> {
  try {
    const adminEmail = await getAdminUser();
    const data = inDevSchema.parse(input);
    const item = await prisma.inDevelopment.update({ where: { id }, data: { ...data, updatedBy: adminEmail } });
    revalidatePath("/");
    revalidatePath("/admin/in-development");
    return { success: true, data: item };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

export async function deleteInDevAction(id: string): Promise<ActionResult> {
  try {
    const adminEmail = await getAdminUser();
    await prisma.inDevelopment.update({ where: { id }, data: { deletedAt: new Date(), updatedBy: adminEmail } });
    revalidatePath("/");
    revalidatePath("/admin/in-development");
    return { success: true, data: null };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

// ── Social Links ──────────────────────────────────────────────────────────────

export async function createSocialLinkAction(input: SocialLinkInput): Promise<ActionResult> {
  try {
    const adminEmail = await getAdminUser();
    const data = socialLinkSchema.parse(input);
    const item = await prisma.socialLink.create({ data: { ...data, createdBy: adminEmail } });
    revalidatePath("/");
    revalidatePath("/admin/social-links");
    return { success: true, data: item };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

export async function updateSocialLinkAction(id: string, input: SocialLinkInput): Promise<ActionResult> {
  try {
    const adminEmail = await getAdminUser();
    const data = socialLinkSchema.parse(input);
    const item = await prisma.socialLink.update({ where: { id }, data: { ...data, updatedBy: adminEmail } });
    revalidatePath("/");
    revalidatePath("/admin/social-links");
    return { success: true, data: item };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

export async function deleteSocialLinkAction(id: string): Promise<ActionResult> {
  try {
    const adminEmail = await getAdminUser();
    await prisma.socialLink.update({ where: { id }, data: { deletedAt: new Date(), updatedBy: adminEmail } });
    revalidatePath("/");
    revalidatePath("/admin/social-links");
    return { success: true, data: null };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

// ── SEO ───────────────────────────────────────────────────────────────────────

export async function saveSEOAction(input: SEOInput): Promise<ActionResult> {
  try {
    const adminEmail = await getAdminUser();
    const data = seoSchema.parse(input);

    await prisma.sEO.upsert({
      where: { slug: "main" },
      update: { ...data, updatedBy: adminEmail },
      create: { slug: "main", ...data, createdBy: adminEmail },
    });

    revalidatePath("/");
    revalidatePath("/admin/seo");
    return { success: true, data: null };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed" };
  }
}

// ── Media ─────────────────────────────────────────────────────────────────────

export async function deleteMediumAction(id: string): Promise<ActionResult> {
  try {
    const adminEmail = await getAdminUser();
    await prisma.media.update({
      where: { id },
      data: { deletedAt: new Date(), updatedBy: adminEmail },
    });
    revalidatePath("/admin/media");
    return { success: true, data: null };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : "Failed" };
  }
}
