"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, ChevronDown } from "lucide-react";
import { useLanguage, type Language } from "@/lib/i18n/context";

const LANGUAGES: { code: Language; label: string; nativeLabel: string; flag: string }[] = [
  { code: "id", label: "Indonesian", nativeLabel: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "en", label: "English", nativeLabel: "English", flag: "🇺🇸" },
  { code: "fil", label: "Filipino", nativeLabel: "Filipino", flag: "🇵🇭" },
  { code: "ms", label: "Malay", nativeLabel: "Bahasa Malaysia", flag: "🇲🇾" },
  { code: "th", label: "Thai", nativeLabel: "ภาษาไทย", flag: "🇹🇭" },
  { code: "vi", label: "Vietnamese", nativeLabel: "Tiếng Việt", flag: "🇻🇳" },
];

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 hover:bg-white shadow-sm border border-[#94f2f2] transition-all cursor-pointer text-sm font-medium text-[#111d24]"
      >
        <Globe className="w-4 h-4 text-[#006767]" />
        <span>{current.flag}</span>
        <span className="hidden sm:inline">{current.nativeLabel}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-[#3e4949] transition-transform ${open ? "rotate-180" : ""}`} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#94f2f2] overflow-hidden z-50"
          >
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => { setLang(l.code); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-[#f3fffe] transition-colors cursor-pointer text-left ${
                  lang === l.code ? "bg-[#f0fffe]" : ""
                }`}
              >
                <span className="text-lg">{l.flag}</span>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${lang === l.code ? "text-[#006767]" : "text-[#111d24]"}`}>
                    {l.nativeLabel}
                  </p>
                  <p className="text-xs text-[#3e4949]">{l.label}</p>
                </div>
                {lang === l.code && (
                  <div className="w-2 h-2 rounded-full bg-[#006767]" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}