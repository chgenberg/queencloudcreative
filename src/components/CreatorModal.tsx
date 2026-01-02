"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  Image as ImageIcon,
  Film,
  Mail,
  Check,
  Sparkles,
  Eye,
  Palette,
  Wand2,
  RectangleVertical,
  RectangleHorizontal,
  Snowflake,
  Droplets,
  Puzzle,
  Waves,
  Zap,
  Crown,
  Flame,
  Minus,
  Heart,
  Leaf,
  Star,
} from "lucide-react";
import type { BrandData, GeneratedResult } from "@/app/page";
import { useLanguage } from "@/lib/LanguageContext";

type Props = {
  onClose: () => void;
  onGenerated: (results: GeneratedResult[], brandData: BrandData) => void;
  onGeneratingChange: (generating: boolean) => void;
};

type OutputType = "image" | "video";
type AspectRatio = "landscape" | "portrait";
type CreativeStyle = "iceCube" | "liquidMetal" | "floatingFragments" | "underwaterDream" | "neonGlow";
type MoodStyle = "luxury" | "energetic" | "minimal" | "warm" | "bold" | "natural";

const CREATIVE_STYLE_ICONS: Record<CreativeStyle, React.ReactNode> = {
  iceCube: <Snowflake className="w-5 h-5" />,
  liquidMetal: <Droplets className="w-5 h-5" />,
  floatingFragments: <Puzzle className="w-5 h-5" />,
  underwaterDream: <Waves className="w-5 h-5" />,
  neonGlow: <Zap className="w-5 h-5" />,
};

const MOOD_ICONS: Record<MoodStyle, React.ReactNode> = {
  luxury: <Crown className="w-5 h-5" />,
  energetic: <Flame className="w-5 h-5" />,
  minimal: <Minus className="w-5 h-5" />,
  warm: <Heart className="w-5 h-5" />,
  bold: <Star className="w-5 h-5" />,
  natural: <Leaf className="w-5 h-5" />,
};

// Pre-defined color palettes
const COLOR_PALETTES = [
  { name: "Midnight Gold", colors: ["#1a1a2e", "#16213e", "#0f3460", "#e94560", "#ffd700"] },
  { name: "Ocean Breeze", colors: ["#0077b6", "#00b4d8", "#90e0ef", "#caf0f8", "#03045e"] },
  { name: "Forest Earth", colors: ["#2d6a4f", "#40916c", "#52b788", "#74c69d", "#1b4332"] },
  { name: "Sunset Warm", colors: ["#ff6b35", "#f7c59f", "#efa00b", "#d65108", "#591f0a"] },
  { name: "Royal Purple", colors: ["#7b2cbf", "#9d4edd", "#c77dff", "#e0aaff", "#3c096c"] },
  { name: "Monochrome", colors: ["#000000", "#333333", "#666666", "#999999", "#ffffff"] },
  { name: "Coral Reef", colors: ["#ff6b6b", "#feca57", "#48dbfb", "#ff9ff3", "#54a0ff"] },
  { name: "Nordic Ice", colors: ["#a8dadc", "#457b9d", "#1d3557", "#f1faee", "#e63946"] },
];

