import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import MediaClient from "./MediaClient";

export const metadata = {
  title: "Media Library | Portfolio CMS",
};

export default async function MediaPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const mediaItems = await prisma.media.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
  });

  return <MediaClient mediaItems={mediaItems} />;
}