"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import type { Language } from "@/lib/translations";

const flags: Record<Language, { emoji: string; label: string }> = {
  en: { emoji: "🇬🇧", label: "English" },
  sv: { emoji: "🇸🇪", label: "Svenska" },
};

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "sv" : "en");
  };

  const otherLang = language === "en" ? "sv" : "en";

  return (
    <motion.button
      onClick={toggleLanguage}
      className="
        fixed top-6 right-6 z-50
        flex items-center gap-2 px-3 py-2
        bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm
        border border-neutral-200 dark:border-neutral-700
        rounded-full shadow-sm
        hover:bg-white dark:hover:bg-neutral-800
        transition-colors
      "
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={`Switch to ${flags[otherLang].label}`}
    >
      <span className="text-lg leading-none">{flags[language].emoji}</span>
      <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400 uppercase">
        {language}
      </span>
    </motion.button>
  );
}


