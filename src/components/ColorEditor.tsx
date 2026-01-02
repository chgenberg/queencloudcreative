"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Pipette } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

type Props = {
  colors: string[];
  onChange: (colors: string[]) => void;
};

export default function ColorEditor({ colors, onChange }: Props) {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [newColor, setNewColor] = useState("#000000");
  const colorInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleColorChange = (index: number, newValue: string) => {
    const updated = [...colors];
    updated[index] = newValue;
    onChange(updated);
  };

  const handleRemoveColor = (index: number) => {
    if (colors.length <= 1) return;
    const updated = colors.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleAddColor = () => {
    if (colors.length >= 6) return;
    onChange([...colors, newColor]);
    setNewColor("#000000");
  };

  const openColorPicker = (index: number) => {
    colorInputRefs.current[index]?.click();
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-neutral-500">
          {t("extractedColors") as string}
        </p>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 font-medium"
        >
          {isEditing ? "✓" : t("editColors") as string}
        </button>
      </div>

      {/* Color swatches */}
      <div className="flex flex-wrap gap-2">
        {colors.map((color, i) => (
          <motion.div
            key={i}
            layout
            className="relative group"
          >
            {/* Hidden native color input */}
            <input
              ref={(el) => { colorInputRefs.current[i] = el; }}
              type="color"
              value={color}
              onChange={(e) => handleColorChange(i, e.target.value)}
              className="absolute opacity-0 w-0 h-0"
            />

            {/* Color swatch button */}
            <motion.button
              onClick={() => isEditing && openColorPicker(i)}
              className={`
                w-10 h-10 rounded-xl shadow-sm border-2 transition-all
                ${isEditing 
                  ? "border-neutral-300 dark:border-neutral-600 cursor-pointer hover:scale-110" 
                  : "border-white/20 cursor-default"
                }
              `}
              style={{ backgroundColor: color }}
              whileHover={isEditing ? { scale: 1.1 } : {}}
              whileTap={isEditing ? { scale: 0.95 } : {}}
              title={color}
            >
              {isEditing && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                  <Pipette className="w-4 h-4 text-white" />
                </span>
              )}
            </motion.button>

            {/* Remove button */}
            <AnimatePresence>
              {isEditing && colors.length > 1 && (
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  onClick={() => handleRemoveColor(i)}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        {/* Add color button */}
        <AnimatePresence>
          {isEditing && colors.length < 6 && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="flex items-center gap-1"
            >
              <input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="w-10 h-10 rounded-xl cursor-pointer border-2 border-dashed border-neutral-300 dark:border-neutral-600"
              />
              <button
                onClick={handleAddColor}
                className="h-10 px-3 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-dashed border-neutral-300 dark:border-neutral-600 rounded-xl hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                {t("addColor") as string}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* HEX input when editing */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              {colors.map((color, i) => (
                <input
                  key={i}
                  type="text"
                  value={color}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(val) || val === "") {
                      handleColorChange(i, val || "#");
                    }
                  }}
                  className="
                    w-20 px-2 py-1 text-xs font-mono
                    bg-neutral-100 dark:bg-neutral-800 
                    border border-neutral-200 dark:border-neutral-700
                    rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500
                  "
                  placeholder="#000000"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


