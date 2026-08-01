"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "@/components/providers/I18nProvider";
import { skills, type Skill } from "@/content";


const CATEGORY_COLORS: Record<string, string> = {
  frontend: "from-green-400 to-emerald-500",
  backend: "from-emerald-400 to-teal-500",
  database: "from-teal-400 to-green-500",
  tools: "from-green-500 to-emerald-600",
  ai: "from-emerald-500 to-green-600",
};

interface SkillBarProps {
  skill: Skill;
  index: number;
  isInView: boolean;
}

function SkillBar({ skill, index, isInView }: SkillBarProps) {
  const gradient = CATEGORY_COLORS[skill.category] ?? "from-green-400 to-emerald-500";

  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {skill.name}
        </span>
        <span className="text-xs font-semibold text-green-600 dark:text-green-400 tabular-nums">
          {skill.level}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-green-50 dark:bg-green-900/20 overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
          initial={{ width: 0 }}
          animate={isInView ? { width: `${skill.level}%` } : {}}
          transition={{
            duration: 1.2,
            delay: 0.3 + index * 0.06,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const categories = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <section
      id="skills"
      ref={ref}
      className="py-24 sm:py-32 bg-gradient-to-b from-transparent via-green-50/30 dark:via-green-900/5 to-transparent"
    >
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
              {t.skills.badge}
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
            {t.skills.title}
          </h2>
          <p className="max-w-xl mx-auto text-gray-500 dark:text-gray-400">
            {t.skills.subtitle}
          </p>
        </motion.div>

        {/* Skills by category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat) => {
            const categorySkills = skills.filter((s) => s.category === cat);
            return (
              <div
                key={cat}
                className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-white/5 border border-green-100/80 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6">
                  {t.skills.categories[cat as keyof typeof t.skills.categories]}
                </h3>
                <div className="space-y-5">
                  {categorySkills.map((skill, i) => (
                    <SkillBar
                      key={skill.name}
                      skill={skill}
                      index={i}
                      isInView={isInView}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
