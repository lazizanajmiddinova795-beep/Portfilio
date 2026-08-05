export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="h-9 w-64 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
        <div className="h-5 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg mt-3"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-md rounded-2xl p-6 border border-white/20 dark:border-gray-800/50 h-[104px]"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded"></div>
                <div className="h-8 w-16 bg-gray-200 dark:bg-gray-800 rounded"></div>
              </div>
              <div className="h-14 w-14 rounded-xl bg-gray-200 dark:bg-gray-800"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-md rounded-2xl p-8 border border-white/20 dark:border-gray-800/50 min-h-[400px] mt-8">
        <div className="h-full w-full bg-gray-200/50 dark:bg-gray-800/50 rounded-xl"></div>
      </div>
    </div>
  );
}
