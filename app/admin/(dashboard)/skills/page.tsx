import { prisma } from "@/lib/prisma";
import { SkillsClient } from "./SkillsClient";

export const metadata = {
  title: "Skills | Portfolio CMS",
};

export default async function SkillsPage() {
  const skills = await prisma.skill.findMany({
    where: { deletedAt: null },
    orderBy: { order: "asc" },
  });

  return <SkillsClient skills={skills} />;
}