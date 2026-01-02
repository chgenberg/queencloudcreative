"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import CreatorModal from "@/components/CreatorModal";
import ResultsView from "@/components/ResultsView";
import { useLanguage } from "@/lib/LanguageContext";

export type BrandData = {
  brandName: string;
  colors: string[];
  mood: string;
};

export type GeneratedResult = {
  id: string;
  imageUrl: string;
  prompt: string;
  style: string;
};

export default function Home() {
  const { t } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<GeneratedResult[] | null>(null);
  const [brandData, setBrandData] = useState<BrandData | null>(null);

  const handleGeneratingChange = (generating: boolean) => {
    setIsGenerating(generating);
  };

  const handleGenerated = (generatedResults: GeneratedResult[], brand: BrandData) => {
    setResults(generatedResults);
    setBrandData(brand);
    setIsGenerating(false);
    setShowModal(false);
  };

  const handleCloseModal = () => {
    if (!isGenerating) {
      setShowModal(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setBrandData(null);
  };

  // Show results view if we have generated content
  if (results && brandData) {
    return <ResultsView results={results} brandData={brandData} onReset={handleReset} />;
  }

  const features = t("features") as string[];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 via-white to-neutral-100 dark:from-neutral-950 dark:via-black dark:to-neutral-900" />
      
      {/* Floating orbs for visual interest */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-amber-100/20 to-orange-100/20 dark:from-amber-900/10 dark:to-orange-900/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-rose-100/20 to-pink-100/20 dark:from-rose-900/10 dark:to-pink-900/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-2xl mx-auto">
        {/* Logo / Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
              {t("tagline")}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-4">
            {t("heroTitle1") as string}
            <br />
            <span className="font-medium">{t("heroTitle2") as string}</span>
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-lg max-w-md mx-auto">
            {t("heroDescription") as string}
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center"
        >
          <button
            onClick={() => setShowModal(true)}
            className="
              group relative px-8 py-4 
              bg-neutral-900 dark:bg-white 
              text-white dark:text-neutral-900
              rounded-2xl font-medium text-lg
              hover:bg-neutral-800 dark:hover:bg-neutral-100
              transition-all duration-300
              flex items-center gap-3
              shadow-lg shadow-neutral-900/20 dark:shadow-white/20
              hover:shadow-xl hover:shadow-neutral-900/30 dark:hover:shadow-white/30
              hover:scale-105
            "
          >
            {t("getStarted") as string}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Features hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 flex flex-wrap justify-center gap-6 text-sm text-neutral-400 dark:text-neutral-500"
        >
          {features.map((feature) => (
            <span key={feature} className="flex items-center gap-2">
              <span className="w-1 h-1 bg-current rounded-full" />
              {feature}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Creator Modal */}
      <AnimatePresence>
        {showModal && (
          <CreatorModal
            onClose={handleCloseModal}
            onGenerated={handleGenerated}
            onGeneratingChange={handleGeneratingChange}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
