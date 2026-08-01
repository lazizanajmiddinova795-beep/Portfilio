"use client";

import { motion } from "framer-motion";

/**
 * Premium aurora gradient background with animated floating blobs.
 * Renders as absolute-positioned overlay behind section content.
 */
export default function AuroraBackground() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Blob 1 — top left */}
      <motion.div
        className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full opacity-30 dark:opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(74,222,128,0.4) 0%, rgba(16,185,129,0.2) 50%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{
          x: [0, 60, 0],
          y: [0, -40, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Blob 2 — top right */}
      <motion.div
        className="absolute -top-20 right-0 w-[500px] h-[500px] rounded-full opacity-20 dark:opacity-15"
        style={{
          background:
            "radial-gradient(circle, rgba(52,211,153,0.5) 0%, rgba(16,185,129,0.2) 50%, transparent 70%)",
          filter: "blur(80px)",
        }}
        animate={{
          x: [0, -50, 0],
          y: [0, 60, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      />

      {/* Blob 3 — bottom center (subtle) */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px]"
        style={{
          background:
            "radial-gradient(ellipse, rgba(74,222,128,0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{
          scaleX: [1, 1.2, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 6,
        }}
      />

      {/* Noise texture for premium feel */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />
    </div>
  );
}
