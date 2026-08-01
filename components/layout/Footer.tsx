"use client";

import { Heart, Mail, Send } from "lucide-react";
import { Github, Linkedin } from "@/components/ui/icons";
import { useTranslation } from "@/components/providers/I18nProvider";
import { profile } from "@/content";

// Icon map for social links defined in content/profile.ts
const ICON_MAP = { Mail, Send, Github, Linkedin } as const;
type IconKey = keyof typeof ICON_MAP;

const NAV_LINKS = [
  { id: "about", key: "about" },
  { id: "skills", key: "skills" },
  { id: "projects", key: "projects" },
  { id: "services", key: "services" },
  { id: "contact", key: "contact" },
] as const;

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-green-100/80 dark:border-green-900/20 bg-white/50 dark:bg-[#0a0f0a]/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-400/20">
                <span className="text-white font-bold">
                  {profile.firstName[0]}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">
                  {profile.name}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  Full Stack Developer · AI Engineer
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs">
              {t.footer.tagline}
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              Navigation
            </h3>
            <nav className="grid grid-cols-2 gap-2" aria-label="Footer navigation">
              {NAV_LINKS.map(({ id, key }) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors duration-200 text-left"
                >
                  {t.nav[key]}
                </button>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              Connect
            </h3>
            <div className="flex gap-3">
              {profile.socials.map(({ href, label, icon }) => {
                const Icon = ICON_MAP[icon as IconKey];
                if (!Icon) return null;
                return (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    aria-label={label}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 bg-green-50 dark:bg-green-900/20 hover:bg-white dark:hover:bg-green-900/40 hover:text-green-600 dark:hover:text-green-400 transition-all duration-300 shadow-[0_0_0_rgba(52,211,153,0)] hover:shadow-[0_0_15px_rgba(52,211,153,0.3)] hover:-translate-y-1"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {profile.contact.email}
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-green-100/60 dark:border-green-900/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400 dark:text-gray-600">
            © {year} {profile.name}. {t.footer.rights}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-600 flex items-center gap-1">
            {t.footer.builtWith} Next.js {t.footer.and}{" "}
            <Heart
              size={12}
              className="text-green-500 fill-green-500 inline mx-0.5"
            />{" "}
            {t.footer.passion}
          </p>
        </div>
      </div>
    </footer>
  );
}
