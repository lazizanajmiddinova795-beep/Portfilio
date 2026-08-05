"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumbs() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);

  return (
    <nav className="flex text-sm text-gray-500 dark:text-gray-400 mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link
            href="/admin"
            className="inline-flex items-center hover:text-green-600 dark:hover:text-green-400 transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Admin
          </Link>
        </li>
        {paths.map((path, index) => {
          if (path === "admin") return null;
          
          const href = `/${paths.slice(0, index + 1).join("/")}`;
          const isLast = index === paths.length - 1;
          const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");

          return (
            <li key={path}>
              <div className="flex items-center">
                <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
                {isLast ? (
                  <span className="ml-1 font-medium text-gray-900 dark:text-gray-100" aria-current="page">
                    {label}
                  </span>
                ) : (
                  <Link
                    href={href}
                    className="ml-1 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                  >
                    {label}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
