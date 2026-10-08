'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Minus, Clock, Flame, Check } from 'lucide-react';
import { MenuItem } from '@/types';
import { VegBadge } from './VegBadge';
import { useCartStore } from '@/store/useCartStore';

interface MenuItemCardProps {
  item: MenuItem;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  const { items, addItem, updateQuantity } = useCartStore();
  
  // Default to first variant if sizeVariants exist
  const [selectedVariant, setSelectedVariant] = useState<string>(
    item.sizeVariants && item.sizeVariants.length > 0 ? item.sizeVariants[0].name : ''
  );

  // Compute active price based on selected variant
  const currentPrice = item.sizeVariants && selectedVariant
    ? item.sizeVariants.find((v) => v.name === selectedVariant)?.price || item.price
    : item.price;

  // Composite cart ID
  const cartItemId = selectedVariant ? `${item.id}-${selectedVariant}` : item.id;
  const cartEntry = items.find((i) => i.id === cartItemId);
  const quantity = cartEntry ? cartEntry.quantity : 0;

  const isLowStock = item.remainingStock !== undefined && item.remainingStock > 0 && item.remainingStock <= 8;
  const isOutOfStock = !item.isAvailable || (item.remainingStock !== undefined && item.remainingStock <= 0);

  const handleAdd = () => {
    if (isOutOfStock) return;
    addItem(item, selectedVariant || undefined);
  };

  return (
    <div className={`zcafe-card rounded-2xl overflow-hidden flex flex-col justify-between group transition-all duration-300 ${
      isOutOfStock ? 'opacity-60 grayscale-[40%]' : ''
    }`}>
      {/* Top Media & Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-[#1E0D14]">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#230E16] via-transparent to-black/40" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          <VegBadge isVeg={item.isVeg} size="sm" className="bg-[#120A0C]/80 px-2 py-1 rounded-md backdrop-blur-sm" />
          {item.isBestseller && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#F7B52C] to-[#FF9F1C] text-[#120A0C] font-extrabold text-[10px] uppercase tracking-wider shadow-sm">
              <Flame className="w-3 h-3 fill-current" /> Bestseller
            </span>
          )}
          {item.tag && (
            <span className="px-2 py-0.5 rounded-full bg-[#5A1A2B]/90 text-[#FFF8EE] text-[10px] font-semibold border border-[#F7B52C]/30">
              {item.tag}
            </span>
          )}
        </div>

        {/* Stock / Out of stock indicator */}
        <div className="absolute top-3 right-3 z-10">
          {isOutOfStock ? (
            <span className="px-2.5 py-1 rounded-full bg-red-900/90 text-red-200 text-[11px] font-bold border border-red-500/40">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-900/90 text-amber-200 text-[10px] font-bold border border-amber-500/50 animate-pulse">
              Only {item.remainingStock} left!
            </span>
          ) : null}
        </div>

        {/* Prep Time pill */}
        <div className="absolute bottom-2 right-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#120A0C]/85 backdrop-blur-sm text-[11px] text-[#FFF8EE]/80">
          <Clock className="w-3 h-3 text-[#F7B52C]" />
          <span>{item.prepTimeMinutes} mins</span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-[#FFF8EE] text-base group-hover:text-[#F7B52C] transition-colors leading-snug">
            {item.name}
          </h3>
          <p className="text-xs text-[#FFF8EE]/70 line-clamp-2 mt-1 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Variants Selector (if applicable) */}
        {item.sizeVariants && item.sizeVariants.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-[#3E1220]">
            <div className="text-[11px] font-semibold text-[#FFF8EE]/60 uppercase tracking-wider mb-1.5">
              Choose Portion:
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {item.sizeVariants.map((variant) => (
                <button
                  key={variant.name}
                  type="button"
                  onClick={() => setSelectedVariant(variant.name)}
                  className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center justify-between border transition-all ${
                    selectedVariant === variant.name
                      ? 'bg-[#3E1220] border-[#F7B52C] text-[#F7B52C] shadow-sm'
                      : 'bg-[#180A0E] border-[#3E1220] text-[#FFF8EE]/70 hover:border-[#F7B52C]/40'
                  }`}
                >
                  <span className="truncate">{variant.name}</span>
                  <span className="text-[11px] font-bold">₹{variant.price}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Price & Add to Cart Action */}
        <div className="mt-4 pt-3 border-t border-[#3E1220] flex items-center justify-between">
          <div>
            <div className="text-xs text-[#FFF8EE]/50">Price</div>
            <div className="text-lg font-extrabold text-[#F7B52C] flex items-baseline">
              <span>₹{currentPrice}</span>
              {item.sizeVariants && (
                <span className="text-[11px] text-[#FFF8EE]/60 font-normal ml-1">
                  ({selectedVariant})
                </span>
              )}
            </div>
          </div>

          {/* Stepper / Add Button */}
          <div>
            {isOutOfStock ? (
              <button
                disabled
                className="px-3.5 py-1.5 rounded-full bg-[#2A151C] text-[#FFF8EE]/40 text-xs font-semibold cursor-not-allowed border border-[#3E1220]"
              >
                Unavailable
              </button>
            ) : quantity > 0 ? (
              <div className="flex items-center gap-2 bg-[#3E1220] border border-[#F7B52C]/60 rounded-full px-2 py-1 shadow-glow-gold">
                <button
                  type="button"
                  onClick={() => updateQuantity(cartItemId, -1)}
                  aria-label="Decrease quantity"
                  className="w-6 h-6 rounded-full bg-[#120A0C] text-[#F7B52C] hover:bg-[#F7B52C] hover:text-[#120A0C] flex items-center justify-center transition-colors font-bold text-sm"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-extrabold text-sm text-[#FFF8EE] min-w-[1.25rem] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity(cartItemId, 1)}
                  aria-label="Increase quantity"
                  className="w-6 h-6 rounded-full bg-[#120A0C] text-[#F7B52C] hover:bg-[#F7B52C] hover:text-[#120A0C] flex items-center justify-center transition-colors font-bold text-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAdd}
                className="px-4 py-1.5 rounded-full bg-gradient-to-r from-[#F7B52C] to-[#FF9F1C] text-[#120A0C] font-bold text-xs flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                ADD
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
