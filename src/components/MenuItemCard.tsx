'use client';

import React, { useState } from 'react';
import { Plus, Minus, Clock, Flame, Sparkles, Eye } from 'lucide-react';
import { MenuItem } from '@/types';
import { VegBadge } from './VegBadge';
import { useCartStore } from '@/store/useCartStore';

interface MenuItemCardProps {
  item: MenuItem;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  const { items, addItem, updateQuantity, setActiveItemForDetail } = useCartStore();
  
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
      className={`relative zcafe-card rounded-3xl overflow-hidden flex flex-col justify-between group transition-all duration-300 cursor-pointer bg-gradient-to-b from-[#1f0e15] to-[#120A0C] border border-white/10 hover:border-[#F7B52C]/50 hover:shadow-[0_15px_40px_rgba(247,181,44,0.15)] hover:-translate-y-1.5 ${
        isOutOfStock ? 'opacity-60 grayscale-[40%]' : ''
      }`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Top Media & 3D Depth Floating Visual */}
      <div className="relative h-52 w-full overflow-hidden bg-[#1E0D14] flex items-center justify-center">
        {/* Soft Radial Backlight */}
        <div className="absolute inset-0 bg-radial from-[#F7B52C]/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1f0e15] via-transparent to-black/50" />

        {/* Hover "Quick View" pill */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
          <span className="px-3.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-[#F7B52C]/60 text-[#F7B52C] font-bold text-xs flex items-center gap-1.5 shadow-xl">
            <Eye className="w-3.5 h-3.5" />
            3D View & Details
          </span>
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          <VegBadge isVeg={item.isVeg} size="sm" className="bg-[#120A0C]/85 px-2 py-1 rounded-lg backdrop-blur-md border border-white/10" />
          {item.isBestseller && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#F7B52C] to-[#FF9F1C] text-[#120A0C] font-black text-[10px] uppercase tracking-wider shadow-md">
              <Flame className="w-3 h-3 fill-current" /> Bestseller
            </span>
          )}
          {item.tag && (
            <span className="px-2.5 py-0.5 rounded-full bg-[#5A1A2B]/90 text-[#FFF8EE] text-[10px] font-bold border border-[#F7B52C]/30 backdrop-blur-sm">
              {item.tag}
            </span>
          )}
        </div>

        {/* Stock status indicator */}
        <div className="absolute top-3 right-3 z-10">
          {isOutOfStock ? (
            <span className="px-2.5 py-1 rounded-full bg-red-950/90 text-red-300 text-[11px] font-bold border border-red-500/50 backdrop-blur-sm">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-950/90 text-amber-300 text-[10px] font-bold border border-amber-500/50 animate-pulse backdrop-blur-sm">
              Only {item.remainingStock} left!
            </span>
          ) : null}
        </div>

        {/* Prep Time pill */}
        <div className="absolute bottom-2.5 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#120A0C]/90 backdrop-blur-md text-[11px] text-[#FFF8EE]/90 border border-white/10 font-medium shadow-md">
          <Clock className="w-3 h-3 text-[#F7B52C]" />
          <span>{item.prepTimeRange || `${item.prepTimeMinutes} mins`}</span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-extrabold text-[#FFF8EE] text-base group-hover:text-[#F7B52C] transition-colors leading-snug tracking-tight">
            {item.name}
          </h3>
          <p className="text-xs text-[#FFF8EE]/70 line-clamp-2 mt-1.5 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Variants Selector (if applicable) */}
        {item.sizeVariants && item.sizeVariants.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-white/10" onClick={(e) => e.stopPropagation()}>
            <div className="text-[10px] font-bold text-[#FFF8EE]/60 uppercase tracking-wider mb-1.5">
              Portion Size:
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {item.sizeVariants.map((variant) => (
                <button
                  key={variant.name}
                  type="button"
                  onClick={() => setSelectedVariant(variant.name)}
                  className={`px-2 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between border transition-all ${
                    selectedVariant === variant.name
                      ? 'bg-[#F7B52C] border-[#F7B52C] text-[#120A0C] shadow-sm'
                      : 'bg-white/5 border-white/10 text-[#FFF8EE]/80 hover:border-white/30'
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
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-[#FFF8EE]/50">Price</div>
            <div className="text-xl font-black text-[#F7B52C] flex items-baseline">
              <span>₹{currentPrice}</span>
              {item.sizeVariants && (
                <span className="text-[11px] text-[#FFF8EE]/60 font-normal ml-1">
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
                className="px-3.5 py-1.5 rounded-full bg-[#2A151C] text-[#FFF8EE]/40 text-xs font-semibold cursor-not-allowed border border-white/10"
              >
                Unavailable
              </button>
            ) : quantity > 0 ? (
              <div className="flex items-center gap-2 bg-[#2D121B] border border-[#F7B52C] rounded-full px-2 py-1 shadow-[0_0_12px_rgba(247,181,44,0.35)]">
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
                className="px-4 py-2 rounded-2xl bg-gradient-to-r from-[#F7B52C] to-[#FF9F1C] text-[#120A0C] font-black text-xs flex items-center gap-1.5 shadow-[0_4px_15px_rgba(247,181,44,0.3)] hover:scale-105 active:scale-95 transition-all"
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
