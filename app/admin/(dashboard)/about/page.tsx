import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { AboutClient } from "./AboutClient";

export const metadata = {
  title: "About | Portfolio CMS",
};

export default async function AboutPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const raw = await prisma.about.findUnique({
    where: { slug: "main" },
  });

  // Cast Prisma JsonValue to the expected types via unknown to satisfy TS
  const about = raw
    ? {
        ...raw,
        status: raw.status as "DRAFT" | "PUBLISHED",
        content: raw.content as unknown as { en?: string; uz?: string; ru?: string } | null,
        highlights: raw.highlights as unknown as Array<{ icon: string; en: string; uz: string; ru: string }> | null,
      }
    : null;

  return <AboutClient about={about} />;
}