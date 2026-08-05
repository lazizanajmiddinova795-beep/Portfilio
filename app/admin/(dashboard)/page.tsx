import { DashboardService } from "@/services/dashboard.service";
import { DashboardCards } from "@/components/admin/DashboardCards";

export default async function AdminDashboard() {
  const stats = await DashboardService.getStatistics();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      <DashboardCards stats={stats} />
    </div>
  );
}
