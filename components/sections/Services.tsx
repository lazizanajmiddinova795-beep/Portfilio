"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "@/components/providers/I18nProvider";
import {
  LayoutDashboard,
  Globe,
  Zap,
  BrainCircuit,
  Server,
  Code2,
} from "lucide-react";

const ICON_MAP = {
  LayoutDashboard,
  Globe,
  Zap,
  BrainCircuit,
  Server,
  Code2,
};

type IconKey = keyof typeof ICON_MAP;

export default function Services() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" ref={ref} className="py-24 sm:py-32">
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
              {t.services.badge}
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
            {t.services.title}
          </h2>
          <p className="max-w-xl mx-auto text-gray-500 dark:text-gray-400">
            {t.services.subtitle}
          </p>
        </motion.div>

        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.services.items.map((service, i) => {
            const Icon = ICON_MAP[service.icon as IconKey] ?? Code2;

            return (
              <motion.div
                key={service.title}
                className="group relative p-6 sm:p-8 rounded-2xl bg-white dark:bg-white/5 border border-green-100/80 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-green-200 dark:hover:border-green-800/50 transition-all duration-400 cursor-default overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                {/* BG glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 dark:from-green-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Number */}
                <span className="absolute top-6 right-6 text-5xl font-black text-green-100 dark:text-green-900/40 select-none group-hover:text-green-200 dark:group-hover:text-green-800/50 transition-colors duration-300">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Icon */}
                <div className="relative z-10 w-12 h-12 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <Icon
                    size={22}
                    className="text-green-600 dark:text-green-400"
                  />
                </div>

                {/* Content */}
                <div className="relative z-10 space-y-3">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-green-400 to-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
