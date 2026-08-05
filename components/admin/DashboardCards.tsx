"use client";

import { motion } from "framer-motion";
import { Users, Eye, FolderKanban, MessageSquare } from "lucide-react";
import type { DashboardStats } from "@/services/dashboard.service";

interface DashboardCardsProps {
  stats: DashboardStats;
}

export function DashboardCards({ stats }: DashboardCardsProps) {
  const statItems = [
    { name: "Total Visits", value: stats.totalVisits, icon: Eye, color: "text-blue-500" },
    { name: "Active Projects", value: stats.activeProjects, icon: FolderKanban, color: "text-emerald-500" },
    { name: "New Messages", value: stats.newMessages, icon: MessageSquare, color: "text-amber-500" },
    { name: "Total Clients", value: stats.totalClients, icon: Users, color: "text-purple-500" },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statItems.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-md rounded-2xl p-6 shadow-[10px_10px_30px_#d1d9e6,-10px_-10px_30px_#ffffff] dark:shadow-[5px_5px_20px_#050805,-5px_-5px_20px_#0f160f] border border-white/20 dark:border-gray-800/50"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.name}
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className={`p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 shadow-inner ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-md rounded-2xl p-8 shadow-[10px_10px_30px_#d1d9e6,-10px_-10px_30px_#ffffff] dark:shadow-[5px_5px_20px_#050805,-5px_-5px_20px_#0f160f] border border-white/20 dark:border-gray-800/50 min-h-[400px] flex items-center justify-center mt-8"
      >
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          Detailed analytics and recent activity will appear here in Phase 2.
        </p>
      </motion.div>
    </>
  );
}
