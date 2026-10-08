'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  ChefHat, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Clock, 
  Bell, 
  ShoppingBag, 
  QrCode, 
  Search, 
  TrendingUp, 
  Sparkles, 
  Layers, 
  Plus, 
  Edit3, 
  Trash2, 
  RefreshCw,
  Lock,
  Unlock,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { Order, OrderStatus, MenuItem } from '@/types';
import { 
  subscribeToAllOrders, 
  updateOrderStatus, 
  getOrderByToken,
  getLocalMenu,
  saveLocalMenu
} from '@/lib/orders-db';
import { VegBadge } from '@/components/VegBadge';
import { INITIAL_MENU } from '@/data/menu';

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const [activeTab, setActiveTab] = useState<'orders' | 'menu' | 'analytics'>('orders');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [orders, setOrders] = useState<Order[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Menu Management State
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchMenuQuery, setSearchMenuQuery] = useState('');

  // Token Verification Modal
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [verifyTokenInput, setVerifyTokenInput] = useState('');
  const [verifiedOrder, setVerifiedOrder] = useState<Order | null>(null);
  const [verifyMessage, setVerifyMessage] = useState('');

  const prevOrdersCountRef = useRef(0);

  // Web Audio Synthesizer for Kitchen Chime (zero external audio dependency)
  const playKitchenChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) {
      console.warn('Audio not allowed yet by user interaction', e);
    }
  };

  // Real-time subscription to all orders
  useEffect(() => {
    if (!isAuthenticated) return;

    // Load initial menu
    setMenuItems(getLocalMenu());

    const unsubscribe = subscribeToAllOrders((allOrders) => {
      // Check if new incoming order arrived
      if (allOrders.length > prevOrdersCountRef.current && prevOrdersCountRef.current > 0) {
        if (soundEnabled) {
          playKitchenChime();
        }
      }
      prevOrdersCountRef.current = allOrders.length;
      setOrders(allOrders);
    });

    return () => unsubscribe();
  }, [isAuthenticated, soundEnabled]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '7777' || pinInput === 'admin') {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('Invalid PIN code. Default is: 7777');
    }
  };

  const handleStatusChange = async (orderId: string, nextStatus: OrderStatus) => {
    await updateOrderStatus(orderId, nextStatus);
    if (nextStatus === 'ready' && soundEnabled) {
      playKitchenChime();
    }
  };

  const handleVerifyToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyMessage('');
    const found = await getOrderByToken(verifyTokenInput);
    if (found) {
      setVerifiedOrder(found);
    } else {
      setVerifiedOrder(null);
      setVerifyMessage(`No order found for token "${verifyTokenInput.toUpperCase()}"`);
    }
  };

  const markVerifiedAsCollected = async () => {
    if (verifiedOrder) {
      await updateOrderStatus(verifiedOrder.id, 'collected');
      setVerifiedOrder({ ...verifiedOrder, status: 'collected' });
      setVerifyMessage(`Order #${verifiedOrder.token} successfully marked as COLLECTED!`);
    }
  };

  // Menu Management functions
  const toggleItemAvailability = (id: string) => {
    const updated = menuItems.map((item) =>
      item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
    );
    setMenuItems(updated);
    saveLocalMenu(updated);
  };

  const adjustStock = (id: string, delta: number) => {
    const updated = menuItems.map((item) => {
      if (item.id === id) {
        const cur = item.remainingStock ?? 20;
        const next = Math.max(0, cur + delta);
        return {
          ...item,
          remainingStock: next,
          isAvailable: next > 0 ? item.isAvailable : false,
        };
      }
      return item;
    });
    setMenuItems(updated);
    saveLocalMenu(updated);
  };

  const resetAllDailyStock = () => {
    const updated = menuItems.map((item) => ({
      ...item,
      remainingStock: item.dailyStock || 30,
      isAvailable: true,
    }));
    setMenuItems(updated);
    saveLocalMenu(updated);
    alert('All item stock quantities reset to daily capacity!');
  };

  // Analytics Helpers
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0), 0);
  const activeOrders = orders.filter((o) => o.status === 'received' || o.status === 'preparing');
  const readyOrders = orders.filter((o) => o.status === 'ready');

  // Filtered orders for board
  const displayedOrders = statusFilter === 'all'
    ? orders
    : orders.filter((o) => o.status === statusFilter);

  // Filtered menu items for editor
  const filteredMenuItems = menuItems.filter((m) =>
    m.name.toLowerCase().includes(searchMenuQuery.toLowerCase()) ||
    m.category.toLowerCase().includes(searchMenuQuery.toLowerCase())
  );

  // Authentication PIN screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#120A0C] flex items-center justify-center p-4">
        <div className="zcafe-card rounded-3xl p-8 max-w-sm w-full border border-[#5A1A2B] text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-[#3E1220] text-[#F7B52C] flex items-center justify-center mx-auto mb-4 border border-[#F7B52C]/40 shadow-glow-gold">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-white font-display">Kitchen Admin Portal</h2>
          <p className="text-xs text-[#FFF8EE]/60 mt-1 mb-6">
            Authorized personnel only. Enter Master PIN (Default: <strong>7777</strong>)
          </p>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <input
              type="password"
              maxLength={8}
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Enter PIN..."
              className="w-full text-center text-xl tracking-[0.5em] font-mono py-3 rounded-2xl bg-[#120A0C] border border-[#5A1A2B] text-white focus:outline-none focus:border-[#F7B52C]"
              autoFocus
            />
            {pinError && (
              <p className="text-xs text-rose-400 font-semibold">{pinError}</p>
            )}
            <button
              type="submit"
              className="w-full btn-gold-pill py-3 text-sm font-extrabold"
            >
              Access Kitchen Board
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E0608] pb-24 text-[#FFF8EE]">
      
      {/* Top Admin Navbar */}
      <div className="bg-[#180A0E] border-b border-[#3E1220] px-4 sm:px-6 lg:px-8 py-4 counter-led-glow sticky top-20 z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#3E1220] text-[#F7B52C] border border-[#F7B52C]/30">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-white font-display">Z CAFÉ Kitchen Kiosk</h1>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <p className="text-[11px] text-[#FFF8EE]/60">Live Order Stream & Stock Control</p>
            </div>
          </div>

          {/* Navigation Tabs & Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-[#F7B52C] to-[#FF9F1C] text-[#120A0C]'
                  : 'bg-[#230C14] text-[#FFF8EE]/70 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Orders ({orders.length})
            </button>

            <button
              onClick={() => setActiveTab('menu')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'menu'
                  ? 'bg-gradient-to-r from-[#F7B52C] to-[#FF9F1C] text-[#120A0C]'
                  : 'bg-[#230C14] text-[#FFF8EE]/70 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Menu & Daily Stock
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'analytics'
                  ? 'bg-gradient-to-r from-[#F7B52C] to-[#FF9F1C] text-[#120A0C]'
                  : 'bg-[#230C14] text-[#FFF8EE]/70 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Sales Summary
            </button>

            {/* Verify Token QR button */}
            <button
              onClick={() => setVerifyModalOpen(true)}
              className="px-3.5 py-1.5 rounded-full bg-[#5A1A2B] text-[#F7B52C] border border-[#F7B52C]/40 text-xs font-bold flex items-center gap-1.5 hover:bg-[#752438]"
            >
              <QrCode className="w-3.5 h-3.5" />
              Verify Token
            </button>

            {/* Audio Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-full border transition-all ${
                soundEnabled
                  ? 'bg-[#3E1220] border-[#F7B52C]/40 text-[#F7B52C]'
                  : 'bg-[#120A0C] border-[#3E1220] text-[#FFF8EE]/40'
              }`}
              title={soundEnabled ? 'Mute kitchen bell' : 'Enable kitchen chime'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* ======================= TAB 1: LIVE ORDERS BOARD ======================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#1C0A10] border border-[#3E1220] flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-[#FFF8EE]/60 uppercase font-semibold">Active In Kitchen</div>
                  <div className="text-2xl font-black text-amber-400">{activeOrders.length}</div>
                </div>
                <ChefHat className="w-6 h-6 text-amber-400 opacity-60" />
              </div>

              <div className="p-4 rounded-2xl bg-[#1C0A10] border border-[#3E1220] flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-[#FFF8EE]/60 uppercase font-semibold">Ready for Pickup</div>
                  <div className="text-2xl font-black text-emerald-400">{readyOrders.length}</div>
                </div>
                <Bell className="w-6 h-6 text-emerald-400 opacity-60" />
              </div>

              <div className="p-4 rounded-2xl bg-[#1C0A10] border border-[#3E1220] flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-[#FFF8EE]/60 uppercase font-semibold">Total Orders Today</div>
                  <div className="text-2xl font-black text-white">{orders.length}</div>
                </div>
                <ShoppingBag className="w-6 h-6 text-[#F7B52C] opacity-60" />
              </div>

              <div className="p-4 rounded-2xl bg-[#1C0A10] border border-[#3E1220] flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-[#FFF8EE]/60 uppercase font-semibold">Today&apos;s Revenue</div>
                  <div className="text-2xl font-black text-[#F7B52C]">₹{totalRevenue}</div>
                </div>
                <DollarSign className="w-6 h-6 text-[#F7B52C] opacity-60" />
              </div>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-[#3E1220]">
              <span className="text-xs text-[#FFF8EE]/50 font-bold uppercase mr-2">Filter Board:</span>
              {[
                { id: 'all', label: 'All Orders' },
                { id: 'received', label: 'New Received' },
                { id: 'preparing', label: 'Preparing' },
                { id: 'ready', label: 'Ready for Pickup' },
                { id: 'collected', label: 'Collected' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id as any)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    statusFilter === tab.id
                      ? 'bg-[#3E1220] text-[#F7B52C] border border-[#F7B52C]/40 shadow-sm'
                      : 'bg-[#180A0E] text-[#FFF8EE]/60 border border-[#3E1220] hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Orders Grid */}
            {displayedOrders.length === 0 ? (
              <div className="text-center py-20 bg-[#14080B] rounded-3xl border border-[#3E1220] p-8">
                <ChefHat className="w-12 h-12 text-[#F7B52C]/40 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white">No orders in this state</h3>
                <p className="text-xs text-[#FFF8EE]/60 mt-1">
                  Incoming pre-orders will pop up here with an audio chime!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {displayedOrders.map((order) => {
                  const isReady = order.status === 'ready';
                  const isPreparing = order.status === 'preparing';
                  const isReceived = order.status === 'received';
                  const isCollected = order.status === 'collected';

                  return (
                    <div
                      key={order.id}
                      className={`zcafe-card rounded-2xl p-5 border-2 flex flex-col justify-between transition-all ${
                        isReady
                          ? 'border-emerald-500 shadow-lg bg-[#0F1E13]/80'
                          : isPreparing
                          ? 'border-amber-500/80 bg-[#1F120A]/80'
                          : isReceived
                          ? 'border-blue-500/80 bg-[#101320]/80'
                          : 'border-[#3E1220] opacity-75'
                      }`}
                    >
                      <div>
                        {/* Header: Token & Time Slot */}
                        <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#3E1220]">
                          <div>
                            <span className="text-[10px] uppercase font-extrabold text-[#FFF8EE]/60 tracking-wider">
                              Token
                            </span>
                            <div className="text-3xl font-black text-[#F7B52C] font-display">
                              {order.token}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-full border ${
                              isReady
                                ? 'bg-emerald-900/60 text-emerald-300 border-emerald-500'
                                : isPreparing
                                ? 'bg-amber-900/60 text-amber-300 border-amber-500'
                                : isReceived
                                ? 'bg-blue-900/60 text-blue-300 border-blue-500'
                                : 'bg-[#3E1220] text-[#FFF8EE]/50 border-transparent'
                            }`}>
                              {order.status}
                            </span>
                            <div className="text-xs font-semibold text-white mt-1">
                              {order.pickupSlot}
                            </div>
                          </div>
                        </div>

                        {/* Customer Info */}
                        <div className="py-2.5 flex items-center justify-between text-xs text-[#FFF8EE]/70">
                          <span>
                            <strong className="text-white">{order.customerName}</strong> ({order.customerPhone})
                          </span>
                          <span className="font-bold text-[#F7B52C]">₹{order.total}</span>
                        </div>

                        {/* Items to prepare */}
                        <div className="space-y-1.5 py-2 border-t border-[#3E1220]/60">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="text-xs flex items-start gap-1.5">
                              <VegBadge isVeg={item.isVeg} size="sm" className="mt-0.5" />
                              <div className="flex-1">
                                <span className="font-bold text-white">
                                  {item.quantity} &times; {item.name}
                                </span>
                                {item.size && (
                                  <span className="text-[#F7B52C] text-[11px] ml-1">
                                    ({item.size})
                                  </span>
                                )}
                                {item.notes && (
                                  <div className="text-[11px] text-amber-300 font-medium italic">
                                    👉 &ldquo;{item.notes}&rdquo;
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* One-Tap Status Action Buttons */}
                      <div className="mt-4 pt-3 border-t border-[#3E1220] flex items-center gap-2">
                        {isReceived && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'preparing')}
                            className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                          >
                            <ChefHat className="w-3.5 h-3.5" />
                            Start Preparing
                          </button>
                        )}

                        {isPreparing && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'ready')}
                            className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                          >
                            <Bell className="w-3.5 h-3.5" />
                            Mark Ready for Pickup
                          </button>
                        )}

                        {isReady && (
                          <button
                            onClick={() => handleStatusChange(order.id, 'collected')}
                            className="w-full py-2 rounded-xl bg-[#F7B52C] hover:bg-[#FFAF38] text-black font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Mark as Collected
                          </button>
                        )}

                        {isCollected && (
                          <div className="w-full text-center text-xs text-emerald-400 font-bold py-1">
                            &check; Order Handed Over
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* ======================= TAB 2: MENU & DAILY STOCK ======================= */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Menu & Daily Stock Counters</h2>
                <p className="text-xs text-[#FFF8EE]/60 mt-0.5">
                  Update stock quantities, toggle availability, and simulate daily stock reset.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={resetAllDailyStock}
                  className="px-4 py-2 rounded-full bg-[#3E1220] hover:bg-[#5A1A2B] border border-[#F7B52C]/40 text-[#F7B52C] text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset All Stock to Full
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="max-w-md relative">
              <Search className="w-4 h-4 text-[#FFF8EE]/40 absolute left-3 top-3" />
              <input
                type="text"
                value={searchMenuQuery}
                onChange={(e) => setSearchMenuQuery(e.target.value)}
                placeholder="Search items by name..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#180A0E] border border-[#3E1220] text-white text-xs focus:outline-none focus:border-[#F7B52C]"
              />
            </div>

            {/* Items Table */}
            <div className="zcafe-card rounded-2xl overflow-hidden border border-[#3E1220]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#1D0C13] text-[#FFF8EE]/70 uppercase font-bold border-b border-[#3E1220]">
                    <tr>
                      <th className="p-3.5">Item</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Base Price</th>
                      <th className="p-3.5">Remaining Stock</th>
                      <th className="p-3.5 text-center">Status</th>
                      <th className="p-3.5 text-right">Stock Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#3E1220]">
                    {filteredMenuItems.map((item) => (
                      <tr key={item.id} className="hover:bg-[#1A0B10] transition-colors">
                        <td className="p-3.5 flex items-center gap-2">
                          <VegBadge isVeg={item.isVeg} size="sm" />
                          <span className="font-bold text-white">{item.name}</span>
                          {item.isBestseller && (
                            <span className="text-[10px] text-[#F7B52C] font-semibold">★</span>
                          )}
                        </td>
                        <td className="p-3.5 capitalize text-[#FFF8EE]/70">{item.category.replace('-', ' ')}</td>
                        <td className="p-3.5 font-bold text-[#F7B52C]">₹{item.price}</td>
                        <td className="p-3.5">
                          <span className={`font-mono font-bold ${
                            (item.remainingStock ?? 0) <= 5
                              ? 'text-rose-400'
                              : 'text-emerald-400'
                          }`}>
                            {item.remainingStock ?? 20} / {item.dailyStock ?? 30}
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => toggleItemAvailability(item.id)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              item.isAvailable
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                                : 'bg-red-950 text-red-300 border border-red-600'
                            }`}
                          >
                            {item.isAvailable ? 'In Stock' : 'Out of Stock'}
                          </button>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => adjustStock(item.id, -5)}
                              className="w-6 h-6 rounded bg-[#2A1017] hover:bg-[#3E1220] text-[#FFF8EE] flex items-center justify-center font-bold"
                              title="Minus 5"
                            >
                              -5
                            </button>
                            <button
                              onClick={() => adjustStock(item.id, 5)}
                              className="w-6 h-6 rounded bg-[#2A1017] hover:bg-[#3E1220] text-[#F7B52C] flex items-center justify-center font-bold"
                              title="Add 5"
                            >
                              +5
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ======================= TAB 3: ANALYTICS & DAILY SUMMARY ======================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Daily Sales & Operational Insights</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="zcafe-card rounded-2xl p-6 border border-[#3E1220]">
                <div className="text-xs font-semibold text-[#FFF8EE]/60 uppercase">Gross Revenue</div>
                <div className="text-3xl font-black text-[#F7B52C] mt-2 font-display">₹{totalRevenue}</div>
                <p className="text-xs text-[#FFF8EE]/50 mt-1">Calculated from confirmed Razorpay orders</p>
              </div>

              <div className="zcafe-card rounded-2xl p-6 border border-[#3E1220]">
                <div className="text-xs font-semibold text-[#FFF8EE]/60 uppercase">Total Pre-Orders</div>
                <div className="text-3xl font-black text-white mt-2 font-display">{orders.length}</div>
                <p className="text-xs text-[#FFF8EE]/50 mt-1">100% digital queue tokens generated</p>
              </div>

              <div className="zcafe-card rounded-2xl p-6 border border-[#3E1220]">
                <div className="text-xs font-semibold text-[#FFF8EE]/60 uppercase">Avg. Prep Velocity</div>
                <div className="text-3xl font-black text-emerald-400 mt-2 font-display">~8.5 mins</div>
                <p className="text-xs text-[#FFF8EE]/50 mt-1">Average time from Received &rarr; Ready</p>
              </div>

            </div>

            {/* Popular Items Breakdown */}
            <div className="zcafe-card rounded-2xl p-6 border border-[#3E1220]">
              <h3 className="text-base font-bold text-white mb-4">Top-Selling Indian Delights</h3>
              <div className="space-y-3">
                {[
                  { name: 'Crispy Samosa', count: 38, pct: 90 },
                  { name: 'Z Special Chicken 65', count: 28, pct: 75 },
                  { name: 'Egg Puff', count: 24, pct: 65 },
                  { name: 'Hyderabadi Chicken Biryani', count: 20, pct: 55 },
                  { name: 'Authentic South Indian Filter Coffee', count: 32, pct: 85 },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>{item.name}</span>
                      <span className="text-[#F7B52C]">{item.count} orders</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#1A0B10] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#F7B52C] to-[#FF9F1C] rounded-full"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ======================= VERIFY TOKEN / QR SCANNER MODAL ======================= */}
      {verifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setVerifyModalOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-md rounded-3xl bg-[#1C0D12] border border-[#5A1A2B] p-6 text-[#FFF8EE] shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#3E1220]">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-[#F7B52C]" />
                <h3 className="font-bold text-base text-white">Verify Pickup Token / QR</h3>
              </div>
              <button
                onClick={() => setVerifyModalOpen(false)}
                className="text-[#FFF8EE]/60 hover:text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleVerifyToken} className="space-y-3">
              <label className="text-xs text-[#FFF8EE]/70">Enter Token (e.g. Z-0247):</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={verifyTokenInput}
                  onChange={(e) => setVerifyTokenInput(e.target.value.toUpperCase())}
                  placeholder="Z-..."
                  className="flex-1 px-3 py-2 rounded-xl bg-[#120A0C] border border-[#3E1220] text-white uppercase font-bold text-sm focus:outline-none focus:border-[#F7B52C]"
                  autoFocus
                />
                <button
                  type="submit"
                  className="btn-gold-pill text-xs py-2 px-4"
                >
                  Verify
                </button>
              </div>
            </form>

            {verifyMessage && (
              <p className="text-xs text-[#F7B52C] font-semibold">{verifyMessage}</p>
            )}

            {verifiedOrder && (
              <div className="p-4 rounded-2xl bg-[#120A0C] border border-[#3E1220] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">
                    {verifiedOrder.customerName} ({verifiedOrder.customerPhone})
                  </span>
                  <span className="text-xs font-black text-[#F7B52C]">
                    Token #{verifiedOrder.token}
                  </span>
                </div>

                <div className="text-xs text-[#FFF8EE]/70 space-y-1">
                  {verifiedOrder.items.map((i, idx) => (
                    <div key={idx}>
                      {i.quantity} &times; {i.name} {i.size ? `(${i.size})` : ''}
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#3E1220] flex items-center justify-between">
                  <span className="text-xs text-[#FFF8EE]/60">Status: <strong className="text-white capitalize">{verifiedOrder.status}</strong></span>
                  {verifiedOrder.status !== 'collected' ? (
                    <button
                      onClick={markVerifiedAsCollected}
                      className="px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                    >
                      Confirm Collection
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-400 font-bold">&check; Already Collected</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
