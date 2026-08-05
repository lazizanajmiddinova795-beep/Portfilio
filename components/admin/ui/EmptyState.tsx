"use client";

import { motion } from "framer-motion";
import { FolderOpen, Plus } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({ 
  title, 
  description, 
  actionLabel, 
  actionHref, 
  onAction,
  icon
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-md rounded-2xl shadow-[10px_10px_30px_#d1d9e6,-10px_-10px_30px_#ffffff] dark:shadow-[5px_5px_20px_#050805,-5px_-5px_20px_#0f160f] border border-white/20 dark:border-gray-800/50"
    >
      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
        {icon || <FolderOpen className="w-8 h-8 text-green-600 dark:text-green-400" />}
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8">{description}</p>
      
      {actionLabel && (actionHref || onAction) && (
        actionHref ? (
          <Link
            href={actionHref}
            className="inline-flex items-center px-6 py-3 rounded-xl font-medium text-white bg-green-600 hover:bg-green-700 transition-colors shadow-[0_0_20px_rgba(22,163,74,0.4)]"
          >
            <Plus className="w-5 h-5 mr-2" />
            {actionLabel}
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="inline-flex items-center px-6 py-3 rounded-xl font-medium text-white bg-green-600 hover:bg-green-700 transition-colors shadow-[0_0_20px_rgba(22,163,74,0.4)]"
          >
            <Plus className="w-5 h-5 mr-2" />
            {actionLabel}
          </button>
        )
      )}
    </motion.div>
  );
}
