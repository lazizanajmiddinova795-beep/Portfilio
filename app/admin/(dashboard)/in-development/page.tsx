import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import InDevClient from "./InDevClient";

export default async function InDevelopmentPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const items = await prisma.inDevelopment.findMany({
    where: { deletedAt: null },
    orderBy: { order: "asc" },
  });

  return <InDevClient items={items} />;
}