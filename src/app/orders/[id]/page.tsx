'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
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
  MessageSquare
} from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { subscribeToOrder } from '@/lib/orders-db';
import { VegBadge } from '@/components/VegBadge';
import { useCartStore } from '@/store/useCartStore';

const STATUS_STEPS: { key: OrderStatus; label: string; desc: string; icon: any }[] = [
  { key: 'received', label: 'Order Received', desc: 'Sent to Z Cafe kitchen counter', icon: CheckCircle2 },
  { key: 'preparing', label: 'Preparing Fresh', desc: 'Frying, baking & brewing fresh batch', icon: ChefHat },
  { key: 'ready', label: 'Ready for Pickup', desc: 'Piping hot at the collection counter!', icon: Bell },
  { key: 'collected', label: 'Collected', desc: 'Enjoy your little joy in every puff!', icon: ShoppingBag },
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
      if (fetchedOrder && fetchedOrder.status === 'ready' && !notificationSent) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`🎉 Z CAFÉ: Order #${fetchedOrder.token} is READY!`, {
            body: 'Please show your token or QR code at the counter to collect.',
            icon: '/favicon.ico',
          });
        }
        setNotificationSent(true);
      }
    });

    return () => unsubscribe();
  }, [orderId, notificationSent]);

  // Request browser notification permission
  const enableNotifications = async () => {
    if ('Notification' in window) {
      const res = await Notification.requestPermission();
      if (res === 'granted') {
        alert('Notifications enabled! We will alert you the moment your food is ready.');
      }
    }
  };

  const handleReorder = () => {
    if (!order) return;
    // Add items back into cart
    order.items.forEach((item) => {
      addItem(
        {
          id: item.menuItemId,
          name: item.name,
          category: 'snacks',
          description: '',
          price: item.price,
          isVeg: item.isVeg,
          image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
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
        <h2 className="text-lg font-bold text-white">Loading your order...</h2>
        <p className="text-xs text-[#FFF8EE]/60">Connecting to Z Cafe real-time kitchen feed</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#120A0C] flex flex-col items-center justify-center text-center p-4">
        <div className="text-4xl mb-4">🔍</div>
        <h2 className="text-xl font-bold text-white">Order Not Found</h2>
        <p className="text-xs text-[#FFF8EE]/60 max-w-sm mt-1 mb-6">
          We could not locate this order. It might have expired or the order ID is incorrect.
        </p>
        <Link href="/menu" className="btn-gold-pill text-xs py-2 px-6">
          Back to Menu
        </Link>
      </div>
    );
  }

  // Determine current active step index
  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === order.status);
  const isReady = order.status === 'ready';
  const isCollected = order.status === 'collected';

  return (
    <div className="min-h-screen bg-[#120A0C] pb-24">
      {/* Top Banner */}
      <div className="bg-wood-slats border-b border-[#3E1220] py-8 px-4 sm:px-6 lg:px-8 counter-led-glow">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link
            href="/menu"
            className="text-xs text-[#FFF8EE]/70 hover:text-[#F7B52C] flex items-center gap-1.5 font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Menu
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3E1220] border border-[#F7B52C]/40 text-[#F7B52C] text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-[#F7B52C] animate-ping" />
            Live Kitchen Tracking
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Token & QR Hero Card */}
        <div className={`zcafe-card rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden border-2 ${
          isReady ? 'border-emerald-500 shadow-glow-gold-lg animate-pulse-subtle' : 'border-[#F7B52C]/40'
        }`}>
          {/* Subtle top glow */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#F7B52C] to-transparent" />

          {/* Status Badge */}
          <div className="mb-4">
            {isReady ? (
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-600 text-white font-extrabold text-sm uppercase tracking-wider shadow-lg">
                <Sparkles className="w-4 h-4 fill-current" /> READY FOR PICKUP!
              </span>
            ) : isCollected ? (
              <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-[#3E1220] text-[#FFF8EE]/80 font-bold text-xs uppercase tracking-wider">
                Order Completed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#5A1A2B] text-[#F7B52C] font-extrabold text-xs uppercase tracking-wider border border-[#F7B52C]/40">
                <ChefHat className="w-4 h-4" /> Preparing in Kitchen
              </span>
            )}
          </div>

          {/* TOKEN CODE */}
          <div className="text-xs uppercase font-extrabold text-[#FFF8EE]/60 tracking-widest">
            Your Collection Token
          </div>
          <div className="text-5xl sm:text-7xl font-black text-[#F7B52C] tracking-wider font-display my-2 select-all drop-shadow-[0_2px_15px_rgba(247,181,44,0.4)]">
            {order.token}
          </div>

          <p className="text-sm font-semibold text-[#FFF8EE] max-w-md mx-auto">
            Show this token or scan the QR code below at the Z CAFÉ counter.
          </p>

          {/* QR Code Container */}
          <div className="mt-6 inline-flex p-4 rounded-2xl bg-white shadow-2xl border-4 border-[#F7B52C]">
            <QRCodeSVG
              value={`https://zcafe.in/orders/${order.id}?token=${order.token}`}
              size={160}
              level="H"
              includeMargin={false}
            />
          </div>

          {/* Pickup time slot indicator */}
          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-[#FFF8EE]/70">
            <Clock className="w-4 h-4 text-[#F7B52C]" />
            <span>Scheduled Slot: <strong className="text-white">{order.pickupSlot}</strong></span>
          </div>

          {/* WhatsApp share & Notification buttons */}
          <div className="mt-6 pt-6 border-t border-[#3E1220] flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={enableNotifications}
              className="px-4 py-2 rounded-full bg-[#2A121A] hover:bg-[#3E1220] border border-[#F7B52C]/40 text-xs text-[#FFF8EE] font-bold flex items-center gap-1.5 transition-all"
            >
              <Bell className="w-3.5 h-3.5 text-[#F7B52C]" />
              Enable Ready Alert
            </button>

            <a
              href={`https://wa.me/?text=My%20Z%20Cafe%20Order%20Token%20is%20${order.token}%20-%20Track%20at%20${typeof window !== 'undefined' ? window.location.href : ''}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/50 text-xs text-[#25D366] font-bold flex items-center gap-1.5 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Share on WhatsApp
            </a>
          </div>

        </div>


        {/* Live Step Progress Bar */}
        <div className="zcafe-card rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-[#F7B52C] animate-spin" />
            Live Kitchen Progress
          </h3>

          <div className="space-y-6">
            {STATUS_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isPastOrCurrent = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={step.key} className="flex items-start gap-4 relative">
                  {/* Vertical connecting line */}
                  {idx < STATUS_STEPS.length - 1 && (
                    <div
                      className={`absolute left-5 top-10 bottom-0 w-0.5 -mb-6 ${
                        idx < currentStepIndex ? 'bg-[#F7B52C]' : 'bg-[#3E1220]'
                      }`}
                    />
                  )}

                  {/* Icon Circle */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 transition-all ${
                      isCurrent
                        ? 'bg-gradient-to-br from-[#F7B52C] to-[#FF9F1C] text-[#120A0C] shadow-glow-gold scale-110'
                        : isPastOrCurrent
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#230C14] text-[#FFF8EE]/40 border border-[#3E1220]'
                    }`}
                  >
                    <Icon className="w-5 h-5 stroke-[2.5]" />
                  </div>

                  {/* Step Description */}
                  <div className="flex-1 pt-1">
                    <div className="flex items-center justify-between">
                      <div className={`text-sm font-bold ${isPastOrCurrent ? 'text-white' : 'text-[#FFF8EE]/40'}`}>
                        {step.label}
                      </div>
                      {isCurrent && (
                        <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-[#F7B52C]/20 text-[#F7B52C] border border-[#F7B52C]/40">
                          Active Now
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mt-0.5 ${isPastOrCurrent ? 'text-[#FFF8EE]/70' : 'text-[#FFF8EE]/30'}`}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>


        {/* Order Items & Bill Details */}
        <div className="zcafe-card rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#3E1220]">
            <div>
              <h3 className="text-base font-bold text-white">Order Summary</h3>
              <p className="text-xs text-[#FFF8EE]/60">Customer: {order.customerName} ({order.customerPhone})</p>
            </div>
            <button
              onClick={handleReorder}
              className="text-xs text-[#F7B52C] font-bold hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reorder Items
            </button>
          </div>

          <div className="divide-y divide-[#3E1220]">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-start gap-2.5">
                  <VegBadge isVeg={item.isVeg} size="sm" className="mt-0.5" />
                  <div>
                    <div className="font-bold text-white text-sm">
                      {item.quantity} &times; {item.name}
                    </div>
                    {item.size && (
                      <div className="text-[11px] text-[#F7B52C]">Size: {item.size}</div>
                    )}
                    {item.notes && (
                      <div className="text-[11px] text-[#FFF8EE]/60 italic">
                        Note: &ldquo;{item.notes}&rdquo;
                      </div>
                    )}
                  </div>
                </div>
                <div className="font-extrabold text-white text-sm">
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing breakdown */}
          <div className="pt-4 border-t border-[#3E1220] space-y-1.5 text-xs text-[#FFF8EE]/70">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-400 font-medium">
                <span>Discount</span>
                <span>-₹{order.discount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>GST (5%)</span>
              <span>₹{order.gst}</span>
            </div>
            <div className="flex justify-between text-base font-black text-white pt-2 border-t border-[#3E1220]">
              <span>Total Paid via Razorpay</span>
              <span className="text-[#F7B52C] text-lg">₹{order.total}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
