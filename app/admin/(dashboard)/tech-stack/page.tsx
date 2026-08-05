import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import TechStackClient from "./TechStackClient";

export default async function TechStackPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const items = await prisma.techStack.findMany({
    where: { deletedAt: null },
    orderBy: { order: "asc" },
  });

  return <TechStackClient items={items} />;
}