import { prisma } from "@/lib/prisma";
import { ProfileClient } from "./ProfileClient";
import type { Profile } from "@/lib/generated/prisma";

export const metadata = {
  title: "Profile | Portfolio CMS",
};

export default async function ProfilePage() {
  let profile: Profile | null = null;

  try {
    profile = await prisma.profile.findUnique({
      where: { id: "main-profile" },
    });
  } catch (error) {
    console.error("[ProfilePage] Failed to fetch profile:", error);
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: "var(--neu-bg, #e8f0e8)",
          boxShadow:
            "8px 8px 16px var(--neu-shadow-dark, #c8d8c8), -8px -8px 16px var(--neu-shadow-light, #ffffff)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              boxShadow: "4px 4px 8px #c8d8c8, -2px -2px 6px #ffffff",
            }}
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Profile Editor</h1>
            <p className="text-sm text-gray-500">
              Manage your personal info, contact details, roles &amp; media
            </p>
          </div>
        </div>
      </div>

      {/* Client Component */}
      <ProfileClient profile={profile} />
    </div>
  );
}