"use client";

import { motion } from "framer-motion";
import { Rocket, Construction } from "lucide-react";

interface Phase2PlaceholderProps {
  title: string;
  description?: string;
}

export function Phase2Placeholder({ title, description }: Phase2PlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-md rounded-3xl p-12 max-w-xl shadow-[20px_20px_60px_#d1d9e6,-20px_-20px_60px_#ffffff] dark:shadow-[10px_10px_30px_#050805,-10px_-10px_30px_#0f160f] border border-white/20 dark:border-gray-800/50 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Construction className="w-48 h-48 text-green-500" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
            <Rocket className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 mb-4">
            {title}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed">
            {description || "This module is scheduled for implementation in Phase 2. It will feature full PostgreSQL integration and advanced CRUD capabilities."}
          </p>

          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-50 dark:bg-green-900/20 text-sm font-medium text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2" />
            Coming Soon (Phase 2)
          </div>
        </div>
      </motion.div>
    </div>
  );
}
