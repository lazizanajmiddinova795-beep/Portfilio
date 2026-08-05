"use client";

import { Search, Bell, Menu } from "lucide-react";
import { UserMenu } from "@/components/admin/ui/UserMenu";
import { Breadcrumbs } from "@/components/admin/ui/Breadcrumbs";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#f0fdf4]/80 dark:bg-[#0a0f0a]/80 backdrop-blur-xl border-b border-green-200/50 dark:border-green-900/20">
      <div className="flex flex-col px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center flex-1">
            <button
              onClick={onMenuClick}
              className="p-2 -ml-2 mr-2 text-gray-500 hover:text-green-600 lg:hidden rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="hidden sm:flex max-w-md w-full relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search anything..."
                className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-xl bg-white/50 dark:bg-gray-900/50 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:bg-white dark:focus:bg-gray-900 shadow-inner transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-500 hover:text-green-600 dark:hover:text-green-400 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>
            <div className="h-8 w-px bg-gray-200 dark:bg-gray-800"></div>
            <UserMenu />
          </div>
        </div>
        
        {/* Mobile Search */}
        <div className="sm:hidden mb-4 relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-green-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-xl bg-white/50 dark:bg-gray-900/50 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 shadow-inner transition-all duration-200"
          />
        </div>

        <Breadcrumbs />
      </div>
    </header>
  );
}
