"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useTranslation } from "@/components/providers/I18nProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import type { Language } from "@/components/providers/I18nProvider";

const NAV_SECTIONS = [
  "home",
  "about",
  "skills",
  "techStack",
  "projects",
  "learning",
  "services",
  "contact",
] as const;

type NavSection = (typeof NAV_SECTIONS)[number];

const SECTION_IDS: Record<NavSection, string> = {
  home: "hero",
  about: "about",
  skills: "skills",
  techStack: "tech-stack",
  projects: "projects",
  learning: "learning",
  services: "services",
  contact: "contact",
};

const LANGUAGES: Language[] = ["en", "uz", "ru"];

export default function Navbar() {
  const { t, language, setLanguage } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Active section detection
      const sections = NAV_SECTIONS.map((k) => ({
        id: SECTION_IDS[k],
        el: document.getElementById(SECTION_IDS[k]),
      }));

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i].el;
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMobileOpen(false);
  }, []);

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 dark:bg-[#0a0f0a]/80 backdrop-blur-xl border-b border-green-100/50 dark:border-green-900/20 shadow-sm"
            : "bg-transparent"
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 2.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => scrollTo("hero")}
              className="flex items-center gap-3 group"
              aria-label="Go to top"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-400/20 group-hover:shadow-green-400/40 transition-shadow duration-300">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white tracking-tight hidden sm:block">
                Laziza<span className="text-green-500">.</span>
              </span>
            </button>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_SECTIONS.map((section) => {
                const id = SECTION_IDS[section];
                const isActive = activeSection === id;
                return (
                  <button
                    key={section}
                    onClick={() => scrollTo(id)}
                    className={`relative px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      isActive
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-lg bg-green-50 dark:bg-green-900/20"
                        transition={{ type: "spring", duration: 0.4 }}
                      />
                    )}
                    <span className="relative z-10">{t.nav[section]}</span>
                  </button>
                );
              })}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Language switcher */}
              <div className="hidden sm:flex items-center gap-1 p-1 rounded-lg bg-green-50/80 dark:bg-green-900/20">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-2 py-1 rounded-md text-xs font-semibold transition-all duration-200 ${
                      language === lang
                        ? "bg-white dark:bg-[#0a0f0a] text-green-600 dark:text-green-400 shadow-sm"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    }`}
                    aria-label={`Switch to ${lang} language`}
                    aria-pressed={language === lang}
                  >
                    {t.language[lang]}
                  </button>
                ))}
              </div>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200"
                aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              >
                <AnimatePresence mode="wait">
                  {theme === "light" ? (
                    <motion.div
                      key="moon"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon size={16} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="sun"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun size={16} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-200"
                aria-label="Toggle mobile menu"
                aria-expanded={mobileOpen}
              >
                <AnimatePresence mode="wait">
                  {mobileOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <X size={18} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Menu size={18} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            {/* Panel */}
            <motion.div
              className="absolute top-0 right-0 h-full w-72 bg-white dark:bg-[#0d140d] shadow-2xl"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="p-6 pt-20 flex flex-col gap-2">
                {/* Nav items */}
                {NAV_SECTIONS.map((section, i) => {
                  const id = SECTION_IDS[section];
                  return (
                    <motion.button
                      key={section}
                      onClick={() => scrollTo(id)}
                      className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 ${
                        activeSection === id
                          ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5"
                      }`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      {t.nav[section]}
                    </motion.button>
                  );
                })}

                {/* Language switcher mobile */}
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/10">
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-3 px-4">
                    Language
                  </p>
                  <div className="flex gap-2 px-4">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                          language === lang
                            ? "bg-green-500 text-white shadow-md"
                            : "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300"
                        }`}
                        aria-pressed={language === lang}
                      >
                        {lang.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
