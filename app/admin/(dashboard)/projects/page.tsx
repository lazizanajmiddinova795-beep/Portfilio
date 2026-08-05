import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import ProjectsClient from "./ProjectsClient";

export const metadata = {
  title: "Projects | Portfolio CMS",
};

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const projects = await prisma.project.findMany({
    where: { deletedAt: null },
    orderBy: { order: "asc" },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <ProjectsClient projects={projects as any} />;
}