'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  ShoppingBag, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  ChefHat, 
  Bell, 
  Sparkles,
  Phone,
  QrCode,
  RefreshCw,
  GraduationCap
} from 'lucide-react';
import { Order } from '@/types';
import { getLocalOrders, getOrderRecord } from '@/lib/orders-db';
import { useCartStore } from '@/store/useCartStore';

export default function OrdersLookupPage() {
  const router = useRouter();
  const { customerPhone, studentUser, addItem } = useCartStore();
  const [query, setQuery] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const all = getLocalOrders();
    setOrders(all);
    if (customerPhone) {
      setQuery(customerPhone);
    }
  }, [customerPhone]);

  const activeOrder = orders.find((o) => o.status !== 'collected' && o.status !== 'cancelled') || orders[0];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setNotFound(false);
    const clean = query.trim();

    // Check by token or ID directly
    const found = await getOrderRecord(clean);
    if (found) {
      router.push(`/orders/${found.id}`);
      return;
    }

    // Filter local list
    const filtered = orders.filter((o) =>
      o.customerPhone.includes(clean) || 
      o.token.includes(clean) || 
      o.id.toLowerCase().includes(clean.toLowerCase())
    );

    if (filtered.length > 0) {
      setOrders(filtered);
    } else {
      setNotFound(true);
    }
  };

  const handleReorder = (order: Order) => {
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

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'received':
        return (
          <span className="px-2.5 py-1 rounded-full bg-blue-900/60 text-blue-300 text-xs font-bold border border-blue-500/30 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Received
          </span>
        );
      case 'accepted':
        return (
          <span className="px-2.5 py-1 rounded-full bg-indigo-900/60 text-indigo-300 text-xs font-bold border border-indigo-500/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Accepted
          </span>
        );
      case 'preparing':
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40 flex items-center gap-1">
            <ChefHat className="w-3 h-3" /> Preparing Fresh
          </span>
        );
      case 'ready':
        return (
          <span className="px-3 py-1 rounded-full bg-emerald-500 text-black text-xs font-black shadow-md flex items-center gap-1 animate-pulse">
            <Bell className="w-3 h-3" /> Ready for Pickup!
          </span>
        );
      case 'collected':
        return (
          <span className="px-2.5 py-1 rounded-full bg-white/10 text-emerald-400 text-xs font-bold flex items-center gap-1 border border-white/10">
            <CheckCircle2 className="w-3 h-3" /> Completed ✓
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#120A0C] pb-24 text-[#FFF8EE]">
      
      {/* Header Banner */}
      <div className="bg-wood-slats border-b border-white/10 py-10 px-4 sm:px-6 lg:px-8 relative counter-led-glow">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#F7B52C]/40 text-[#F7B52C] text-xs font-bold uppercase tracking-wider mb-3">
            <GraduationCap className="w-3.5 h-3.5" /> Student Pre-Order Dashboard
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white font-display">
            My Orders & Token Passes
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#FFF8EE]/70 max-w-md mx-auto">
            Access your QR tokens, check live order statuses, and reorder campus meals in one tap.
          </p>

          {/* Search by Token / Phone */}
          <form onSubmit={handleSearch} className="mt-6 max-w-md mx-auto relative flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search token # (e.g. 104) or phone number..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#180B0F] border border-white/15 text-white text-xs sm:text-sm placeholder-white/40 focus:outline-none focus:border-[#F7B52C]"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-full bg-[#F7B52C] text-[#120A0C] font-bold text-xs hover:brightness-110 transition-all shrink-0"
            >
              Find Pass
            </button>
          </form>

          {notFound && (
            <p className="mt-3 text-xs text-rose-400 font-medium">
              No matching orders found for &quot;{query}&quot;. Check the token number.
            </p>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* ACTIVE ORDER FEATURED PASS */}
        {activeOrder && activeOrder.status !== 'collected' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#2c121c] to-[#1a0a0f] border-2 border-[#F7B52C]/40 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-[#F7B52C] text-[#120A0C] font-black text-2xl flex items-center justify-center shadow-lg">
                  #{activeOrder.token}
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#F7B52C]">
                    CURRENT ACTIVE ORDER
                  </div>
                  <h2 className="text-xl font-black text-white">
                    {activeOrder.customerName}
                  </h2>
                  <div className="text-xs text-white/60">
                    Pickup Slot: <strong className="text-white">{activeOrder.pickupSlot}</strong>
                  </div>
                </div>
              </div>

              <div>
                {getStatusBadge(activeOrder.status)}
              </div>
            </div>

            {/* Active Items */}
            <div className="py-4 space-y-1.5 text-xs">
              {activeOrder.items.map((i, idx) => (
                <div key={idx} className="flex justify-between text-white/90">
                  <span>🍛 {i.name} × {i.quantity}</span>
                  <span className="font-bold">₹{i.price * i.quantity}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
              <Link
                href={`/orders/${activeOrder.id}`}
                className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-[#F7B52C] to-[#FF9F1C] text-[#120A0C] font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition-all"
              >
                <QrCode className="w-4 h-4" />
                <span>Show QR Pass & Live Status</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* ORDER HISTORY LIST */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-white uppercase tracking-wider text-xs">
              Order History ({orders.length})
            </h3>
            <button
              onClick={() => setOrders(getLocalOrders())}
              className="text-xs text-[#F7B52C] hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Refresh
            </button>
          </div>

          <div className="space-y-3">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/15 flex flex-col items-center justify-center text-white shrink-0">
                    <span className="text-[10px] text-white/50 font-bold uppercase">Token</span>
                    <span className="text-sm font-black text-[#F7B52C]">#{ord.token}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">
                        {ord.items.map((i) => i.name).join(', ')}
                      </span>
                    </div>

                    <div className="text-xs text-white/60 mt-1 flex flex-wrap items-center gap-3">
                      <span>₹{ord.total}</span>
                      <span>•</span>
                      <span>{ord.pickupDate}</span>
                      <span>•</span>
                      <span className="font-mono text-white/40">ID: {ord.id}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-end sm:self-center">
                  {getStatusBadge(ord.status)}

                  <Link
                    href={`/orders/${ord.id}`}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                    title="View QR Code"
                  >
                    <QrCode className="w-4 h-4 text-[#F7B52C]" />
                  </Link>

                  <button
                    onClick={() => handleReorder(ord)}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-white flex items-center gap-1 transition-all"
                  >
                    <RefreshCw className="w-3 h-3 text-[#F7B52C]" />
                    <span>Reorder</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
