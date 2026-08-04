"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useCallback } from "react";
import { useTranslation } from "@/components/providers/I18nProvider";
import { profile } from "@/content";
import {
  Mail,
  Send,
  Phone,
  MapPin,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import { Github, Linkedin } from "@/components/ui/icons";
import MagneticButton from "@/components/effects/MagneticButton";

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type SubmitStatus = "idle" | "sending" | "success" | "error";

export default function Contact() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus("sending");

      try {
        // Call the API route
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        setStatus("success");
        setForm({ name: "", email: "", subject: "", message: "" });

        setTimeout(() => setStatus("idle"), 5000);
      } catch (error) {
      console.error(error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  },
    [form]
  );

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-gray-50/50 dark:bg-[#0a0f0a]/50 border border-green-100 dark:border-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 text-sm outline-none focus:border-green-400 dark:focus:border-green-500 focus:ring-2 focus:ring-green-400/20 transition-all duration-200";

  const PROFILES = [
    {
      icon: Github,
      label: "GitHub",
      value: "lazizanajmiddinova795-beep",
      href: profile.socials.find((s) => s.label === "GitHub")?.href,
      copyable: false,
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "Laziza Najmiddinova",
      href: profile.socials.find((s) => s.label === "LinkedIn")?.href,
      copyable: false,
    },
    {
      icon: Send,
      label: t.contact.info.telegram,
      value: profile.contact.telegram,
      href: profile.contact.telegramUrl,
      copyable: true,
    },
    {
      icon: Mail,
      label: t.contact.info.email,
      value: profile.contact.email,
      href: `mailto:${profile.contact.email}`,
      copyable: true,
    },
  ];

  return (
    <section
      id="contact"
      ref={ref}
      className="py-24 sm:py-32 bg-gradient-to-b from-transparent via-green-50/20 dark:via-green-900/5 to-transparent"
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
            <MessageSquare size={10} className="text-green-500" />
            <span className="text-xs font-semibold text-green-700 dark:text-green-400 tracking-widest uppercase">
              {t.contact.badge}
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
            {t.contact.title}
          </h2>
          <p className="max-w-xl mx-auto text-gray-500 dark:text-gray-400">
            {t.contact.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Professional Profiles Card */}
          <motion.div
            className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-white/5 border border-green-100/80 dark:border-white/10 shadow-lg space-y-6 h-fit"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Professional Profiles
            </h3>
            
            <div className="space-y-3">
              {PROFILES.map(({ icon: Icon, label, value, href, copyable }, i) => (
                <motion.div
                  key={label}
                  className="group relative flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 dark:bg-[#0a0f0a]/50 border border-transparent hover:border-green-200 dark:hover:border-green-800/50 hover:bg-white dark:hover:bg-white/5 hover:shadow-md transition-all duration-300"
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                >
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 flex-1 min-w-0"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/10 shadow-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:text-green-600 dark:group-hover:text-green-400 transition-all duration-300">
                      <Icon size={18} className="text-gray-600 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors" />
                    </div>
                    <div className="min-w-0 flex-1 pr-4">
                      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
                        {label}
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                        {value}
                      </p>
                    </div>
                  </a>

                  {copyable && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleCopy(value, label);
                      }}
                      className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 dark:hover:text-green-400 transition-all focus:outline-none focus:ring-2 focus:ring-green-400/20 flex-shrink-0"
                      aria-label="Copy to clipboard"
                      title="Copy to clipboard"
                    >
                      {copiedKey === label ? (
                        <Check size={16} className="text-green-500" />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                  )}
                </motion.div>
              ))}

              {/* Location item */}
              <motion.div
                className="group flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50 dark:bg-[#0a0f0a]/50 border border-transparent"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + PROFILES.length * 0.1, duration: 0.5 }}
              >
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/10 shadow-sm flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-gray-600 dark:text-gray-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
                    {t.contact.info.location}
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                    {profile.location}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 0.7,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <form
              onSubmit={handleSubmit}
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-white/5 border border-green-100/80 dark:border-white/10 shadow-lg space-y-5"
              noValidate
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-name"
                    className="text-xs font-semibold text-gray-600 dark:text-gray-400"
                  >
                    {t.contact.form.name}
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder={t.contact.form.name}
                    className={inputClass}
                    disabled={status === "sending"}
                    aria-required="true"
                  />
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-email"
                    className="text-xs font-semibold text-gray-600 dark:text-gray-400"
                  >
                    {t.contact.form.email}
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder={t.contact.form.email}
                    className={inputClass}
                    disabled={status === "sending"}
                    aria-required="true"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="contact-subject"
                  className="text-xs font-semibold text-gray-600 dark:text-gray-400"
                >
                  {t.contact.form.subject}
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  required
                  value={form.subject}
                  onChange={handleChange}
                  placeholder={t.contact.form.subject}
                  className={inputClass}
                  disabled={status === "sending"}
                  aria-required="true"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="contact-message"
                  className="text-xs font-semibold text-gray-600 dark:text-gray-400"
                >
                  {t.contact.form.message}
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder={t.contact.form.message}
                  className={`${inputClass} resize-none`}
                  disabled={status === "sending"}
                  aria-required="true"
                />
              </div>

              {/* Status messages */}
              <AnimatePresence mode="wait">
                {status === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200/60 dark:border-green-700/30"
                    role="alert"
                  >
                    <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                    <p className="text-sm text-green-700 dark:text-green-400">
                      {t.contact.form.success}
                    </p>
                  </motion.div>
                )}
                {status === "error" && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200/60 dark:border-red-700/30"
                    role="alert"
                  >
                    <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-700 dark:text-red-400">
                      {t.contact.form.error}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <MagneticButton
                type="submit"
                disabled={status === "sending"}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold text-sm tracking-wide shadow-lg shadow-green-400/30 hover:shadow-green-400/50 transition-shadow duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                aria-label={status === "sending" ? t.contact.form.sending : t.contact.form.send}
              >
                {status === "sending" ? (
                  <>
                    <motion.span
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    />
                    {t.contact.form.sending}
                  </>
                ) : (
                  <>
                    <Mail size={16} />
                    {t.contact.form.send}
                  </>
                )}
              </MagneticButton>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
