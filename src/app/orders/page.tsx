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
  Phone
} from 'lucide-react';
import { Order } from '@/types';
import { getLocalOrders, getOrderByToken } from '@/lib/orders-db';
import { useCartStore } from '@/store/useCartStore';

export default function OrdersLookupPage() {
  const router = useRouter();
  const { customerPhone } = useCartStore();
  const [query, setQuery] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // Load local recent orders
    const all = getLocalOrders();
    setOrders(all);
    if (customerPhone) {
      setQuery(customerPhone);
    }
  }, [customerPhone]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setNotFound(false);
    setSearchedOrder(null);

    // If query looks like a token "Z-123" or has "Z"
    if (query.toUpperCase().startsWith('Z-') || query.length <= 6) {
      const found = await getOrderByToken(query);
      if (found) {
        router.push(`/orders/${found.id}`);
        return;
      }
    }

    // Otherwise filter by phone number
    const filtered = orders.filter((o) =>
      o.customerPhone.includes(query) || o.token.toUpperCase().includes(query.toUpperCase())
    );

    if (filtered.length > 0) {
      setOrders(filtered);
    } else {
      setNotFound(true);
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'received':
        return (
          <span className="px-2.5 py-1 rounded-full bg-blue-900/60 text-blue-300 text-xs font-bold border border-blue-500/30 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Received
          </span>
        );
      case 'preparing':
        return (
          <span className="px-2.5 py-1 rounded-full bg-amber-900/60 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1">
            <ChefHat className="w-3 h-3" /> Preparing
          </span>
        );
      case 'ready':
        return (
          <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-xs font-extrabold shadow-sm flex items-center gap-1 animate-pulse">
            <Bell className="w-3 h-3" /> Ready for Pickup!
          </span>
        );
      case 'collected':
        return (
          <span className="px-2.5 py-1 rounded-full bg-[#3E1220] text-[#FFF8EE]/60 text-xs font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Collected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#120A0C] pb-24">
      
      {/* Header */}
      <div className="bg-wood-slats border-b border-[#3E1220] py-10 px-4 sm:px-6 lg:px-8 counter-led-glow text-center">
        <div className="max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3E1220] text-[#F7B52C] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Instant Kiosk Pickup
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-display">
            Track Your Order
          </h1>
          <p className="text-xs sm:text-sm text-[#FFF8EE]/70 mt-2">
            Enter your 10-digit mobile number or unique Order Token (e.g. Z-0247)
          </p>

          <form onSubmit={handleSearch} className="mt-6 flex gap-2 max-w-md mx-auto">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#FFF8EE]/40 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Mobile number or Token (e.g. Z-0247)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#1A0B10] border border-[#5A1A2B] text-white text-sm focus:outline-none focus:border-[#F7B52C]"
              />
            </div>
            <button
              type="submit"
              className="btn-gold-pill text-xs py-2 px-5 font-bold whitespace-nowrap"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {notFound && (
          <div className="text-center py-10 bg-[#1A0B10] rounded-2xl border border-[#3E1220] p-6 mb-8">
            <h3 className="text-sm font-bold text-white">No active orders found</h3>
            <p className="text-xs text-[#FFF8EE]/60 mt-1">
              Double check your phone number or token code.
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Recent Orders</h2>
            <span className="text-xs text-[#FFF8EE]/50">{orders.length} found</span>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16 bg-[#180A0E] rounded-3xl border border-[#3E1220] p-8">
              <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[#3E1220] flex items-center justify-center text-2xl">
                ☕
              </div>
              <h3 className="text-base font-bold text-white">No orders yet</h3>
              <p className="text-xs text-[#FFF8EE]/60 max-w-xs mx-auto mt-1 mb-6">
                Ready for a little joy in every puff? Browse our authentic snacks!
              </p>
              <Link href="/menu" className="btn-gold-pill text-xs py-2 px-6">
                Start Pre-Order
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="zcafe-card rounded-2xl p-5 block border border-[#3E1220] hover:border-[#F7B52C]/50 transition-all group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-[#3E1220] border border-[#F7B52C]/30 flex flex-col items-center justify-center text-[#F7B52C] font-black group-hover:scale-105 transition-transform">
                        <span className="text-[10px] text-[#FFF8EE]/60 uppercase">Token</span>
                        <span className="text-sm font-display">{order.token}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{order.customerName}</span>
                          <span className="text-xs text-[#FFF8EE]/50">({order.customerPhone})</span>
                        </div>
                        <div className="text-xs text-[#FFF8EE]/70 mt-0.5 line-clamp-1">
                          {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#3E1220]">
                      <div className="text-right">
                        <div className="text-sm font-black text-[#F7B52C]">₹{order.total}</div>
                        <div className="text-[10px] text-[#FFF8EE]/50">{order.pickupSlot}</div>
                      </div>
                      {getStatusBadge(order.status)}
                      <ArrowRight className="w-4 h-4 text-[#FFF8EE]/40 group-hover:text-[#F7B52C] group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