export default function CreatorModal({ onClose, onGenerated, onGeneratingChange }: Props) {
  const { t } = useLanguage();
  
  // Form state
  const [brandName, setBrandName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedPalette, setSelectedPalette] = useState(0);
  const [customColors, setCustomColors] = useState<string[]>([]);
  const [useCustomColors, setUseCustomColors] = useState(false);
  const [mood, setMood] = useState<MoodStyle>("luxury");
  const [outputType, setOutputType] = useState<OutputType>("image");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("landscape");
  const [selectedStyles, setSelectedStyles] = useState<CreativeStyle[]>(["iceCube", "liquidMetal"]);
  const [file, setFile] = useState<File | null>(null);
  const [analysisFile, setAnalysisFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  // UI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalSteps = 5;

  const loadingSteps = [
    { id: "analyze", label: t("loadingStep1") as string, icon: <Eye className="w-5 h-5" /> },
    { id: "colors", label: t("loadingStep2") as string, icon: <Palette className="w-5 h-5" /> },
    { id: "generate1", label: t("loadingStep3") as string, icon: <Wand2 className="w-5 h-5" /> },
    { id: "generate2", label: t("loadingStep4") as string, icon: <Sparkles className="w-5 h-5" /> },
  ];

  const creativeStyles: { key: CreativeStyle; nameKey: string; descKey: string }[] = [
    { key: "iceCube", nameKey: "styleIceCube", descKey: "styleIceCubeDesc" },
    { key: "liquidMetal", nameKey: "styleLiquidMetal", descKey: "styleLiquidMetalDesc" },
    { key: "floatingFragments", nameKey: "styleFloatingFragments", descKey: "styleFloatingFragmentsDesc" },
    { key: "underwaterDream", nameKey: "styleUnderwaterDream", descKey: "styleUnderwaterDreamDesc" },
    { key: "neonGlow", nameKey: "styleNeonGlow", descKey: "styleNeonGlowDesc" },
  ];

  const moodStyles: { key: MoodStyle; nameKey: string; descKey: string }[] = [
    { key: "luxury", nameKey: "moodLuxury", descKey: "moodLuxuryDesc" },
    { key: "energetic", nameKey: "moodEnergetic", descKey: "moodEnergeticDesc" },
    { key: "minimal", nameKey: "moodMinimal", descKey: "moodMinimalDesc" },
    { key: "warm", nameKey: "moodWarm", descKey: "moodWarmDesc" },
    { key: "bold", nameKey: "moodBold", descKey: "moodBoldDesc" },
    { key: "natural", nameKey: "moodNatural", descKey: "moodNaturalDesc" },
  ];

  // Get current colors
  const currentColors = useCustomColors && customColors.length > 0 
    ? customColors 
    : COLOR_PALETTES[selectedPalette].colors;

  // Loading animation
  useEffect(() => {
    if (!isGenerating) {
      setLoadingStep(0);
      return;
    }

    const intervals = [0, 5000, 20000, 35000];
    const timers: NodeJS.Timeout[] = [];

    intervals.forEach((delay, index) => {
      if (index > 0) {
        const timer = setTimeout(() => {
          setLoadingStep(index);
        }, delay);
        timers.push(timer);
      }
    });

    return () => timers.forEach(clearTimeout);
  }, [isGenerating]);

  const extractVideoFrame = useCallback(async (videoFile: File): Promise<File> => {
    const objectUrl = URL.createObjectURL(videoFile);
    try {
      const video = document.createElement("video");
      video.src = objectUrl;
      video.muted = true;
      video.playsInline = true;
      video.crossOrigin = "anonymous";

      await new Promise<void>((resolve, reject) => {
        const onLoaded = () => resolve();
        const onError = () => reject(new Error("Could not load video"));
        video.addEventListener("loadeddata", onLoaded, { once: true });
        video.addEventListener("error", onError, { once: true });
      });

      // Seek to a small offset to avoid black first frame
      const seekTime = Math.min(0.2, Math.max(0.0, (video.duration || 1) * 0.05));
      video.currentTime = seekTime;

      await new Promise<void>((resolve, reject) => {
        const onSeeked = () => resolve();
        const onError = () => reject(new Error("Could not seek video"));
        video.addEventListener("seeked", onSeeked, { once: true });
        video.addEventListener("error", onError, { once: true });
      });

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("Could not extract frame"))),
          "image/jpeg",
          0.92
        );
      });

      return new File([blob], "video-frame.jpg", { type: "image/jpeg" });
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  }, []);

  const handlePickedFile = useCallback(
    async (picked: File) => {
      setError(null);
      setFile(picked);
      setPreview(URL.createObjectURL(picked));

      if (picked.type.startsWith("video/")) {
        // Extract a keyframe for analysis + generation (current backend only accepts images)
        const frame = await extractVideoFrame(picked);
        setAnalysisFile(frame);
      } else {
        setAnalysisFile(picked);
      }
    },
    [extractVideoFrame]
  );

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        try {
          await handlePickedFile(selectedFile);
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Could not process uploaded file. Please try again."
          );
        }
      }
    },
    [handlePickedFile]
  );

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      try {
        await handlePickedFile(droppedFile);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Could not process uploaded file. Please try again."
        );
      }
    }
  }, [handlePickedFile]);

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const canProceed = () => {
    switch (step) {
      case 1: return brandName.trim().length > 0 && isValidEmail(email);
      case 2: return true; // Palette always selected
      case 3: return true; // Mood always selected
      case 4: return file !== null;
      case 5: return selectedStyles.length === 2;
      default: return false;
    }
  };

  const toggleStyle = (styleKey: CreativeStyle) => {
    if (selectedStyles.includes(styleKey)) {
      if (selectedStyles.length > 1) {
        setSelectedStyles(selectedStyles.filter(s => s !== styleKey));
      }
    } else {
      if (selectedStyles.length < 2) {
        setSelectedStyles([...selectedStyles, styleKey]);
      } else {
        setSelectedStyles([selectedStyles[1], styleKey]);
      }
    }
  };

  const handleBackdropClick = () => {
    if (!isGenerating) onClose();
  };

  const handleGenerate = async () => {
    if (!file || !analysisFile || !email || selectedStyles.length !== 2) return;

    setIsGenerating(true);
    onGeneratingChange(true);
    setError(null);

    try {
      const brandData: BrandData = {
        brandName,
        colors: currentColors,
        mood,
      };

      const formData = new FormData();
      // Always send an IMAGE to the API (for video uploads we send an extracted frame)
      formData.append("file", analysisFile);
      formData.append("email", email);
      formData.append("outputType", outputType);
      formData.append("aspectRatio", aspectRatio);
      formData.append("styles", JSON.stringify(selectedStyles));
      formData.append("brandData", JSON.stringify(brandData));

      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t("errorGenerate") as string);
      }

      const data = await response.json();
      await new Promise(resolve => setTimeout(resolve, 500));
      onGenerated(data.results, brandData);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errorGenerate") as string);
      setIsGenerating(false);
      onGeneratingChange(false);
    }
  };

  const addCustomColor = () => {
    if (customColors.length < 6) {
      setCustomColors([...customColors, "#000000"]);
      setUseCustomColors(true);
    }
  };

  const updateCustomColor = (index: number, color: string) => {
    const updated = [...customColors];
    updated[index] = color;
    setCustomColors(updated);
  };

  const removeCustomColor = (index: number) => {
    setCustomColors(customColors.filter((_, i) => i !== index));
    if (customColors.length <= 1) setUseCustomColors(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-modal"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-medium">{brandName || "Queencloudcreative"}</h2>
              <p className="text-xs text-neutral-500">
                {t("stepOf") as string} {step} {t("of") as string} {totalSteps}
              </p>
            </div>
          </div>
          {!isGenerating && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Progress bar */}
        {!isGenerating && (
          <div className="px-6 py-3 border-b border-neutral-100 dark:border-neutral-800">
            <div className="h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${(step / totalSteps) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {/* Loading State */}
          <AnimatePresence mode="wait">
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-8"
              >
                <div className="relative mb-8">
                  <div className="h-1 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                  <motion.div
                    className="absolute top-0 h-1 w-20 bg-gradient-to-r from-transparent via-white to-transparent opacity-60 rounded-full"
                    animate={{ left: ["0%", "100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                </div>

                <div className="text-center space-y-6">
                  <motion.div
                    key={loadingStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-4"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                      <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                        {loadingSteps[loadingStep]?.icon}
                      </motion.div>
                    </div>
                    <div>
                      <p className="text-lg font-medium">{loadingSteps[loadingStep]?.label}</p>
                      <p className="text-sm text-neutral-500 mt-1">
                        {t("stepOf") as string} {loadingStep + 1} {t("of") as string} {loadingSteps.length}
                      </p>
                    </div>
                  </motion.div>

                  <div className="flex justify-center gap-3 pt-4">
                    {currentColors.slice(0, 5).map((color, i) => (
                      <motion.div
                        key={i}
                        className="w-8 h-8 rounded-xl shadow-lg"
                        style={{ backgroundColor: color }}
                        animate={{ y: [0, -8, 0], scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step 1: Brand Name & Email */}
          {!isGenerating && step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="text-center mb-6">
                <Crown className="w-10 h-10 mx-auto mb-3 text-amber-500" />
                <h3 className="text-xl font-medium mb-1">{t("brandName") as string}</h3>
                <p className="text-sm text-neutral-500">{t("brandNameDescription") as string}</p>
              </div>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder={t("brandNamePlaceholder") as string}
                className="w-full px-4 py-4 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-neutral-400"
              />
              <div>
                <p className="text-xs text-neutral-500 mb-2">{t("yourEmail") as string}</p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailPlaceholder") as string}
                  className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder:text-neutral-400"
                />
              </div>
            </motion.div>
          )}

          {/* Step 2: Color Palette */}
          {!isGenerating && step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="text-center mb-6">
                <Palette className="w-10 h-10 mx-auto mb-3 text-amber-500" />
                <h3 className="text-xl font-medium mb-1">{t("colorPalette") as string}</h3>
                <p className="text-sm text-neutral-500">{t("colorPaletteDescription") as string}</p>
              </div>
              
              {/* Pre-defined palettes */}
              <div className="grid grid-cols-2 gap-3">
                {COLOR_PALETTES.map((palette, index) => (
                  <button
                    key={palette.name}
                    onClick={() => { setSelectedPalette(index); setUseCustomColors(false); }}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      !useCustomColors && selectedPalette === index
                        ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                        : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300"
                    }`}
                  >
                    <div className="flex gap-1 mb-2">
                      {palette.colors.map((color, i) => (
                        <div key={i} className="w-5 h-5 rounded-md" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                    <p className="text-xs font-medium">{palette.name}</p>
                  </button>
                ))}
              </div>

              {/* Custom colors */}
              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium">{t("customColors") as string}</p>
                  <button
                    onClick={addCustomColor}
                    disabled={customColors.length >= 6}
                    className="text-xs text-amber-600 hover:text-amber-700 disabled:opacity-50"
                  >
                    + {t("addColor") as string}
                  </button>
                </div>
                {customColors.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {customColors.map((color, i) => (
                      <div key={i} className="relative">
                        <input
                          type="color"
                          value={color}
                          onChange={(e) => updateCustomColor(i, e.target.value)}
                          className="w-10 h-10 rounded-lg cursor-pointer border-2 border-neutral-200"
                        />
                        <button
                          onClick={() => removeCustomColor(i)}
                          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 3: Mood & Style */}
          {!isGenerating && step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="text-center mb-6">
                <Heart className="w-10 h-10 mx-auto mb-3 text-amber-500" />
                <h3 className="text-xl font-medium mb-1">{t("moodStyle") as string}</h3>
                <p className="text-sm text-neutral-500">{t("moodStyleDescription") as string}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {moodStyles.map(({ key, nameKey, descKey }) => (
                  <button
                    key={key}
                    onClick={() => setMood(key)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      mood === key
                        ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                        : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${
                      mood === key ? "bg-amber-500 text-white" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"
                    }`}>
                      {MOOD_ICONS[key]}
                    </div>
                    <p className="font-medium text-sm">{t(nameKey as keyof typeof import("@/lib/translations").translations.en) as string}</p>
                    <p className="text-xs text-neutral-500">{t(descKey as keyof typeof import("@/lib/translations").translations.en) as string}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4: Upload */}
          {!isGenerating && step === 4 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="text-center mb-4">
                <Upload className="w-10 h-10 mx-auto mb-3 text-amber-500" />
                <h3 className="text-xl font-medium mb-1">{t("uploadTitle") as string}</h3>
                <p className="text-sm text-neutral-500">{t("uploadDescription") as string}</p>
              </div>

              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
                  preview
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                    : "border-neutral-200 dark:border-neutral-700 hover:border-amber-400"
                }`}
              >
                <input ref={fileInputRef} type="file" accept="image/*,video/*" onChange={handleFileChange} className="hidden" />
                {preview ? (
                  <div className="space-y-3">
                    {file?.type.startsWith("video/") ? (
                      <video src={preview} className="max-h-40 mx-auto rounded-lg" muted playsInline />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={preview} alt="Preview" className="max-h-40 mx-auto rounded-lg" />
                    )}
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">{file?.name}</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-center gap-4 text-neutral-400">
                      <ImageIcon className="w-8 h-8" />
                      <Film className="w-8 h-8" />
                    </div>
                    <p className="text-neutral-500">{t("dropzoneText") as string}</p>
                    <p className="text-xs text-neutral-400">{t("dropzoneHint") as string}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 5: Creative Effect & Format */}
          {!isGenerating && step === 5 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              {/* Output Type & Aspect Ratio */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-neutral-500 mb-2">{t("outputTitle") as string}</p>
                  <div className="flex gap-2">
                    {[{ type: "image" as const, icon: ImageIcon }, { type: "video" as const, icon: Film }].map(({ type, icon: Icon }) => (
                      <button
                        key={type}
                        onClick={() => setOutputType(type)}
                        className={`flex-1 p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                          outputType === type
                            ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                            : "border-neutral-200 dark:border-neutral-700"
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${outputType === type ? "text-amber-600" : "text-neutral-400"}`} />
                        <span className="text-xs font-medium">{t(type === "image" ? "stillImage" : "video") as string}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-neutral-500 mb-2">{t("aspectRatio") as string}</p>
                  <div className="flex gap-2">
                    {[
                      { ratio: "landscape" as const, icon: RectangleHorizontal, label: "16:9" },
                      { ratio: "portrait" as const, icon: RectangleVertical, label: "9:16" }
                    ].map(({ ratio, icon: Icon, label }) => (
                      <button
                        key={ratio}
                        onClick={() => setAspectRatio(ratio)}
                        className={`flex-1 p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 ${
                          aspectRatio === ratio
                            ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                            : "border-neutral-200 dark:border-neutral-700"
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${aspectRatio === ratio ? "text-amber-600" : "text-neutral-400"}`} />
                        <span className="text-xs font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Creative Styles */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-neutral-500">{t("creativeStyle") as string}</p>
                  <p className="text-xs text-amber-600 font-medium">{selectedStyles.length}/2</p>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {creativeStyles.map(({ key, nameKey, descKey }) => {
                    const isSelected = selectedStyles.includes(key);
                    return (
                      <button
                        key={key}
                        onClick={() => toggleStyle(key)}
                        className={`p-3 rounded-xl border-2 transition-all flex items-center gap-3 text-left ${
                          isSelected
                            ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                            : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isSelected ? "bg-amber-500 text-white" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"
                        }`}>
                          {CREATIVE_STYLE_ICONS[key]}
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium text-sm ${isSelected ? "text-amber-700 dark:text-amber-300" : ""}`}>
                            {t(nameKey as keyof typeof import("@/lib/translations").translations.en) as string}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {t(descKey as keyof typeof import("@/lib/translations").translations.en) as string}
                          </p>
                        </div>
                        {isSelected && <Check className="w-5 h-5 text-amber-500" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {error && !isGenerating && <p className="mt-4 text-sm text-red-500 text-center">{error}</p>}
        </div>

        {/* Footer */}
        {!isGenerating && (
          <div className="sticky bottom-0 flex items-center justify-between p-6 border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <button
              onClick={() => step > 1 && setStep(step - 1)}
              disabled={step === 1}
              className="px-4 py-2 text-sm text-neutral-500 hover:text-neutral-700 disabled:opacity-0 transition-all"
            >
              {t("back") as string}
            </button>
            
            {step < totalSteps ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl font-medium text-sm hover:bg-neutral-800 dark:hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {t("continue") as string}
              </button>
            ) : (
              <button
                onClick={handleGenerate}
                disabled={selectedStyles.length !== 2}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium text-sm hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                {t("generateVariants") as string}
              </button>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}


