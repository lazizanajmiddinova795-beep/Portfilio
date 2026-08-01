"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "@/components/providers/I18nProvider";
import { techStack, type TechItem } from "@/content";

interface TechCardProps {
  tech: TechItem;
  index: number;
  isInView: boolean;
}

function TechCard({ tech, index, isInView }: TechCardProps) {
  return (
    <motion.div
      className="group relative p-5 rounded-2xl bg-white dark:bg-white/5 border border-green-100/80 dark:border-white/10 shadow-sm cursor-default flex flex-col items-center gap-3 hover:border-green-200 dark:hover:border-green-800/50 hover:shadow-md transition-all duration-300"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      {/* Glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at center, ${tech.color}15 0%, transparent 70%)`,
        }}
      />

      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold shadow-sm"
        style={{
          backgroundColor: `${tech.color}15`,
          color: tech.color,
          border: `1px solid ${tech.color}30`,
        }}
      >
        {tech.icon}
      </div>

      <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
        {tech.name}
      </span>
      <span className="text-xs text-gray-400 dark:text-gray-500">
        {tech.category}
      </span>
    </motion.div>
  );
}

export default function TechStack() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="tech-stack" ref={ref} className="py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200/60 dark:border-green-700/30">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="text-xs font-semibold text-green-700 dark:text-green-400 tracking-widest uppercase">
              {t.techStack.badge}
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
            {t.techStack.title}
          </h2>
          <p className="max-w-xl mx-auto text-gray-500 dark:text-gray-400">
            {t.techStack.subtitle}
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {techStack.map((tech, i) => (
            <TechCard key={tech.name} tech={tech} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}
