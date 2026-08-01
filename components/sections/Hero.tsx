"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { ArrowDown, Mail, ExternalLink } from "lucide-react";
import { Github, Linkedin } from "@/components/ui/icons";
import { useTranslation } from "@/components/providers/I18nProvider";
import { useTypingEffect } from "@/hooks/useTypingEffect";
import { profile } from "@/content";
import AuroraBackground from "@/components/effects/AuroraBackground";
import MagneticButton from "@/components/effects/MagneticButton";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 2.4,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const BADGE_ITEMS = ["Full Stack", "AI Engineer", "ERP Systems", "Zenfinity"];

export default function Hero() {
  const { t } = useTranslation();
  const typedRole = useTypingEffect(t.hero.roles, 75, 40, 2200);

  const scrollToProjects = () => {
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <AuroraBackground />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `linear-gradient(rgba(74,222,128,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,0.5) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-6"
        >
          {/* Status badge */}
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200/80 dark:border-green-700/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-xs font-semibold text-green-700 dark:text-green-400 tracking-wide">
                {t.about.available}
              </span>
            </div>
          </motion.div>

          {/* Greeting */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 font-medium"
          >
            {t.hero.greeting}
          </motion.p>

          {/* Name */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 dark:text-white leading-none"
          >
            <span className="inline-block">Laziza</span>{" "}
            <span className="inline-block bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 bg-clip-text text-transparent">
              Najmiddinova
            </span>
          </motion.h1>

          {/* Typing role */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3 h-10"
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="h-px w-12 bg-green-400/60 hidden sm:block" />
            <span className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-200">
              {typedRole}
              <span className="inline-block w-0.5 h-6 bg-green-500 ml-0.5 animate-blink" />
            </span>
            <div className="h-px w-12 bg-green-400/60 hidden sm:block" />
          </motion.div>

          {/* Tagline */}
          <motion.p
            variants={itemVariants}
            className="max-w-2xl text-base sm:text-lg text-gray-500 dark:text-gray-400 leading-relaxed"
          >
            {t.hero.tagline}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 mt-2"
          >
            <MagneticButton
              onClick={scrollToProjects}
              className="group relative px-8 py-3.5 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold text-sm tracking-wide shadow-lg shadow-green-400/30 hover:shadow-green-400/50 transition-shadow duration-300 flex items-center gap-2"
              aria-label={t.hero.cta.projects}
            >
              <ExternalLink size={16} />
              {t.hero.cta.projects}
              <div className="absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/10 transition-colors duration-200" />
            </MagneticButton>

            <MagneticButton
              onClick={scrollToContact}
              className="group relative px-8 py-3.5 rounded-2xl border-2 border-green-200 dark:border-green-700/50 text-green-700 dark:text-green-400 font-semibold text-sm tracking-wide hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50/50 dark:hover:bg-green-900/10 transition-all duration-300 flex items-center gap-2 backdrop-blur-sm"
              aria-label={t.hero.cta.contact}
            >
              <Mail size={16} />
              {t.hero.cta.contact}
            </MagneticButton>
          </motion.div>

          {/* Social Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-4 mt-2"
          >
            <MagneticButton
              className="group relative p-3.5 rounded-xl border-2 border-green-200 dark:border-green-700/50 text-green-700 dark:text-green-400 hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50/50 dark:hover:bg-green-900/10 transition-all duration-300 shadow-[0_0_0_rgba(52,211,153,0)] hover:shadow-[0_0_15px_rgba(52,211,153,0.3)] hover:-translate-y-1 bg-white/5 backdrop-blur-sm"
              onClick={() => window.open(profile.socials.find(s => s.label === "GitHub")?.href, "_blank")}
              aria-label="GitHub"
            >
              <Github size={20} className="group-hover:scale-110 transition-transform duration-300" />
            </MagneticButton>
            
            <MagneticButton
              className="group relative p-3.5 rounded-xl border-2 border-green-200 dark:border-green-700/50 text-green-700 dark:text-green-400 hover:border-green-400 dark:hover:border-green-500 hover:bg-green-50/50 dark:hover:bg-green-900/10 transition-all duration-300 shadow-[0_0_0_rgba(52,211,153,0)] hover:shadow-[0_0_15px_rgba(52,211,153,0.3)] hover:-translate-y-1 bg-white/5 backdrop-blur-sm"
              onClick={() => window.open(profile.socials.find(s => s.label === "LinkedIn")?.href, "_blank")}
              aria-label="LinkedIn"
            >
              <Linkedin size={20} className="group-hover:scale-110 transition-transform duration-300" />
            </MagneticButton>
          </motion.div>

          {/* Badge pills */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-2 mt-4"
          >
            {BADGE_ITEMS.map((item, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-xs font-medium bg-white/70 dark:bg-white/5 text-gray-600 dark:text-gray-400 border border-green-100 dark:border-green-900/30 backdrop-blur-sm"
              >
                {item}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.button
        onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 dark:text-gray-600 hover:text-green-500 dark:hover:text-green-400 transition-colors duration-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 4, duration: 0.6 }}
        aria-label="Scroll to about section"
      >
        <span className="text-xs font-medium tracking-widest uppercase">
          {t.hero.scrollHint}
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={16} />
        </motion.div>
      </motion.button>
    </section>
  );
}
