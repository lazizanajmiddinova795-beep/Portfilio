"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  MessageSquare, 
  FolderKanban, 
  Settings, 
  LogOut,
  User,
  Info,
  Code2,
  Layers,
  Briefcase,
  Wrench,
  Link as LinkIcon,
  Image as ImageIcon,
  Search,
  X
} from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Profile", href: "/admin/profile", icon: User },
  { name: "About", href: "/admin/about", icon: Info },
  { name: "Skills", href: "/admin/skills", icon: Code2 },
  { name: "Tech Stack", href: "/admin/tech-stack", icon: Layers },
  { name: "Projects", href: "/admin/projects", icon: FolderKanban },
  { name: "Services", href: "/admin/services", icon: Briefcase },
  { name: "In Development", href: "/admin/in-development", icon: Wrench },
  { name: "Contact", href: "/admin/contact", icon: MessageSquare },
  { name: "Social Links", href: "/admin/social-links", icon: LinkIcon },
  { name: "Media Library", href: "/admin/media", icon: ImageIcon },
  { name: "SEO", href: "/admin/seo", icon: Search },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed lg:fixed left-0 top-0 h-screen bg-[#f0fdf4] dark:bg-[#0a0f0a] border-r border-green-200/50 dark:border-green-900/20 flex flex-col w-64 z-50 transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="p-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400">
          Portfolio CMS
        </h2>
        <button 
          onClick={() => setIsOpen(false)}
          className="lg:hidden p-2 text-gray-500 hover:text-green-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-green-200 dark:scrollbar-thumb-gray-800">
        <nav className="px-4 pb-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 relative group ${
                  isActive
                    ? "text-green-700 dark:text-green-300"
                    : "text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 bg-green-100 dark:bg-green-900/30 rounded-xl shadow-inner"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={`h-5 w-5 mr-3 relative z-10 ${isActive ? "text-green-600 dark:text-green-400" : ""}`} />
                <span className="relative z-10 font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-green-200/50 dark:border-green-900/20 bg-[#f0fdf4] dark:bg-[#0a0f0a]">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200"
        >
          <LogOut className="h-5 w-5 mr-3" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
