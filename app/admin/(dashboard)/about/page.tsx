import { prisma } from "@/lib/prisma";
import { AboutClient } from "./AboutClient";

export const metadata = {
  title: "About | Portfolio CMS",
};

export default async function AboutPage() {
  const about = await prisma.about.findUnique({
    where: { slug: "main" },
  });

  return <AboutClient about={about} />;
}