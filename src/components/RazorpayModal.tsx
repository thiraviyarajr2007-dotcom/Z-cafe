'use client';

import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  CheckCircle, 
  AlertTriangle, 
  Loader2,
  Lock,
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { createOrderRecord, generateOrderToken } from '@/lib/orders-db';
import { Order } from '@/types';
import confetti from 'canvas-confetti';

interface RazorpayModalProps {
  onClose: () => void;
  onSuccess: (orderId: string) => void;
}

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export const RazorpayModal: React.FC<RazorpayModalProps> = ({ onClose, onSuccess }) => {
  const {
    items,
    customerName,
    customerPhone,
    studentId,
    department,
    pickupSlot,
    getSubtotal,
    getGst,
    discount,
    getTotal,
  } = useCartStore();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'other'>('gpay');
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const subtotal = getSubtotal();
  const gst = getGst();
  const total = getTotal();

  const handleCreateAndCompleteOrder = async (razorpayPaymentId = `pay_${Date.now()}`) => {
    setIsProcessing(true);
    setErrorMessage('');

    try {
      const { token, tokenNumber, orderId } = generateOrderToken();

      const newOrder: Order = {
        id: orderId,
        token,
        tokenNumber,
        customerName: customerName || 'Paranitharan',
        customerPhone: customerPhone || '9876543210',
        studentId: studentId || 'RATH2024CS042',
        department: department || 'Computer Science & Engg',
        items: items.map((i) => ({
          menuItemId: i.menuItemId,
          name: i.name,
          size: i.selectedSize,
          price: i.price,
          quantity: i.quantity,
          notes: i.notes,
          isVeg: i.isVeg,
        })),
        subtotal,
        gst,
        discount,
        total,
        status: 'received',
        pickupSlot: pickupSlot || '11:20 AM – 11:30 AM',
        pickupDate: '08 October 2026',
        paymentId: razorpayPaymentId,
        razorpayOrderId: `order_rzp_${Date.now()}`,
        paymentStatus: 'paid',
        paymentMethod: paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'card' ? 'Card' : 'NetBanking',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        isQrUsed: false,
        estimatedReadyTime: Date.now() + 12 * 60 * 1000,
      };

      // Save order to store / Firestore
      await createOrderRecord(newOrder);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#F7B52C', '#FF9F1C', '#5A1A2B', '#FFF8EE']
        });
      } catch (e) {}

      onSuccess(newOrder.id);
    } catch (err: any) {
      console.error('Order creation error:', err);
      setErrorMessage(err.message || 'Payment processing failed. Please retry.');
      setIsProcessing(false);
    }
  };

  const handlePayNow = () => {
    setIsProcessing(true);
    // Smooth realistic simulation for prototype / testing
    setTimeout(() => {
      handleCreateAndCompleteOrder(`pay_mock_${Date.now()}`);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#251017] to-[#120A0C] border border-[#F7B52C]/30 p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.85)] text-[#FFF8EE]">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#FFF8EE] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#F7B52C]/20 border border-[#F7B52C]/40 flex items-center justify-center text-[#F7B52C]">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-[#FFF8EE] flex items-center gap-2">
              Razorpay Secure Checkout
            </h3>
            <p className="text-xs text-[#FFF8EE]/60">
              UPI • Cards • NetBanking • Instant Counter QR
            </p>
          </div>
        </div>

        {/* Order Summary Pill */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-5 flex items-center justify-between">
          <div>
            <div className="text-xs text-white/60">Amount Payable</div>
            <div className="text-2xl font-black text-[#F7B52C]">₹{total}</div>
            <div className="text-[11px] text-white/50">
              Slot: <strong className="text-white">{pickupSlot}</strong>
            </div>
          </div>
          <div className="text-right text-xs">
            <span className="font-semibold text-white">{customerName}</span>
            <div className="text-[11px] text-emerald-400 font-mono">
              {studentId || 'STUDENT'}
            </div>
          </div>
        </div>

        {/* Payment Methods Tabs */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <button
            type="button"
            onClick={() => setPaymentMethod('upi')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all ${
              paymentMethod === 'upi'
                ? 'bg-[#F7B52C] text-[#120A0C] border-[#F7B52C] shadow-md'
                : 'bg-white/5 text-white/80 border-white/10 hover:border-white/20'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>UPI Apps</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all ${
              paymentMethod === 'card'
                ? 'bg-[#F7B52C] text-[#120A0C] border-[#F7B52C] shadow-md'
                : 'bg-white/5 text-white/80 border-white/10 hover:border-white/20'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Cards</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('netbanking')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all ${
              paymentMethod === 'netbanking'
                ? 'bg-[#F7B52C] text-[#120A0C] border-[#F7B52C] shadow-md'
                : 'bg-white/5 text-white/80 border-white/10 hover:border-white/20'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>NetBanking</span>
          </button>
        </div>

        {/* Tab Content */}
        {paymentMethod === 'upi' && (
          <div className="space-y-3 mb-6 p-4 rounded-2xl bg-black/40 border border-white/10">
            <label className="block text-xs font-bold uppercase text-white/70">
              Select UPI App
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'gpay', label: 'Google Pay' },
                { id: 'phonepe', label: 'PhonePe' },
                { id: 'paytm', label: 'Paytm UPI' },
              ].map((app) => (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => setUpiApp(app.id as any)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold border text-center transition-all ${
                    upiApp === app.id
                      ? 'bg-white/15 border-[#F7B52C] text-[#F7B52C]'
                      : 'bg-white/5 border-white/10 text-white/70'
                  }`}
                >
                  {app.label}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <input
                type="text"
                placeholder="Or enter UPI ID (e.g. name@okaxis)"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#F7B52C]"
              />
            </div>
          </div>
        )}

        {paymentMethod === 'card' && (
          <div className="space-y-2 mb-6 p-4 rounded-2xl bg-black/40 border border-white/10 text-xs">
            <input
              type="text"
              placeholder="Card Number (4532 •••• •••• ••••)"
              defaultValue="4532 8901 2345 6789"
              className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-[#F7B52C]"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="MM/YY"
                defaultValue="08/28"
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-[#F7B52C]"
              />
              <input
                type="password"
                placeholder="CVV"
                defaultValue="888"
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-[#F7B52C]"
              />
            </div>
          </div>
        )}

        {paymentMethod === 'netbanking' && (
          <div className="mb-6 p-4 rounded-2xl bg-black/40 border border-white/10 text-xs text-white/80">
            <p className="mb-2">Popular College Campus Banks:</p>
            <div className="grid grid-cols-2 gap-2">
              {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank'].map((bank) => (
                <div key={bank} className="p-2 rounded-xl bg-white/5 border border-white/10 font-medium">
                  {bank}
                </div>
              ))}
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Button */}
        <button
          type="button"
          disabled={isProcessing}
          onClick={handlePayNow}
          className="w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 bg-gradient-to-r from-[#F7B52C] via-[#FF9F1C] to-[#F7B52C] text-[#120A0C] shadow-[0_10px_35px_rgba(247,181,44,0.4)] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-70"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-[#120A0C]" />
              <span>Verifying Payment & Issuing Token...</span>
            </>
          ) : (
            <>
              <span>Pay ₹{total} & Generate Campus QR</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        <p className="mt-3 text-[11px] text-center text-white/50 flex items-center justify-center gap-1">
          <Lock className="w-3 h-3 text-[#F7B52C]" />
          <span>256-bit SSL encrypted • Instant Token # Confirmation</span>
        </p>
      </div>
    </div>
  );
};
