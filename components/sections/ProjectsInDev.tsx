"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "@/components/providers/I18nProvider";
import {
  CreditCard,
  Globe,
  Building2,
  BookOpen,
  Camera,
  Clock,
} from "lucide-react";

const ICON_MAP = {
  CreditCard,
  Globe,
  Building2,
  BookOpen,
  Camera,
};

type IconKey = keyof typeof ICON_MAP;

const CARD_GRADIENTS = [
  "from-green-400/10 to-emerald-400/5",
  "from-emerald-400/10 to-teal-400/5",
  "from-teal-400/10 to-green-400/5",
  "from-green-500/10 to-emerald-500/5",
  "from-emerald-500/10 to-green-500/5",
];

export default function ProjectsInDev() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects-dev" ref={ref} className="py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-700/30">
            <Clock size={10} className="text-amber-500" />
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400 tracking-widest uppercase">
              {t.projectsInDev.badge}
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
            {t.projectsInDev.title}
          </h2>
          <p className="max-w-xl mx-auto text-gray-500 dark:text-gray-400">
            {t.projectsInDev.subtitle}
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.projectsInDev.projects.map((project, i) => {
            const Icon = ICON_MAP[project.icon as IconKey] ?? Globe;
            const gradient = CARD_GRADIENTS[i % CARD_GRADIENTS.length];

            return (
              <motion.div
                key={project.name}
                className={`group relative p-6 rounded-2xl bg-gradient-to-br ${gradient} border border-green-100/80 dark:border-white/10 bg-white dark:bg-white/5 hover:border-green-200 dark:hover:border-green-800/50 hover:shadow-lg transition-all duration-300 cursor-default`}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                {/* Status badge */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-700/30">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500" />
                  </span>
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                    {t.projectsInDev.status}
                  </span>
                </div>

                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <Icon size={22} className="text-green-600 dark:text-green-400" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 pr-20">
                  {project.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {project.description}
                </p>

                {/* Progress bar (decorative) */}
                <div className="mt-6 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 dark:text-gray-500">Progress</span>
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">
                      {20 + i * 12}%
                    </span>
                  </div>
                  <div className="h-1 rounded-full bg-green-100 dark:bg-green-900/30 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
                      initial={{ width: 0 }}
                      animate={isInView ? { width: `${20 + i * 12}%` } : {}}
                      transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
