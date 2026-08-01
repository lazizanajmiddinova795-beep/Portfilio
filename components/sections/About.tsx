"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { MapPin, Users, CheckCircle2 } from "lucide-react";
import { useTranslation } from "@/components/providers/I18nProvider";
import { profile } from "@/content";

interface StatItemProps {
  value: number;
  suffix?: string;
  label: string;
  delay?: number;
}

function AnimatedStat({ value, suffix = "", label, delay = 0 }: StatItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1800;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(value * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };

    const raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [isInView, value]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-1">
      <motion.span
        className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent tabular-nums"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {count}{suffix}
      </motion.span>
      <span className="text-sm text-gray-500 dark:text-gray-400 font-medium text-center">
        {label}
      </span>
    </div>
  );
}

export default function About() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24 sm:py-32 relative overflow-hidden"
    >
      {/* Subtle BG accent */}
      <div className="absolute top-1/2 right-0 w-96 h-96 -translate-y-1/2 opacity-20 dark:opacity-10 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(74,222,128,0.3) 0%, transparent 70%)", filter: "blur(60px)" }} aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left — Text */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200/60 dark:border-green-700/30">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-xs font-semibold text-green-700 dark:text-green-400 tracking-widest uppercase">
                {t.about.badge}
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
              {t.about.title}
            </h2>

            <div className="space-y-5 text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>{t.about.p1}</p>
              <p>{t.about.p2}</p>
              <p>{t.about.p3}</p>
            </div>

            {/* Info pills */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-green-100 dark:border-white/10 shadow-sm">
                <MapPin size={14} className="text-green-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t.about.location}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-white/5 border border-green-100 dark:border-white/10 shadow-sm">
                <Users size={14} className="text-green-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t.about.team}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200/60 dark:border-green-700/30">
                <CheckCircle2 size={14} className="text-green-500" />
                <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                  {t.about.available}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right — Stats card */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 4, suffix: "+", label: t.about.stats.projects, delay: 0 },
                { value: 15, suffix: "+", label: t.about.stats.technologies, delay: 0.1 },
                { value: profile.age, suffix: "", label: t.about.stats.age, delay: 0.2 },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-green-100/80 dark:border-white/10 shadow-sm hover:shadow-md hover:border-green-200 dark:hover:border-green-800/40 transition-all duration-300"
                >
                  <AnimatedStat {...stat} />
                </div>
              ))}
              {/* Team card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 text-white col-span-2 sm:col-span-1 flex flex-col items-center justify-center gap-2 shadow-lg shadow-green-400/20">
                <Users size={24} className="opacity-80" />
                <span className="font-bold text-lg leading-tight text-center">
                  {profile.team.split(" ")[0]}
                </span>
                <span className="text-xs opacity-80 font-medium">
                  {t.about.stats.team}
                </span>
              </div>
            </div>

            {/* Languages card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-white/5 border border-green-100/80 dark:border-white/10 shadow-sm">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
                Languages
              </p>
              <div className="flex flex-wrap gap-3">
                {profile.languages.map(({ flag, label }) => (
                  <span
                    key={label}
                    className="px-3 py-1.5 rounded-xl bg-green-50 dark:bg-green-900/20 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {flag} {label}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
