"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  RefreshCw,
  Check,
  Copy,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import type { BrandData, GeneratedResult } from "@/app/page";

// Mood display names
const MOOD_NAMES: Record<string, string> = {
  luxury: "Luxurious",
  energetic: "Energetic",
  minimal: "Minimalist",
  warm: "Warm",
  bold: "Bold",
  natural: "Natural",
};
import { useLanguage } from "@/lib/LanguageContext";

type Props = {
  results: GeneratedResult[];
  brandData: BrandData;
  onReset: () => void;
};

export default function ResultsView({ results, brandData, onReset }: Props) {
  const { t } = useLanguage();
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleDownload = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${brandData.brandName.toLowerCase().replace(/\s+/g, "-")}-variant-${index + 1}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium">{t("tagline") as string}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {brandData.colors.slice(0, 4).map((color, i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full border border-white/20"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <span className="text-sm text-neutral-500">{brandData.brandName}</span>
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              {t("newAnalysis") as string}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl font-light mb-2">
            {t("resultsTitle") as string}
          </h1>
          <p className="text-neutral-500">
            {t("resultsSubtitle") as string}
          </p>
        </motion.div>

        {/* Variant Selector */}
        <div className="flex justify-center gap-4 mb-8">
          {results.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedVariant(index)}
              className={`
                px-6 py-3 rounded-xl font-medium text-sm transition-all
                ${selectedVariant === index
                  ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                }
              `}
            >
              {t("variant") as string} {index + 1}
            </button>
          ))}
        </div>

        {/* Main Preview */}
        <motion.div
          key={selectedVariant}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="grid lg:grid-cols-3 gap-8"
        >
          {/* Large Preview */}
          <div className="lg:col-span-2">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-900 shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={results[selectedVariant].imageUrl}
                alt={`Variant ${selectedVariant + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Format Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs">
                  {t("format") as string}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDownload(results[selectedVariant].imageUrl, selectedVariant)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl font-medium text-sm hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  {t("download") as string}
                </button>
                <button
                  onClick={() => window.open(results[selectedVariant].imageUrl, "_blank")}
                  className="flex items-center gap-2 px-5 py-2.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl font-medium text-sm hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  {t("open") as string}
                </button>
              </div>
              <span className="text-sm text-neutral-400">
                {results[selectedVariant].style}
              </span>
            </div>
          </div>

          {/* Details Panel */}
          <div className="space-y-6">
            {/* Style Info */}
            <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
              <h3 className="font-medium mb-4">{t("variant") as string} {selectedVariant + 1}</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-neutral-500 mb-1">{t("style") as string}</p>
                  <p className="font-medium">{results[selectedVariant].style}</p>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 mb-2">{t("brandColors") as string}</p>
                  <div className="flex gap-2">
                    {brandData.colors.map((color, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Prompt Used */}
            <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">{t("promptUsed") as string}</h3>
                <button
                  onClick={() => copyPrompt(results[selectedVariant].prompt)}
                  className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3" />
                      {t("copied") as string}
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      {t("copy") as string}
                    </>
                  )}
                </button>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-line">
                {results[selectedVariant].prompt
                  .replace(/\*\*/g, '')
                  .replace(/\n{3,}/g, '\n\n')
                  .slice(0, 300)}...
              </p>
            </div>

            {/* All Variants Thumbnails */}
            <div className="p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
              <h3 className="font-medium mb-4">{t("allVariants") as string}</h3>
              <div className="grid grid-cols-2 gap-3">
                {results.map((result, index) => (
                  <button
                    key={result.id}
                    onClick={() => setSelectedVariant(index)}
                    className={`
                      relative aspect-video rounded-xl overflow-hidden transition-all
                      ${selectedVariant === index
                        ? "ring-2 ring-neutral-900 dark:ring-white"
                        : "opacity-60 hover:opacity-100"
                      }
                    `}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={result.imageUrl}
                      alt={`Variant ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <span className="text-white text-xs font-medium">V{index + 1}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Download All */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <button
            onClick={() => results.forEach((r, i) => handleDownload(r.imageUrl, i))}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl font-medium hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-orange-500/20"
          >
            <Download className="w-5 h-5" />
            {t("downloadAll") as string}
          </button>
        </motion.div>
      </div>
    </main>
  );
}
