"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#f0fdf4] dark:bg-[#0a0f0a]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
        >
          {/* Background glow */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="w-64 h-64 rounded-full bg-green-400/10 blur-3xl" />
          </motion.div>

          {/* Logo mark */}
          <div className="relative flex flex-col items-center gap-6">
            <motion.div
              className="relative w-20 h-20"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Outer ring */}
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-green-400/30"
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
              {/* Inner card */}
              <div className="w-full h-full rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-2xl shadow-green-400/30">
                <span className="text-white font-bold text-3xl tracking-tight">
                  L
                </span>
              </div>
            </motion.div>

            {/* Name */}
            <motion.div
              className="flex flex-col items-center gap-1"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <span className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">
                Laziza Najmiddinova
              </span>
              <span className="text-sm text-green-600 dark:text-green-400 font-medium tracking-widest uppercase">
                Portfolio
              </span>
            </motion.div>

            {/* Progress bar */}
            <motion.div className="w-48 h-[2px] bg-green-100 dark:bg-green-900/40 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.6, delay: 0.3, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
