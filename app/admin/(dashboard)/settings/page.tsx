import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import AccountSettingsClient from "./AccountSettingsClient";

export const metadata = {
  title: "Account Settings | Portfolio CMS",
  description: "Manage your admin account email and password.",
};

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  // Guard: redirect unauthenticated users to login
  if (!session?.user?.email) {
    redirect("/admin/login");
  }

  return <AccountSettingsClient currentEmail={session.user.email} />;
}