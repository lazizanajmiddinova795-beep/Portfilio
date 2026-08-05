"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";

export interface Column<T> {
  header: string;
  accessorKey: keyof T;
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  onEdit,
  onDelete,
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: "asc" | "desc" } | null>(null);

  const handleSort = (key: keyof T) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig) return 0;
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="w-full bg-white/50 dark:bg-gray-900/50 backdrop-blur-md rounded-2xl shadow-[10px_10px_30px_#d1d9e6,-10px_-10px_30px_#ffffff] dark:shadow-[5px_5px_20px_#050805,-5px_-5px_20px_#0f160f] border border-white/20 dark:border-gray-800/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.header}
                  onClick={() => handleSort(col.accessorKey)}
                  className="px-6 py-4 font-semibold text-gray-900 dark:text-gray-100 cursor-pointer hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors select-none"
                >
                  <div className="flex items-center space-x-1">
                    <span>{col.header}</span>
                    <span className="flex flex-col text-gray-400">
                      <ChevronUp className={`w-3 h-3 ${sortConfig?.key === col.accessorKey && sortConfig.direction === "asc" ? "text-green-500" : ""}`} />
                      <ChevronDown className={`w-3 h-3 -mt-1 ${sortConfig?.key === col.accessorKey && sortConfig.direction === "desc" ? "text-green-500" : ""}`} />
                    </span>
                  </div>
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-6 py-4 font-semibold text-right text-gray-900 dark:text-gray-100">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {sortedData.length > 0 ? (
              sortedData.map((item, i) => (
                <motion.tr
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={item.id}
                  className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  {columns.map((col) => (
                    <td key={`${item.id}-${String(col.accessorKey)}`} className="px-6 py-4 text-gray-600 dark:text-gray-300">
                      {col.cell ? col.cell(item) : String(item[col.accessorKey] || "")}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-6 py-4 text-right space-x-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(item)}
                          className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  )}
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="px-6 py-12 text-center text-gray-500">
                  No data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Placeholder */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-sm text-gray-500">
        <span>Showing 1 to {sortedData.length} of {sortedData.length} entries</span>
        <div className="flex space-x-2">
          <button className="px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50" disabled>Previous</button>
          <button className="px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50" disabled>Next</button>
        </div>
      </div>
    </div>
  );
}
