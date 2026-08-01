"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "@/components/providers/I18nProvider";
import { BookOpen } from "lucide-react";

export default function LearningJourney() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="learning"
      ref={ref}
      className="py-24 sm:py-32 bg-gradient-to-b from-transparent via-green-50/20 dark:via-green-900/5 to-transparent"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200/60 dark:border-green-700/30">
            <BookOpen size={10} className="text-green-500" />
            <span className="text-xs font-semibold text-green-700 dark:text-green-400 tracking-widest uppercase">
              {t.learning.badge}
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
            {t.learning.title}
          </h2>
          <p className="max-w-xl mx-auto text-gray-500 dark:text-gray-400">
            {t.learning.subtitle}
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px bg-green-100 dark:bg-green-900/40 -translate-x-1/2" />

          {/* Animated line fill */}
          <motion.div
            className="absolute left-6 sm:left-1/2 top-0 w-px bg-gradient-to-b from-green-400 to-emerald-500 -translate-x-1/2 origin-top"
            initial={{ scaleY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 2, delay: 0.3, ease: "easeInOut" }}
          />

          <div className="space-y-8">
            {t.learning.items.map((item, i) => {
              const isLeft = i % 2 === 0;

              return (
                <motion.div
                  key={item.title}
                  className={`relative flex gap-6 ${
                    isLeft ? "sm:flex-row" : "sm:flex-row-reverse"
                  } flex-row items-start`}
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.6,
                    delay: 0.2 + i * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {/* Dot */}
                  <div
                    className={`relative z-10 flex-shrink-0 ${
                      isLeft ? "" : "sm:order-2 order-none"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-400/20 border-4 border-white dark:border-[#0a0f0a]">
                      <span className="text-white font-bold text-sm">
                        {i + 1}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div
                    className={`flex-1 pb-8 ${
                      isLeft ? "sm:pr-16 sm:text-right" : "sm:pl-16 sm:text-left"
                    }`}
                  >
                    <div
                      className={`group p-5 rounded-2xl bg-white dark:bg-white/5 border border-green-100/80 dark:border-white/10 shadow-sm hover:shadow-md hover:border-green-200 dark:hover:border-green-800/40 transition-all duration-300 ${
                        isLeft ? "sm:mr-0 sm:ml-auto sm:max-w-sm" : "sm:ml-0 sm:mr-auto sm:max-w-sm"
                      } max-w-full`}
                    >
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {item.description}
                      </p>
                      {/* Currently learning badge */}
                      <div className="mt-3 inline-flex items-center gap-1.5">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                        </span>
                        <span className="text-xs font-medium text-green-600 dark:text-green-400">
                          {t.learning.current}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
