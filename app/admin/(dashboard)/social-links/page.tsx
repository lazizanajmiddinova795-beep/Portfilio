import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import SocialLinksClient from "./SocialLinksClient";

export default async function SocialLinksPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const links = await prisma.socialLink.findMany({
    where: { deletedAt: null },
    orderBy: { order: "asc" },
  });

  return <SocialLinksClient links={links} />;
}