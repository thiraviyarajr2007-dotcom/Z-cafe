'use client';

import React, { useState } from 'react';
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
  MessageSquare
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { VegBadge } from './VegBadge';
import { RazorpayModal } from './RazorpayModal';

const PRESET_SLOTS = [
  'ASAP (10-15 mins)',
  'In 20 mins',
  'In 30 mins',
  'In 45 mins',
  'In 1 hour',
];

const QUICK_NOTES = ['Less spicy', 'Extra gravy', 'Less sugar', 'No onions', 'Serve hot'];

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
    setPickupSlot,
    customerName,
    customerPhone,
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
  const [phoneError, setPhoneError] = useState('');

  if (!isOpen) return null;

  const subtotal = getSubtotal();
  const gst = getGst();
  const total = getTotal();

  // Check if items include Biryani or heavy starters that need more prep time
  const hasBiryaniOrStarter = items.some(
    (i) => i.name.toLowerCase().includes('biryani') || i.name.toLowerCase().includes('lollipop')
  );

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const res = useCartStore.getState().applyCoupon(inputCoupon);
    setCouponFeedback({ message: res.message, isError: !res.success });
  };

  const handleProceedToPayment = () => {
    if (!customerName.trim()) {
      setPhoneError('Please enter your name for pickup');
      return;
    }
    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setPhoneError('Please enter a valid 10-digit mobile number');
      return;
    }
    setPhoneError('');
    setShowCheckoutModal(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-[#160B0E] border-l border-[#3E1220] text-[#FFF8EE] shadow-2xl flex flex-col justify-between">
            
            {/* Drawer Header */}
            <div className="px-5 py-4 border-b border-[#3E1220] flex items-center justify-between bg-[#120A0C]/90">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-[#3E1220] text-[#F7B52C]">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white font-display">Your Order</h2>
                  <p className="text-xs text-[#FFF8EE]/60">
                    {items.length} {items.length === 1 ? 'item' : 'items'} in pre-order
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-[#3E1220] text-[#FFF8EE]/70 hover:text-white transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
              {items.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#3E1220]/60 flex items-center justify-center text-3xl">
                    🥟
                  </div>
                  <h3 className="text-base font-bold text-white">Your cart is empty</h3>
                  <p className="text-xs text-[#FFF8EE]/60 max-w-xs mx-auto mt-1 mb-6">
                    Craving hot samosas, crispy puffs or authentic filter coffee? Add some joy to your cart!
                  </p>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      router.push('/menu');
                    }}
                    className="btn-gold-pill text-xs py-2 px-5"
                  >
                    Explore Menu
                  </button>
                </div>
              ) : (
                <>
                  {/* Biryani prep time notice */}
                  {hasBiryaniOrStarter && (
                    <div className="p-3 rounded-xl bg-[#5A1A2B]/40 border border-[#F7B52C]/40 text-xs flex items-start gap-2.5 text-[#FFF8EE]/90">
                      <Clock className="w-4 h-4 text-[#F7B52C] shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-[#F7B52C]">Fresh Preparation Notice:</strong> Your order contains Biryani / fresh starters. Minimum preparation time is 15–20 minutes to serve piping hot.
                      </div>
                    </div>
                  )}

                  {/* Items List */}
                  <div className="space-y-3.5">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl bg-[#1F0E14] border border-[#3E1220] hover:border-[#F7B52C]/30 transition-all space-y-2"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <VegBadge isVeg={item.isVeg} size="sm" className="mt-1" />
                            <div>
                              <div className="text-sm font-bold text-white leading-tight">
                                {item.name}
                              </div>
                              {item.selectedSize && (
                                <div className="text-xs text-[#F7B52C] font-semibold mt-0.5">
                                  Size: {item.selectedSize}
                                </div>
                              )}
                              <div className="text-xs text-[#FFF8EE]/60 mt-0.5">
                                ₹{item.price} each
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-sm font-extrabold text-[#F7B52C]">
                              ₹{item.price * item.quantity}
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-xs text-rose-400/80 hover:text-rose-400 transition-colors mt-1 flex items-center gap-1 ml-auto"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Quantity Stepper & Notes Toggle */}
                        <div className="flex items-center justify-between pt-2 border-t border-[#3E1220]/60 text-xs">
                          <button
                            onClick={() =>
                              setEditingNotesId(editingNotesId === item.id ? null : item.id)
                            }
                            className="text-[#FFF8EE]/70 hover:text-[#F7B52C] flex items-center gap-1"
                          >
                            <MessageSquare className="w-3 h-3" />
                            {item.notes ? (
                              <span className="italic text-[#F7B52C] truncate max-w-[140px]">
                                Note: &ldquo;{item.notes}&rdquo;
                              </span>
                            ) : (
                              '+ Add cooking note'
                            )}
                          </button>

                          <div className="flex items-center gap-2 bg-[#120A0C] border border-[#3E1220] rounded-full px-2 py-0.5">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-5 h-5 rounded-full text-[#F7B52C] hover:bg-[#3E1220] flex items-center justify-center font-bold"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-bold text-white min-w-[1rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-5 h-5 rounded-full text-[#F7B52C] hover:bg-[#3E1220] flex items-center justify-center font-bold"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Inline Item Notes Form */}
                        {editingNotesId === item.id && (
                          <div className="pt-2 border-t border-[#3E1220] space-y-1.5">
                            <input
                              type="text"
                              value={item.notes || ''}
                              onChange={(e) => updateNotes(item.id, e.target.value)}
                              placeholder="e.g. less spicy, extra gravy, less sugar..."
                              className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-[#120A0C] border border-[#3E1220] text-white focus:outline-none focus:border-[#F7B52C]"
                            />
                            <div className="flex flex-wrap gap-1">
                              {QUICK_NOTES.map((qn) => (
                                <button
                                  key={qn}
                                  type="button"
                                  onClick={() => updateNotes(item.id, qn)}
                                  className="text-[10px] px-2 py-0.5 rounded-full bg-[#3E1220] text-[#FFF8EE]/80 hover:text-[#F7B52C] hover:bg-[#4D1726]"
                                >
                                  {qn}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Pickup Slot Selection */}
                  <div className="p-4 rounded-xl bg-[#1C0D12] border border-[#3E1220] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#F7B52C]" /> Pickup Time Slot
                      </label>
                      <span className="text-[11px] text-[#F7B52C] font-semibold">{pickupSlot}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {PRESET_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setPickupSlot(slot)}
                          className={`px-2 py-1.5 rounded-lg text-xs font-semibold border transition-all text-center ${
                            pickupSlot === slot
                              ? 'bg-[#3E1220] border-[#F7B52C] text-[#F7B52C] shadow-sm'
                              : 'bg-[#120A0C] border-[#3E1220] text-[#FFF8EE]/70 hover:border-[#F7B52C]/30'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Customer Information (Name & Mobile for Token / WhatsApp Alert) */}
                  <div className="p-4 rounded-xl bg-[#1C0D12] border border-[#3E1220] space-y-3">
                    <div className="text-xs font-bold text-white uppercase tracking-wider">
                      Pickup Customer Details
                    </div>
                    <div className="space-y-2">
                      <div className="relative">
                        <User className="w-4 h-4 text-[#FFF8EE]/40 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerInfo(e.target.value, customerPhone)}
                          placeholder="Your Name (e.g. Rahul)"
                          className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-[#120A0C] border border-[#3E1220] text-white focus:outline-none focus:border-[#F7B52C]"
                        />
                      </div>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-[#FFF8EE]/40 absolute left-3 top-2.5" />
                        <input
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => setCustomerInfo(customerName, e.target.value)}
                          placeholder="Mobile Number (10 digits for token SMS/WhatsApp)"
                          className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-[#120A0C] border border-[#3E1220] text-white focus:outline-none focus:border-[#F7B52C]"
                        />
                      </div>
                      {phoneError && (
                        <p className="text-[11px] text-rose-400 font-semibold">{phoneError}</p>
                      )}
                    </div>
                  </div>

                  {/* Coupon Code Section */}
                  <div className="p-3.5 rounded-xl bg-[#1C0D12] border border-[#3E1220] space-y-2">
                    <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-[#F7B52C]" /> Offers & Promo Code
                      </span>
                      {couponCode && (
                        <button
                          onClick={removeCoupon}
                          className="text-[10px] text-rose-400 hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    {couponCode ? (
                      <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-600/50 text-xs text-emerald-300 flex items-center justify-between">
                        <span className="font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {couponCode} APPLIED
                        </span>
                        <span className="font-extrabold">-₹{discount}</span>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <input
                          type="text"
                          value={inputCoupon}
                          onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                          placeholder="Try ZCAFE50 or FIRST10"
                          className="flex-1 text-xs px-3 py-1.5 rounded-lg bg-[#120A0C] border border-[#3E1220] text-white uppercase font-bold focus:outline-none focus:border-[#F7B52C]"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1.5 rounded-lg bg-[#3E1220] hover:bg-[#5A1A2B] text-[#F7B52C] font-bold text-xs border border-[#F7B52C]/40"
                        >
                          Apply
                        </button>
                      </form>
                    )}

                    {couponFeedback && (
                      <p
                        className={`text-[11px] ${
                          couponFeedback.isError ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {couponFeedback.message}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Bill Summary & Sticky Checkout Bar */}
            {items.length > 0 && (
              <div className="p-5 border-t border-[#3E1220] bg-[#120A0C] space-y-3">
                <div className="space-y-1.5 text-xs text-[#FFF8EE]/70">
                  <div className="flex justify-between">
                    <span>Item Subtotal</span>
                    <span className="font-semibold text-white">₹{subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Promo Discount</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>GST (5% Indian Restaurant Tax)</span>
                    <span className="font-semibold text-white">₹{gst}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-[#3E1220]">
                    <span>To Pay</span>
                    <span className="text-[#F7B52C] text-lg">₹{total}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  className="w-full btn-gold-pill text-sm py-3 font-extrabold flex items-center justify-center gap-2 shadow-glow-gold"
                >
                  <span>Pay ₹{total} via Razorpay</span>
                  <span className="text-xs font-normal opacity-80">(UPI, GPay, Card)</span>
                </button>

                <p className="text-center text-[10px] text-[#FFF8EE]/50 flex items-center justify-center gap-1">
                  🔒 Secure 256-bit encrypted Indian payment gateway
                </p>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Razorpay Interactive Checkout Modal */}
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
