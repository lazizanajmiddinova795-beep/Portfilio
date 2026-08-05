import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import ServicesClient from "./ServicesClient";

export default async function ServicesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const services = await prisma.service.findMany({
    where: { deletedAt: null },
    orderBy: { order: "asc" },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <ServicesClient services={services as any} />;
}