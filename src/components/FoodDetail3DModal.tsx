'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';
import { VegBadge } from '@/components/VegBadge';
import { X, Clock, Plus, Minus, ShoppingBag, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function FoodDetail3DModal() {
  const { activeItemForDetail, setActiveItemForDetail, addItem } = useCartStore();
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  if (!activeItemForDetail) return null;

  const item = activeItemForDetail;
  const currentSizeName = selectedSize || (item.sizeVariants ? item.sizeVariants[0].name : undefined);
  const activeVariant = item.sizeVariants?.find((v) => v.name === currentSizeName);
  const currentPrice = activeVariant ? activeVariant.price : item.price;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(item, currentSizeName, notes);
    }
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      setActiveItemForDetail(null);
      setQuantity(1);
      setNotes('');
    }, 700);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
        {/* Backdrop click */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0" 
          onClick={() => setActiveItemForDetail(null)} 
        />

        {/* 3D Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#251017] to-[#120A0C] border border-[#F7B52C]/30 shadow-[0_20px_60px_rgba(0,0,0,0.85)] p-6 sm:p-8 text-[#FFF8EE]"
          style={{ perspective: '1000px' }}
        >
          {/* Close button */}
          <button
            onClick={() => setActiveItemForDetail(null)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#FFF8EE] transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* 3D Floating Food Visual Container */}
          <div className="relative w-full h-60 sm:h-72 rounded-2xl overflow-hidden mb-6 group bg-gradient-to-b from-[#3E1220]/60 to-black/60 border border-white/10 flex items-center justify-center">
            {/* Ambient Radial Glow */}
            <div className="absolute inset-0 bg-radial from-[#F7B52C]/20 via-transparent to-transparent opacity-80" />

            {/* Popping 3D Image with depth */}
            <motion.div
              whileHover={{ scale: 1.05, rotateZ: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="relative w-full h-full"
            >
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 100vw, 600px"
                className="object-cover transition-transform duration-500 filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]"
              />
            </motion.div>

            {/* Badges on Visual */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <VegBadge isVeg={item.isVeg} />
              {item.tag && (
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#F7B52C] to-[#FF9F1C] text-[#120A0C] shadow-md">
                  {item.tag}
                </span>
              )}
            </div>

            {/* Prep Time pill */}
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#120A0C]/85 backdrop-blur-md border border-white/15 text-xs text-[#FFF8EE] font-medium shadow-lg">
              <Clock className="w-3.5 h-3.5 text-[#F7B52C]" />
              <span>Prep: <strong>{item.prepTimeRange || `${item.prepTimeMinutes} min`}</strong></span>
            </div>
          </div>

          {/* Food Details Header */}
          <div className="mb-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FFF8EE] tracking-tight">
                  {item.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Available Fresh
                  </span>
                  {item.remainingStock !== undefined && item.remainingStock <= 15 && (
                    <span className="text-xs text-amber-300 font-medium">
                      • Only {item.remainingStock} plates left today
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-black text-[#F7B52C] drop-shadow">
                  ₹{currentPrice}
                </span>
              </div>
            </div>

            <p className="mt-3 text-sm sm:text-base text-[#FFF8EE]/80 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Size Variants (if any) */}
          {item.sizeVariants && item.sizeVariants.length > 0 && (
            <div className="mb-5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#F7B52C] mb-2">
                Select Portion Size
              </label>
              <div className="grid grid-cols-2 gap-2">
                {item.sizeVariants.map((variant) => {
                  const isSelected = (selectedSize || item.sizeVariants![0].name) === variant.name;
                  return (
                    <button
                      key={variant.name}
                      type="button"
                      onClick={() => setSelectedSize(variant.name)}
                      className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-between border transition-all ${
                        isSelected
                          ? 'bg-[#F7B52C] text-[#120A0C] border-[#F7B52C] shadow-[0_0_15px_rgba(247,181,44,0.4)]'
                          : 'bg-white/5 text-[#FFF8EE] border-white/10 hover:border-white/25'
                      }`}
                    >
                      <span>{variant.name}</span>
                      <span>₹{variant.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ingredients Breakdown */}
          {item.ingredients && item.ingredients.length > 0 && (
            <div className="mb-5 p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#F7B52C]" />
                Fresh Ingredients
              </span>
              <div className="flex flex-wrap gap-1.5">
                {item.ingredients.map((ing) => (
                  <span
                    key={ing}
                    className="px-2.5 py-1 rounded-lg text-xs bg-white/10 text-[#FFF8EE]/90 border border-white/5"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Cooking Notes */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#FFF8EE]/70 mb-1.5">
              Special Cooking Instructions (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., Less spicy, extra raita, less sugar..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-sm text-[#FFF8EE] placeholder-white/35 focus:outline-none focus:border-[#F7B52C]"
            />
          </div>

          {/* Quantity & Add to Cart Action */}
          <div className="flex items-center gap-4 pt-2 border-t border-white/10">
            {/* Quantity Stepper */}
            <div className="flex items-center rounded-2xl bg-white/10 border border-white/15 p-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-9 text-center font-bold text-base text-[#F7B52C]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAdded}
              className="flex-1 py-3.5 px-6 rounded-2xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 bg-gradient-to-r from-[#F7B52C] via-[#FF9F1C] to-[#F7B52C] text-[#120A0C] shadow-[0_10px_30px_rgba(247,181,44,0.4)] hover:brightness-110 active:scale-[0.98] transition-all"
            >
              {isAdded ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-950" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add to Cart • ₹{currentPrice * quantity}</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
