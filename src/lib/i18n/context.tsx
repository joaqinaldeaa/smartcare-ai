"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { en, id, fil, ms, th, vi } from "@/lib/i18n/translations";

type Language = "en" | "id" | "fil" | "ms" | "th" | "vi";
type translationKey = keyof typeof en;

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const dictionaries = { en, id, fil, ms, th, vi };

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("id");

  useEffect(() => {
    const saved = localStorage.getItem("smartcare-lang") as Language;
    if (saved && saved in dictionaries) {
      setLangState(saved);
    } else {
      // Browser language detection
      const browserLang = navigator.language.split("-")[0];
      if (browserLang in dictionaries) {
        setLangState(browserLang as Language);
      }
    }
  }, []);

  const handleSetLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("smartcare-lang", newLang);
  };

  const t = (key: string): string => {
    const dict = dictionaries[lang] as unknown as Record<string, string | object>;
    const val = dict[key];
    if (typeof val === "string") return val;
    const parts = key.split(".");
    let result: unknown = dict;
    for (const part of parts) {
      if (result && typeof result === "object" && part in (result as Record<string, unknown>)) {
        result = (result as Record<string, unknown>)[part];
      } else {
        return key;
      }
    }
    return typeof result === "string" ? result : key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}

export type { Language, translationKey };
