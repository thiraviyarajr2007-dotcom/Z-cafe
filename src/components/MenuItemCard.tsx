'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plus, Minus, Clock, Flame, Eye, Sparkles } from 'lucide-react';
import { MenuItem } from '@/types';
import { VegBadge } from './VegBadge';
import { useCartStore } from '@/store/useCartStore';
import { DEFAULT_BLUR_DATA_URL } from '@/data/menu';

interface MenuItemCardProps {
  item: MenuItem;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  const { items, addItem, updateQuantity, setActiveItemForDetail } = useCartStore();
  const [imgError, setImgError] = useState(false);
  
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

  const isLowStock = item.remainingStock !== undefined && item.remainingStock > 0 && item.remainingStock <= 15;
  const isOutOfStock = !item.isAvailable || (item.remainingStock !== undefined && item.remainingStock <= 0);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem(item, selectedVariant || undefined);
  };

  const handleOpenDetail = () => {
    setActiveItemForDetail(item);
  };

  return (
    <div 
      onClick={handleOpenDetail}
      className={`relative zcafe-card rounded-3xl overflow-hidden flex flex-col justify-between group transition-all duration-300 cursor-pointer border border-[#5A1A2B]/10 dark:border-white/10 hover:border-[#F7B52C] dark:hover:border-[#F7B52C] shadow-sm hover:shadow-xl hover:-translate-y-1.5 ${
        isOutOfStock ? 'opacity-60 grayscale-[40%]' : ''
      }`}
    >
      {/* Top Media: High Quality Visual with graceful emoji gradient fallback */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-gradient-to-br from-[#FFF0DB] to-[#F5EBE1] dark:from-[#251017] dark:to-[#120A0C] flex items-center justify-center">
        
        {!imgError ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
            className="object-cover group-hover:scale-108 transition-transform duration-700"
            placeholder="blur"
            blurDataURL={item.blurDataURL || DEFAULT_BLUR_DATA_URL}
            onError={() => setImgError(true)}
          />
        ) : (
          /* Graceful Warm Fallback if image file is pending generation */
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <span className="text-5xl mb-2 filter drop-shadow group-hover:scale-110 transition-transform">
              {item.emoji || (item.isVeg ? '🥗' : '🍗')}
            </span>
            <span className="text-xs font-black text-[#5A1A2B] dark:text-[#F7B52C]">
              {item.name}
            </span>
          </div>
        )}

        {/* Subtle Dark Gradient Overlay for Badges readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        {/* Hover "Quick View" pill */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
          <span className="px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-[#F7B52C]/60 text-[#F7B52C] font-black text-xs flex items-center gap-1.5 shadow-xl">
            <Eye className="w-3.5 h-3.5" />
            Quick View &amp; Spice
          </span>
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          <VegBadge isVeg={item.isVeg} size="sm" className="bg-white/90 dark:bg-black/80 px-2 py-0.5 rounded-md backdrop-blur-md shadow-sm" />
          
          {item.isBestseller && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#F7B52C] to-[#FFAF38] text-[#120A0C] font-black text-[10px] uppercase tracking-wider shadow-md">
              <Flame className="w-3 h-3 fill-current" /> Bestseller
            </span>
          )}

          {item.isSpicy && (
            <span className="px-2 py-0.5 rounded-full bg-[#E63946] text-white text-[10px] font-black tracking-wider shadow-sm flex items-center gap-0.5">
              <span>🌶</span> Spicy
            </span>
          )}

          {item.tag && !item.isBestseller && (
            <span className="px-2 py-0.5 rounded-full bg-[#5A1A2B]/90 text-[#FFF8EE] text-[10px] font-extrabold border border-white/20 backdrop-blur-sm">
              {item.tag}
            </span>
          )}
        </div>

        {/* Stock status indicator */}
        <div className="absolute top-3 right-3 z-10">
          {isOutOfStock ? (
            <span className="px-2.5 py-0.5 rounded-full bg-red-950/90 text-red-300 text-[10px] font-black border border-red-500/50 backdrop-blur-sm">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-black shadow-md animate-pulse">
              Only {item.remainingStock} left!
            </span>
          ) : null}
        </div>

        {/* Prep Time pill */}
        <div className="absolute bottom-2.5 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[11px] text-white border border-white/10 font-bold shadow-md">
          <Clock className="w-3 h-3 text-[#F7B52C]" />
          <span>Ready in ~{item.prepTimeMinutes}m</span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-1">
            <h3 className="font-black text-[#5A1A2B] dark:text-[#FFF8EE] text-base group-hover:text-[#E63946] dark:group-hover:text-[#F7B52C] transition-colors leading-snug tracking-tight font-display">
              {item.name}
            </h3>
          </div>
          {item.tamilName && (
            <p className="text-[11px] text-[#6E535C] dark:text-[#F7B52C]/80 font-bold -mt-0.5 mb-1">
              {item.tamilName}
            </p>
          )}
          <p className="text-xs text-[#6E535C] dark:text-[#DCCBBD] line-clamp-2 mt-1 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Portion Selector (if applicable) */}
        {item.sizeVariants && item.sizeVariants.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-black/5 dark:border-white/10" onClick={(e) => e.stopPropagation()}>
            <div className="text-[10px] font-extrabold text-[#6E535C] dark:text-white/60 uppercase tracking-wider mb-1.5">
              Portion Size:
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {item.sizeVariants.map((variant) => (
                <button
                  key={variant.name}
                  type="button"
                  onClick={() => setSelectedVariant(variant.name)}
                  className={`px-2 py-1.5 rounded-xl text-xs font-black flex items-center justify-between border transition-all ${
                    selectedVariant === variant.name
                      ? 'bg-[#F7B52C] border-[#F7B52C] text-[#120A0C] shadow-sm'
                      : 'bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 text-[#2A0E17] dark:text-[#FFF8EE]/80 hover:border-black/25'
                  }`}
                >
                  <span className="truncate">{variant.name}</span>
                  <span className="text-[11px]">₹{variant.price}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Price & Add to Cart Action */}
        <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-[#6E535C] dark:text-white/50">Price</div>
            <div className="text-xl font-black text-[#5A1A2B] dark:text-[#F7B52C] flex items-baseline">
              <span>₹{currentPrice}</span>
              {item.sizeVariants && (
                <span className="text-[10px] text-[#6E535C] dark:text-white/60 font-semibold ml-1">
                  ({selectedVariant})
                </span>
              )}
            </div>
          </div>

          {/* Stepper / Add Button */}
          <div onClick={(e) => e.stopPropagation()}>
            {isOutOfStock ? (
              <button
                disabled
                className="px-3 py-1.5 rounded-full bg-black/10 dark:bg-white/10 text-[#2A0E17]/40 dark:text-white/40 text-xs font-bold cursor-not-allowed"
              >
                Sold Out
              </button>
            ) : quantity > 0 ? (
              <div className="flex items-center gap-1.5 bg-[#FFF0DB] dark:bg-[#251017] border border-[#F7B52C] rounded-full px-2 py-1 shadow-sm">
                <button
                  type="button"
                  onClick={() => updateQuantity(cartItemId, -1)}
                  aria-label="Decrease quantity"
                  className="w-7 h-7 rounded-full bg-[#5A1A2B] dark:bg-[#120A0C] text-[#F7B52C] hover:bg-[#F7B52C] hover:text-[#120A0C] flex items-center justify-center transition-colors font-bold text-sm"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-black text-sm text-[#5A1A2B] dark:text-[#FFF8EE] min-w-[1.25rem] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantity(cartItemId, 1)}
                  aria-label="Increase quantity"
                  className="w-7 h-7 rounded-full bg-[#5A1A2B] dark:bg-[#120A0C] text-[#F7B52C] hover:bg-[#F7B52C] hover:text-[#120A0C] flex items-center justify-center transition-colors font-bold text-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAdd}
                className="px-4 py-2 rounded-2xl bg-gradient-to-r from-[#F7B52C] to-[#FFAF38] text-[#120A0C] font-black text-xs flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-all min-h-[40px]"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                ADD
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
