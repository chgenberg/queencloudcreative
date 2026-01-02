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
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Image - Desktop */}
      <div 
        className="absolute inset-0 hidden md:block bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/backgrund_queencloudcreative.png')" }}
      />
      
      {/* Background Image - Mobile */}
      <div 
        className="absolute inset-0 md:hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/backgrund_queencloudcreative_mobile.png')" }}
      />
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Animated gradient overlay */}
      <motion.div 
        className="absolute inset-0 opacity-40"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(251, 191, 36, 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, rgba(251, 191, 36, 0.15) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, rgba(251, 191, 36, 0.15) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex items-start md:items-center px-6 py-12 md:py-0">
        <div className="w-full max-w-7xl mx-auto">
          {/* Hero Card - Left on desktop, Top on mobile */}
          <motion.div
            initial={{ opacity: 0, x: -30, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="
              w-full md:w-[480px] 
              mt-8 md:mt-0
              bg-white/95 dark:bg-neutral-900/95 
              backdrop-blur-xl 
              rounded-3xl 
              p-8 md:p-10
              shadow-2xl shadow-black/20
              border border-white/20
            "
          >
            {/* Logo / Brand */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 mb-6">
                <motion.div 
                  className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </motion.div>
                <span className="text-sm font-semibold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
                  {t("tagline")}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-4 text-neutral-900 dark:text-white">
                {t("heroTitle1") as string}
                <br />
                <span className="font-semibold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                  {t("heroTitle2") as string}
                </span>
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400 text-base leading-relaxed">
                {t("heroDescription") as string}
              </p>
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <button
                onClick={() => setShowModal(true)}
                className="
                  group relative w-full px-8 py-4 
                  bg-gradient-to-r from-amber-500 to-orange-500
                  text-white
                  rounded-2xl font-semibold text-lg
                  hover:from-amber-600 hover:to-orange-600
                  transition-all duration-300
                  flex items-center justify-center gap-3
                  shadow-lg shadow-amber-500/30
                  hover:shadow-xl hover:shadow-amber-500/40
                  hover:scale-[1.02]
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
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700"
            >
              <div className="flex flex-wrap gap-3">
                {features.map((feature, index) => (
                  <motion.span 
                    key={feature} 
                    className="
                      flex items-center gap-2 
                      text-xs font-medium
                      px-3 py-1.5 
                      bg-neutral-100 dark:bg-neutral-800 
                      text-neutral-600 dark:text-neutral-400
                      rounded-full
                    "
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                  >
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                    {feature}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
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
