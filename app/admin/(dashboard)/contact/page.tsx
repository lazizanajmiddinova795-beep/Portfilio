import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function getTelegramStatus() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return { ok: false, name: null };
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/getMe`, {
      next: { revalidate: 60 },
    });
    const data = await res.json();
    return { ok: data.ok, name: data.result?.username || data.result?.first_name };
  } catch {
    return { ok: false, name: null };
  }
}

export default async function ContactPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const telegram = await getTelegramStatus();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Contact</h1>
        <p className="text-gray-500 text-sm mt-1">Contact form messages are sent directly to your Telegram bot</p>
      </div>

      {/* Telegram Status Card */}
      <div className="p-8 rounded-3xl bg-[#e8f0e8] shadow-[8px_8px_16px_#c8d8c8,-8px_-8px_16px_#ffffff] max-w-md">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-[4px_4px_8px_#c8d8c8,-4px_-4px_8px_#ffffff]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.69 7.96c-.12.58-.47.72-.95.45l-2.62-1.93-1.27 1.22c-.14.14-.26.26-.53.26l.19-2.72 4.93-4.46c.21-.19-.05-.3-.33-.11l-6.1 3.84-2.63-.82c-.57-.18-.58-.57.12-.84l10.26-3.96c.47-.17.88.12.72.11z"/>
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Telegram Bot</h2>
            {telegram.name && <p className="text-gray-500 text-sm">@{telegram.name}</p>}
          </div>
        </div>

        <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl ${telegram.ok ? "bg-green-50" : "bg-red-50"}`}>
          <span className={`relative flex h-3 w-3`}>
            {telegram.ok && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            )}
            <span className={`relative inline-flex rounded-full h-3 w-3 ${telegram.ok ? "bg-green-500" : "bg-red-500"}`} />
          </span>
          <span className={`font-semibold text-sm ${telegram.ok ? "text-green-700" : "text-red-600"}`}>
            {telegram.ok ? "🟢 Connected" : "🔴 Disconnected"}
          </span>
        </div>

        <div className="mt-6 space-y-3">
          <p className="text-sm text-gray-500">
            When visitors submit the contact form on your portfolio, messages are sent directly to your Telegram chat.
          </p>
          <div className="text-sm font-medium text-gray-600 space-y-1">
            <p>✅ No message storage in database</p>
            <p>✅ Real-time notifications via Telegram</p>
            <p>✅ Secure via bot token</p>
          </div>
        </div>
      </div>
    </div>
  );
}