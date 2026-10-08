'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { VegBadge } from '@/components/VegBadge';
import { X, Clock, Plus, Minus, ShoppingBag, Sparkles, CheckCircle2, Flame, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function FoodDetailSheet() {
  const { activeItemForDetail, setActiveItemForDetail, addItem } = useCartStore();
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [isAdded, setIsAdded] = useState(false);
  const [spiceLevel, setSpiceLevel] = useState<'Mild' | 'Medium' | 'Spicy'>('Medium');

  if (!activeItemForDetail) return null;

  const item = activeItemForDetail;
  const currentSizeName = selectedSize || (item.sizeVariants ? item.sizeVariants[0].name : undefined);
  const activeVariant = item.sizeVariants?.find((v) => v.name === currentSizeName);
  const currentPrice = activeVariant ? activeVariant.price : item.price;

  // Determine if dish is spicy eligible
  const isSpicyDish = !item.isVeg || item.name.toLowerCase().includes('biryani') || item.name.toLowerCase().includes('65') || item.name.toLowerCase().includes('noodles');

  const handleAddToCart = () => {
    const finalNotes = [
      isSpicyDish ? `Spice: ${spiceLevel}` : '',
      notes.trim()
    ].filter(Boolean).join(' • ');

    for (let i = 0; i < quantity; i++) {
      addItem(item, currentSizeName, finalNotes || undefined);
    }
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      setActiveItemForDetail(null);
      setQuantity(1);
      setNotes('');
      setSelectedSize(undefined);
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
        {/* Backdrop click */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0" 
          onClick={() => setActiveItemForDetail(null)} 
        />

        {/* Bottom Sheet on Mobile / Centered Card on Tablet+ */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className="relative w-full sm:max-w-xl max-h-[90vh] overflow-y-auto rounded-t-[28px] sm:rounded-[28px] bg-[#FFF8EE] dark:bg-[#1D0E14] border border-[#5A1A2B]/10 dark:border-[#F7B52C]/25 shadow-2xl p-5 sm:p-7 text-[#2A0E17] dark:text-[#FFF8EE] z-10"
        >
          {/* Mobile Sheet Drag Indicator */}
          <div className="w-12 h-1.5 rounded-full bg-black/15 dark:bg-white/20 mx-auto mb-4 sm:hidden" />

          {/* Close button */}
          <button
            onClick={() => setActiveItemForDetail(null)}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 text-[#2A0E17] dark:text-[#FFF8EE] transition-colors z-20"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Hero Dish Image */}
          <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden mb-5 bg-[#F5EBE1] dark:bg-[#120A0C] border border-black/5 dark:border-white/10 shadow-inner">
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 100vw, 600px"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent sm:opacity-80" />

            {/* Badges on Top */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <VegBadge isVeg={item.isVeg} />
              {item.isBestseller && (
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-[#F7B52C] to-[#FFAF38] text-[#120A0C] shadow-md flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-current" /> Bestseller
                </span>
              )}
            </div>

            {/* Prep Time pill */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-xs text-white font-medium shadow-lg">
              <Clock className="w-3.5 h-3.5 text-[#F7B52C]" />
              <span>Ready in <strong>~{item.prepTimeMinutes || 10} min</strong></span>
            </div>
          </div>

          {/* Title & Price */}
          <div className="mb-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#5A1A2B] dark:text-[#FFF8EE] tracking-tight font-display">
                  {item.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#4F8F3A]">
                    <span className="w-2 h-2 rounded-full bg-[#4F8F3A] animate-pulse" />
                    Hot & Fresh Today
                  </span>
                  {item.dailyStock && (
                    <span className="text-xs text-[#E63946] font-semibold">
                      • Daily Batch Limited
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-black text-[#5A1A2B] dark:text-[#F7B52C]">
                  ₹{currentPrice}
                </span>
              </div>
            </div>

            <p className="mt-3 text-sm sm:text-base text-[#6E535C] dark:text-[#DCCBBD] leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Size Variants (if any) */}
          {item.sizeVariants && item.sizeVariants.length > 0 && (
            <div className="mb-4">
              <label className="block text-xs font-black uppercase tracking-wider text-[#5A1A2B] dark:text-[#F7B52C] mb-2">
                Choose Portion Size
              </label>
              <div className="grid grid-cols-2 gap-2">
                {item.sizeVariants.map((variant) => {
                  const isSelected = (selectedSize || item.sizeVariants![0].name) === variant.name;
                  return (
                    <button
                      key={variant.name}
                      type="button"
                      onClick={() => setSelectedSize(variant.name)}
                      className={`py-2.5 px-3.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-between border transition-all ${
                        isSelected
                          ? 'bg-[#F7B52C] text-[#120A0C] border-[#F7B52C] shadow-md'
                          : 'bg-white dark:bg-white/5 text-[#2A0E17] dark:text-[#FFF8EE] border-black/10 dark:border-white/10 hover:border-black/20'
                      }`}
                    >
                      <span>{variant.name}</span>
                      <span className="font-black">₹{variant.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Spice Level Selector */}
          {isSpicyDish && (
            <div className="mb-4">
              <label className="block text-xs font-black uppercase tracking-wider text-[#5A1A2B] dark:text-[#F7B52C] mb-2">
                Spice Level Preference
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Mild', 'Medium', 'Spicy'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setSpiceLevel(lvl)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 border transition-all ${
                      spiceLevel === lvl
                        ? 'bg-[#E63946] text-white border-[#E63946] shadow-sm'
                        : 'bg-white dark:bg-white/5 text-[#2A0E17] dark:text-[#FFF8EE] border-black/10 dark:border-white/10'
                    }`}
                  >
                    <span>{lvl === 'Spicy' ? '🌶🌶🌶' : lvl === 'Medium' ? '🌶🌶' : '🌶'}</span>
                    <span>{lvl}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cooking Notes */}
          <div className="mb-5">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6E535C] dark:text-[#DCCBBD] mb-1.5">
              Cooking Instructions (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., Less sugar, extra raita, well-cooked..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-black/10 dark:border-white/15 text-sm text-[#2A0E17] dark:text-[#FFF8EE] placeholder-black/40 dark:placeholder-white/40 focus:outline-none focus:border-[#5A1A2B] dark:focus:border-[#F7B52C]"
            />
          </div>

          {/* Quantity Stepper & Add Button */}
          <div className="flex items-center gap-3 pt-3 border-t border-black/10 dark:border-white/10">
            {/* Stepper */}
            <div className="flex items-center rounded-2xl bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 p-1 shrink-0">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-[#2A0E17] dark:text-white hover:bg-black/10 dark:hover:bg-white/15 transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-9 text-center font-black text-base text-[#5A1A2B] dark:text-[#F7B52C]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-[#2A0E17] dark:text-white hover:bg-black/10 dark:hover:bg-white/15 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAdded}
              className="flex-1 py-3.5 px-6 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 bg-gradient-to-r from-[#F7B52C] via-[#FFAF38] to-[#FF9F1C] text-[#120A0C] shadow-lg hover:brightness-105 active:scale-[0.98] transition-all min-h-[48px]"
            >
              {isAdded ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-[#120A0C]" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add to Order • ₹{currentPrice * quantity}</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
