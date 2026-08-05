export interface DashboardStats {
  totalVisits: string;
  activeProjects: string;
  newMessages: string;
  totalClients: string;
}

export const DashboardService = {
  /**
   * Fetches the key statistics for the dashboard.
   * In Phase 2, this will be replaced with actual database queries via Prisma.
   */
  async getStatistics(): Promise<DashboardStats> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Return mock data for Phase 1
    return {
      totalVisits: "1,234",
      activeProjects: "5",
      newMessages: "12",
      totalClients: "48",
    };
  },
};
