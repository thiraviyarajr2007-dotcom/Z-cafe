'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Clock, 
  Tag, 
  Sparkles, 
  ShoppingBag, 
  AlertCircle,
  CheckCircle2,
  Phone,
  User,
  GraduationCap,
  MessageSquare,
  Users
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { VegBadge } from './VegBadge';
import { RazorpayModal } from './RazorpayModal';
import { PICKUP_SLOTS } from '@/data/menu';

const QUICK_NOTES = ['Less spicy', 'Extra gravy', 'Less sugar', 'No onions', 'Serve piping hot'];

export const CartDrawer: React.FC = () => {
  const router = useRouter();
  const {
    items,
    isOpen,
    setIsOpen,
    removeItem,
    updateQuantity,
    updateNotes,
    clearCart,
    pickupSlot,
    pickupSlotId,
    setPickupSlot,
    customerName,
    customerPhone,
    studentId,
    department,
    studentUser,
    setCustomerInfo,
    couponCode,
    discount,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getGst,
    getTotal,
  } = useCartStore();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ message: string; isError?: boolean } | null>(null);
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const subtotal = getSubtotal();
  const gst = getGst();
  const total = getTotal();

  // Check if items include Biryani or heavy items that need prep time
  const hasHeavyItem = items.some(
    (i) => i.name.toLowerCase().includes('biryani') || i.name.toLowerCase().includes('noodles')
  );

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const res = useCartStore.getState().applyCoupon(inputCoupon);
    setCouponFeedback({ message: res.message, isError: !res.success });
  };

  const handleProceedToPayment = () => {
    if (!customerName.trim()) {
      setFormError('Please enter your full name for counter pickup');
      return;
    }
    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setFormError('Please enter a valid 10-digit mobile number for QR token');
      return;
    }
    setFormError('');
    setShowCheckoutModal(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-gradient-to-b from-[#220e15] to-[#120A0C] border-l border-[#F7B52C]/30 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col text-[#FFF8EE]">
            {/* Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#19090e]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#F7B52C]/20 text-[#F7B52C]">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-extrabold text-lg text-[#FFF8EE] flex items-center gap-2">
                    Pre-Order Cart
                    <span className="px-2 py-0.5 rounded-full text-xs bg-[#F7B52C] text-[#120A0C] font-black">
                      {items.reduce((acc, i) => acc + i.quantity, 0)}
                    </span>
                  </h2>
                  <p className="text-[11px] text-[#FFF8EE]/60">Skip the college break counter rush</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 text-[#FFF8EE]/70 hover:text-[#FFF8EE] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {items.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-white/5 flex items-center justify-center text-[#F7B52C]/40 mb-4 border border-white/10">
                    <ShoppingBag className="w-10 h-10" />
                  </div>
                  <h3 className="text-lg font-bold text-[#FFF8EE]">Your Cart is Empty</h3>
                  <p className="text-xs text-[#FFF8EE]/60 max-w-xs mx-auto mt-1">
                    Select your favorite breakfast, biryani, evening snacks, or fresh juices before the break begins!
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      router.push('/menu');
                    }}
                    className="mt-6 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#F7B52C] to-[#FF9F1C] text-[#120A0C] font-extrabold text-xs shadow-lg hover:scale-105 transition-all"
                  >
                    Browse Canteen Menu
                  </button>
                </div>
              ) : (
                <>
                  {/* Item List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#FFF8EE]/60 uppercase tracking-wider font-bold">
                      <span>Selected Items</span>
                      <button
                        type="button"
                        onClick={clearCart}
                        className="text-red-400 hover:text-red-300 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Clear All
                      </button>
                    </div>

                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2 hover:border-white/20 transition-all"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-[#120A0C]">
                              {item.image ? (
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  sizes="48px"
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs">🍽️</div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <VegBadge isVeg={item.isVeg} size="sm" />
                                <h4 className="font-bold text-sm text-[#FFF8EE] leading-snug truncate">
                                  {item.name}
                                </h4>
                              </div>
                              {item.selectedSize && (
                                <span className="inline-block text-[11px] text-[#F7B52C] font-semibold mt-0.5">
                                  {item.selectedSize}
                                </span>
                              )}
                              <div className="text-xs font-bold text-[#FFF8EE]/80 mt-0.5">
                                ₹{item.price} each
                              </div>
                            </div>
                          </div>

                          {/* Stepper */}
                          <div className="flex items-center gap-1.5 bg-[#120A0C] border border-white/15 rounded-xl px-2 py-1">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, -1)}
                              className="text-[#F7B52C] hover:text-white p-0.5"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-bold text-xs text-[#FFF8EE] w-5 text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="text-[#F7B52C] hover:text-white p-0.5"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Notes snippet or input */}
                        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                          {editingNotesId === item.id ? (
                            <div className="w-full space-y-1.5">
                              <input
                                type="text"
                                placeholder="e.g. less spicy, extra gravy..."
                                defaultValue={item.notes || ''}
                                onBlur={(e) => {
                                  updateNotes(item.id, e.target.value);
                                  setEditingNotesId(null);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    updateNotes(item.id, (e.target as any).value);
                                    setEditingNotesId(null);
                                  }
                                }}
                                autoFocus
                                className="w-full px-2.5 py-1 rounded-lg bg-black/50 border border-[#F7B52C] text-xs text-white focus:outline-none"
                              />
                              <div className="flex flex-wrap gap-1">
                                {QUICK_NOTES.map((qn) => (
                                  <button
                                    key={qn}
                                    type="button"
                                    onClick={() => {
                                      updateNotes(item.id, qn);
                                      setEditingNotesId(null);
                                    }}
                                    className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[10px] text-white/80"
                                  >
                                    + {qn}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => setEditingNotesId(item.id)}
                                className="text-white/60 hover:text-[#F7B52C] flex items-center gap-1"
                              >
                                <MessageSquare className="w-3 h-3" />
                                {item.notes ? (
                                  <span className="text-[#F7B52C] truncate max-w-[200px]">
                                    Note: {item.notes}
                                  </span>
                                ) : (
                                  <span>+ Add kitchen note</span>
                                )}
                              </button>
                              <span className="font-extrabold text-sm text-[#F7B52C]">
                                ₹{item.price * item.quantity}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* SMART PICKUP SLOTS & CROWD MANAGEMENT */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-[#F7B52C]" />
                        <span className="text-xs font-black uppercase tracking-wider text-[#F7B52C]">
                          Choose Pickup Slot
                        </span>
                      </div>
                      <span className="text-[10px] text-white/50">Max 20 per slot</span>
                    </div>

                    <p className="text-[11px] text-white/70">
                      Cap on orders per slot prevents crowd surges during break times.
                    </p>

                    {/* Slot selector grid */}
                    <div className="space-y-1.5">
                      {PICKUP_SLOTS.map((slot) => {
                        const isSelected = pickupSlot === slot.label;
                        const isFull = slot.status === 'full' || slot.booked >= slot.capacity;
                        const availableSpaces = Math.max(0, slot.capacity - slot.booked);

                        return (
                          <button
                            key={slot.id}
                            type="button"
                            disabled={isFull}
                            onClick={() => setPickupSlot(slot.label, slot.id)}
                            className={`w-full p-2.5 rounded-xl text-left border flex items-center justify-between transition-all ${
                              isSelected
                                ? 'bg-[#F7B52C] text-[#120A0C] border-[#F7B52C] font-bold shadow-[0_0_12px_rgba(247,181,44,0.35)]'
                                : isFull
                                ? 'bg-red-950/20 text-white/35 border-red-500/20 cursor-not-allowed'
                                : 'bg-black/30 text-white/90 border-white/10 hover:border-white/30'
                            }`}
                          >
                            <div className="flex flex-col">
                              <span className="text-xs font-extrabold flex items-center gap-1.5">
                                {slot.label}
                                {slot.breakTag && (
                                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                                    isSelected ? 'bg-black/20 text-black' : 'bg-white/10 text-[#F7B52C]'
                                  }`}>
                                    {slot.breakTag}
                                  </span>
                                )}
                              </span>
                            </div>

                            <div className="text-[11px] font-bold">
                              {isFull ? (
                                <span className="text-rose-400 flex items-center gap-1">
                                  🔴 Fully Booked
                                </span>
                              ) : availableSpaces <= 6 ? (
                                <span className={isSelected ? 'text-black' : 'text-amber-400'}>
                                  🟡 {availableSpaces} spaces left
                                </span>
                              ) : (
                                <span className={isSelected ? 'text-black' : 'text-emerald-400'}>
                                  🟢 {availableSpaces} spaces
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {hasHeavyItem && (
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-2 text-[11px] text-amber-200">
                        <AlertCircle className="w-3.5 h-3.5 text-[#F7B52C] shrink-0" />
                        <span>Biryani & special items take ~10 min slow dum prep.</span>
                      </div>
                    )}
                  </div>

                  {/* Student / Customer Pickup Info */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <span className="text-xs font-black uppercase tracking-wider text-white/80 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-[#F7B52C]" />
                      Student Pickup Verification
                    </span>

                    <div className="space-y-2">
                      <div>
                        <input
                          type="text"
                          placeholder="Student Name *"
                          value={customerName}
                          onChange={(e) => setCustomerInfo(e.target.value, customerPhone, studentId, department)}
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#F7B52C]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Student ID (RATH2024CS042)"
                          value={studentId}
                          onChange={(e) => setCustomerInfo(customerName, customerPhone, e.target.value, department)}
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs font-mono text-white placeholder-white/30 focus:outline-none focus:border-[#F7B52C]"
                        />
                        <input
                          type="tel"
                          placeholder="WhatsApp Phone (10 digits) *"
                          value={customerPhone}
                          onChange={(e) => setCustomerInfo(customerName, e.target.value, studentId, department)}
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#F7B52C]"
                        />
                      </div>
                    </div>

                    {formError && (
                      <p className="text-xs text-red-400 font-bold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {formError}
                      </p>
                    )}
                  </div>

                  {/* Coupon Code Section */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <span className="text-xs font-black uppercase tracking-wider text-white/80 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#F7B52C]" />
                      Campus Coupon
                    </span>

                    {couponCode ? (
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs">
                        <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" />
                          Code {couponCode} applied (-₹{discount})
                        </span>
                        <button
                          type="button"
                          onClick={removeCoupon}
                          className="text-red-400 hover:text-red-300 font-bold text-[11px]"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Try COLLEGE10 or ZCAFE50"
                          value={inputCoupon}
                          onChange={(e) => setInputCoupon(e.target.value)}
                          className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#F7B52C]"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#FFF8EE] text-xs font-bold border border-white/15"
                        >
                          Apply
                        </button>
                      </form>
                    )}

                    {couponFeedback && (
                      <p className={`text-[11px] font-semibold ${couponFeedback.isError ? 'text-red-400' : 'text-emerald-400'}`}>
                        {couponFeedback.message}
                      </p>
                    )}
                  </div>

                  {/* Bill Summary */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs">
                    <div className="flex justify-between text-white/70">
                      <span>Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-400 font-semibold">
                        <span>Coupon Discount</span>
                        <span>-₹{discount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-white/70">
                      <span>Canteen GST (5%)</span>
                      <span>₹{gst}</span>
                    </div>
                    <div className="pt-2 border-t border-white/10 flex justify-between text-base font-black text-[#F7B52C]">
                      <span>Grand Total</span>
                      <span>₹{total}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer Checkout CTA */}
            {items.length > 0 && (
              <div className="p-5 border-t border-white/10 bg-[#16080d] space-y-3">
                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  className="w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base flex items-center justify-between bg-gradient-to-r from-[#F7B52C] via-[#FF9F1C] to-[#F7B52C] text-[#120A0C] shadow-[0_10px_35px_rgba(247,181,44,0.4)] hover:brightness-110 active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    <span>Proceed to Pay & Get QR</span>
                  </div>
                  <span className="text-base font-black">₹{total}</span>
                </button>
                <p className="text-[11px] text-center text-white/50">
                  Instant QR code token generated upon payment confirmation.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Razorpay / Mock Payment Modal */}
      {showCheckoutModal && (
        <RazorpayModal
          onClose={() => setShowCheckoutModal(false)}
          onSuccess={(orderId) => {
            setShowCheckoutModal(false);
            setIsOpen(false);
            clearCart();
            router.push(`/orders/${orderId}`);
          }}
        />
      )}
    </>
  );
};
