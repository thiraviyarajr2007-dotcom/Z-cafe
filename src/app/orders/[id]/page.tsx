'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  ShoppingBag, 
  Bell, 
  Share2, 
  RefreshCw, 
  AlertCircle,
  Sparkles,
  ArrowLeft,
  MessageSquare,
  Copy,
  Check,
  CheckCheck
} from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { subscribeToOrder } from '@/lib/orders-db';
import { VegBadge } from '@/components/VegBadge';
import { QRTokenCard } from '@/components/QRTokenCard';
import { useCartStore } from '@/store/useCartStore';

const TIMELINE_STEPS = [
  { key: 'placed', label: 'Order Placed', desc: 'Received in system' },
  { key: 'payment', label: 'Payment Confirmed', desc: 'Verified via Razorpay' },
  { key: 'accepted', label: 'Order Accepted', desc: 'Approved by counter staff' },
  { key: 'preparing', label: 'Preparing', desc: 'Fresh in kitchen' },
  { key: 'ready', label: 'Ready for Pickup', desc: 'Hot at collection counter' },
  { key: 'completed', label: 'Completed', desc: 'Collected with QR scan' },
];

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;
  const { addItem } = useCartStore();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notificationSent, setNotificationSent] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    const unsubscribe = subscribeToOrder(orderId, (fetchedOrder) => {
      setOrder(fetchedOrder);
      setLoading(false);

      // Trigger Web notification or alert when ready
      if (fetchedOrder && (fetchedOrder.status === 'ready' || fetchedOrder.status === 'collected') && !notificationSent) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`🎉 ZCafe: Token #${fetchedOrder.token} is READY for Pickup!`, {
            body: 'Please show your QR pass at the counter to collect.',
            icon: '/favicon.ico',
          });
        }
        setNotificationSent(true);
      }
    });

    return () => unsubscribe();
  }, [orderId, notificationSent]);

  const getStepProgress = (status: OrderStatus) => {
    switch (status) {
      case 'received': return 2; // Placed, Payment
      case 'accepted': return 3; // Placed, Payment, Accepted
      case 'preparing': return 4; // Placed, Payment, Accepted, Preparing
      case 'ready': return 5; // Ready for pickup
      case 'collected': return 6; // All complete
      default: return 2;
    }
  };

  const handleReorder = () => {
    if (!order) return;
    order.items.forEach((item) => {
      addItem(
        {
          id: item.menuItemId,
          name: item.name,
          category: 'lunch',
          description: '',
          price: item.price,
          isVeg: item.isVeg,
          image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
          isAvailable: true,
          prepTimeMinutes: 5,
        },
        item.size,
        item.notes
      );
    });
    router.push('/menu');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#120A0C] flex flex-col items-center justify-center text-center p-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#3E1220] border-t-[#F7B52C] animate-spin mb-4" />
        <h2 className="text-lg font-bold text-white">Loading your campus order pass...</h2>
        <p className="text-xs text-[#FFF8EE]/60">Connecting to live ZCafe counter feed</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#120A0C] flex flex-col items-center justify-center text-center p-4">
        <div className="text-4xl mb-4">🔍</div>
        <h2 className="text-xl font-bold text-white">Order Not Found</h2>
        <p className="text-xs text-[#FFF8EE]/60 max-w-sm mt-1 mb-6">
          We could not locate this order token. Check your order history.
        </p>
        <Link href="/menu" className="btn-gold-pill text-xs py-2.5 px-6 font-bold">
          Back to Menu
        </Link>
      </div>
    );
  }

  const currentStepIndex = getStepProgress(order.status);

  return (
    <div className="min-h-screen bg-[#120A0C] py-10 px-4 sm:px-6 lg:px-8 text-[#FFF8EE]">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link
            href="/orders"
            className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-[#F7B52C] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>My Orders</span>
          </Link>

          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-500/15 px-3 py-1 rounded-full border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Live Kitchen Feed
          </span>
        </div>

        {/* ===================== HERO SUCCESS BANNER ===================== */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-black uppercase tracking-wider mb-2">
            <CheckCircle2 className="w-4 h-4" />
            Payment Verified • Token Issued
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white font-display">
            🎉 Order Confirmed!
          </h1>
          <p className="text-sm sm:text-base text-white/80 max-w-lg mx-auto">
            Your food is being prepared. Simply show your token or QR code at the counter.
          </p>
        </div>

        {/* 2-Column Grid: Left QR Token Pass, Right Order Timeline & Items */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Scannable QR Token Pass */}
          <div className="lg:col-span-5">
            <QRTokenCard order={order} />
          </div>

          {/* Right Column: 6-Stage Timeline & Order Summary */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Live 6-Stage Order Timeline */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-[#220e15] to-[#120A0C] border border-white/10 shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#F7B52C]">
                    PROGRESS TRACKER
                  </span>
                  <h3 className="text-lg font-black text-white">Live Kitchen Timeline</h3>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  order.status === 'ready'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse'
                    : order.status === 'preparing'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : order.status === 'collected'
                    ? 'bg-white/10 text-white/60'
                    : 'bg-white/10 text-[#F7B52C]'
                }`}>
                  {order.status === 'ready' ? '🔥 Ready at Counter' : order.status}
                </span>
              </div>

              {/* Step indicator items */}
              <div className="space-y-4">
                {TIMELINE_STEPS.map((step, idx) => {
                  const stepNumber = idx + 1;
                  const isDone = stepNumber <= currentStepIndex;
                  const isCurrent = stepNumber === currentStepIndex;

                  return (
                    <div key={step.key} className="flex items-start gap-3.5">
                      <div className="relative flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isCurrent
                            ? 'bg-[#F7B52C] text-[#120A0C] ring-4 ring-[#F7B52C]/30 shadow-lg'
                            : isDone
                            ? 'bg-emerald-500 text-white'
                            : 'bg-white/10 text-white/40'
                        }`}>
                          {isDone && !isCurrent ? (
                            <CheckCheck className="w-4 h-4" />
                          ) : (
                            stepNumber
                          )}
                        </div>
                        {idx < TIMELINE_STEPS.length - 1 && (
                          <div className={`w-0.5 h-6 mt-1 ${
                            isDone ? 'bg-emerald-500/50' : 'bg-white/10'
                          }`} />
                        )}
                      </div>

                      <div className="pt-0.5">
                        <div className={`text-sm font-bold ${
                          isCurrent ? 'text-[#F7B52C]' : isDone ? 'text-white' : 'text-white/40'
                        }`}>
                          {step.label}
                        </div>
                        <div className="text-xs text-white/50">
                          {step.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Food Items Ordered Card */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-black uppercase tracking-wider text-[#F7B52C]">
                  Order Items ({order.items.length})
                </span>
                <span className="text-xs font-mono text-white/60">ID: {order.id}</span>
              </div>

              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <VegBadge isVeg={item.isVeg} size="sm" />
                      <div>
                        <span className="font-bold text-white">{item.name}</span>
                        {item.size && (
                          <span className="text-xs text-[#F7B52C] ml-1.5">({item.size})</span>
                        )}
                        {item.notes && (
                          <div className="text-[11px] text-white/50 italic">
                            Note: {item.notes}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-white">
                        {item.quantity} × ₹{item.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bill totals */}
              <div className="pt-3 border-t border-white/10 space-y-1.5 text-xs">
                <div className="flex justify-between text-white/60">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span>-₹{order.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-white/60">
                  <span>GST (5%)</span>
                  <span>₹{order.gst}</span>
                </div>
                <div className="flex justify-between text-base font-black text-[#F7B52C] pt-2 border-t border-white/10">
                  <span>Total Paid ({order.paymentMethod || 'UPI'})</span>
                  <span>₹{order.total}</span>
                </div>
              </div>

              {/* Re-order CTA */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleReorder}
                  className="w-full py-3 rounded-2xl font-bold text-xs bg-white/10 hover:bg-white/20 text-[#FFF8EE] border border-white/15 flex items-center justify-center gap-2 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#F7B52C]" />
                  <span>Re-order These Items</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
