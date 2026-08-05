import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import SEOClient from "./SEOClient";

export default async function SEOPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const seo = await prisma.sEO.findUnique({ where: { slug: "main" } });

  return <SEOClient seo={seo} />;
}