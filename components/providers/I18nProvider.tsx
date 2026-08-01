"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { en } from "@/lib/i18n/en";
import { uz } from "@/lib/i18n/uz";
import { ru } from "@/lib/i18n/ru";
import type { Translations } from "@/lib/i18n/types";

export type Language = "en" | "uz" | "ru";

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const translations: Record<Language, Translations> = { en, uz, ru };

const I18nContext = createContext<I18nContextType>({
  language: "en",
  setLanguage: () => {},
  t: en,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const stored = localStorage.getItem("portfolio-lang") as Language | null;
    if (stored && ["en", "uz", "ru"].includes(stored)) {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("portfolio-lang", lang);
  };

  return (
    <I18nContext.Provider
      value={{ language, setLanguage, t: translations[language] }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}
