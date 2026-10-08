import { Order, OrderStatus, MenuItem } from '@/types';
import { isFirebaseConfigured, getFirebaseDb } from './firebase';
import { MENU_ITEMS } from '@/data/menu';

const STORAGE_ORDERS_KEY = 'zcafe_orders_store_v2';
const STORAGE_MENU_KEY = 'zcafe_menu_store_v2';
const CHANNEL_NAME = 'zcafe_live_sync_channel_v2';

// Helper to get broadcast channel for cross-tab realtime updates
function getChannel(): BroadcastChannel | null {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    try {
      return new BroadcastChannel(CHANNEL_NAME);
    } catch (e) {
      return null;
    }
  }
  return null;
}

let lastTokenSeq = 104;

// Generate token e.g. "104", "105"
export function generateOrderToken(): { token: string; tokenNumber: number; orderId: string } {
  lastTokenSeq = Math.floor(100 + Math.random() * 900);
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const orderId = `ZC-${yyyy}${mm}${dd}-${lastTokenSeq}`;
  return {
    token: String(lastTokenSeq),
    tokenNumber: lastTokenSeq,
    orderId,
  };
}

// Initial realistic demo orders
const INITIAL_DEMO_ORDERS: Order[] = [
  {
    id: 'ZC-20261008-104',
    token: '104',
    tokenNumber: 104,
    customerName: 'Paranitharan',
    customerPhone: '9876543210',
    studentId: 'RATH2024CS042',
    department: 'Computer Science & Engg',
    items: [
      {
        menuItemId: 'chicken-biryani',
        name: 'Z Special Chicken Dum Biryani',
        size: 'Regular Plate',
        price: 120,
        quantity: 1,
        isVeg: false,
        notes: 'Extra raita please',
      },
      {
        menuItemId: 'fresh-lime',
        name: 'Fresh Lime Soda (Sweet & Salt)',
        price: 30,
        quantity: 1,
        isVeg: true,
      },
    ],
    subtotal: 150,
    gst: 8,
    discount: 0,
    total: 158,
    status: 'preparing',
    pickupSlot: '12:20 PM – 12:30 PM',
    pickupDate: '08 October 2026',
    paymentStatus: 'paid',
    paymentMethod: 'UPI',
    paymentId: 'pay_mock_upi_104',
    createdAt: Date.now() - 12 * 60 * 1000,
    updatedAt: Date.now() - 5 * 60 * 1000,
    isQrUsed: false,
  },
  {
    id: 'ZC-20261008-098',
    token: '098',
    tokenNumber: 98,
    customerName: 'Kavitha S.',
    customerPhone: '9840123456',
    studentId: 'RATH2024EC019',
    department: 'Electronics & Comm',
    items: [
      {
        menuItemId: 'samosa',
        name: 'Crispy Punjabi Samosa (2 pcs)',
        price: 15,
        quantity: 2,
        isVeg: true,
      },
      {
        menuItemId: 'tea',
        name: 'Cutting Masala Chai',
        price: 15,
        quantity: 2,
        isVeg: true,
        notes: 'Extra hot ginger',
      },
    ],
    subtotal: 60,
    gst: 3,
    discount: 0,
    total: 63,
    status: 'ready',
    pickupSlot: '11:20 AM – 11:30 AM',
    pickupDate: '08 October 2026',
    paymentStatus: 'paid',
    paymentMethod: 'UPI',
    createdAt: Date.now() - 25 * 60 * 1000,
    updatedAt: Date.now() - 2 * 60 * 1000,
    isQrUsed: false,
  },
  {
    id: 'ZC-20261008-085',
    token: '085',
    tokenNumber: 85,
    customerName: 'Vikram R.',
    customerPhone: '9443128900',
    studentId: 'RATH2023ME055',
    department: 'Mechanical Engg',
    items: [
      {
        menuItemId: 'veg-puff',
        name: 'Bakery Style Vegetable Puff',
        price: 20,
        quantity: 2,
        isVeg: true,
      },
      {
        menuItemId: 'cold-coffee',
        name: 'Creamy Frappe Cold Coffee',
        price: 50,
        quantity: 1,
        isVeg: true,
      },
    ],
    subtotal: 90,
    gst: 5,
    discount: 0,
    total: 95,
    status: 'collected',
    pickupSlot: '11:10 AM – 11:20 AM',
    pickupDate: '08 October 2026',
    paymentStatus: 'paid',
    paymentMethod: 'Card',
    createdAt: Date.now() - 55 * 60 * 1000,
    updatedAt: Date.now() - 30 * 60 * 1000,
    collectedAt: Date.now() - 30 * 60 * 1000,
    isQrUsed: true,
  },
  {
    id: 'ZC-20261008-112',
    token: '112',
    tokenNumber: 112,
    customerName: 'Dinesh Kumar',
    customerPhone: '9789234511',
    studentId: 'RATH2025IT008',
    department: 'Information Tech',
    items: [
      {
        menuItemId: 'grilled-sandwich',
        name: 'Paneer Cheese Grilled Sandwich',
        price: 60,
        quantity: 1,
        isVeg: true,
      },
      {
        menuItemId: 'watermelon-juice',
        name: 'Fresh Chilled Watermelon Juice',
        price: 40,
        quantity: 1,
        isVeg: true,
      },
    ],
    subtotal: 100,
    gst: 5,
    discount: 10,
    total: 95,
    status: 'received',
    pickupSlot: '12:00 PM – 12:10 PM',
    pickupDate: '08 October 2026',
    paymentStatus: 'paid',
    paymentMethod: 'UPI',
    createdAt: Date.now() - 4 * 60 * 1000,
    updatedAt: Date.now() - 4 * 60 * 1000,
    isQrUsed: false,
  },
];

// Local Storage Fallback Helpers
export function getLocalOrders(): Order[] {
  if (typeof window === 'undefined') return INITIAL_DEMO_ORDERS;
  try {
    const raw = localStorage.getItem(STORAGE_ORDERS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(INITIAL_DEMO_ORDERS));
      return INITIAL_DEMO_ORDERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_DEMO_ORDERS;
  }
}

export function saveLocalOrders(orders: Order[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(orders));
    const ch = getChannel();
    if (ch) {
      ch.postMessage({ type: 'ORDERS_UPDATED', timestamp: Date.now() });
      ch.close();
    }
  } catch (e) {
    console.error('Failed to save orders locally', e);
  }
}

// Menu Store Helpers
export function getLocalMenu(): MenuItem[] {
  if (typeof window === 'undefined') return MENU_ITEMS;
  try {
    const raw = localStorage.getItem(STORAGE_MENU_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_MENU_KEY, JSON.stringify(MENU_ITEMS));
      return MENU_ITEMS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return MENU_ITEMS;
  }
}

export function saveLocalMenu(menu: MenuItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_MENU_KEY, JSON.stringify(menu));
    const ch = getChannel();
    if (ch) {
      ch.postMessage({ type: 'MENU_UPDATED', timestamp: Date.now() });
      ch.close();
    }
  } catch (e) {
    console.error('Failed to save menu locally', e);
  }
}

/**
 * Creates an order in Firestore or LocalStorage
 */
export async function createOrderRecord(order: Order): Promise<Order> {
  if (isFirebaseConfigured) {
    try {
      const db = await getFirebaseDb();
      if (db) {
        const { doc, setDoc } = await import('firebase/firestore');
        const orderRef = doc(db, 'orders', order.id);
        await setDoc(orderRef, order);
        return order;
      }
    } catch (err) {
      console.warn('Firestore createOrder failed, falling back to local sync:', err);
    }
  }

  // Local fallback
  const orders = getLocalOrders();
  const updated = [order, ...orders.filter((o) => o.id !== order.id)];
  saveLocalOrders(updated);

  // Decrement menu stock if configured
  const currentMenu = getLocalMenu();
  let menuUpdated = false;
  order.items.forEach((item) => {
    const idx = currentMenu.findIndex((m) => m.id === item.menuItemId);
    if (idx > -1 && typeof currentMenu[idx].remainingStock === 'number') {
      currentMenu[idx].remainingStock = Math.max(
        0,
        (currentMenu[idx].remainingStock || 0) - item.quantity
      );
      if (currentMenu[idx].remainingStock === 0) {
        currentMenu[idx].isAvailable = false;
      }
      menuUpdated = true;
    }
  });

  if (menuUpdated) {
    saveLocalMenu(currentMenu);
  }

  return order;
}

/**
 * Fetch a single order by ID or Token
 */
export async function getOrderRecord(orderIdOrToken: string): Promise<Order | null> {
  const cleanId = orderIdOrToken.trim();

  // Try local first for instant responsive feel
  const localOrders = getLocalOrders();
  const match = localOrders.find(
    (o) => o.id === cleanId || o.token === cleanId || o.token === cleanId.replace('Z-', '').replace('#', '')
  );
  if (match) return match;

  if (isFirebaseConfigured) {
    try {
      const db = await getFirebaseDb();
      if (db) {
        const { doc, getDoc } = await import('firebase/firestore');
        const docRef = doc(db, 'orders', cleanId);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          return snap.data() as Order;
        }
      }
    } catch (e) {
      console.warn('Firebase order fetch error:', e);
    }
  }

  return null;
}

/**
 * Update an order's status (received -> accepted -> preparing -> ready -> collected)
 */
export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<boolean> {
  const localOrders = getLocalOrders();
  const idx = localOrders.findIndex((o) => o.id === orderId || o.token === orderId);
  
  if (idx > -1) {
    localOrders[idx].status = status;
    localOrders[idx].updatedAt = Date.now();
    if (status === 'collected') {
      localOrders[idx].collectedAt = Date.now();
      localOrders[idx].isQrUsed = true;
    }
    saveLocalOrders([...localOrders]);
  }

  if (isFirebaseConfigured) {
    try {
      const db = await getFirebaseDb();
      if (db) {
        const { doc, updateDoc } = await import('firebase/firestore');
        const orderRef = doc(db, 'orders', orderId);
        const updateData: any = { status, updatedAt: Date.now() };
        if (status === 'collected') {
          updateData.collectedAt = Date.now();
          updateData.isQrUsed = true;
        }
        await updateDoc(orderRef, updateData);
      }
    } catch (err) {
      console.warn('Firestore updateOrderStatus fallback:', err);
    }
  }

  return true;
}

/**
 * Staff QR Verification & Collection handler with DUPLICATE SCAN PREVENTION
 */
export function verifyAndCollectQr(orderIdOrToken: string): {
  success: boolean;
  message: string;
  order?: Order;
  alreadyUsed?: boolean;
  collectedAt?: number;
} {
  const clean = orderIdOrToken.trim();
  const orders = getLocalOrders();
  
  const order = orders.find(
    (o) => o.id === clean || o.token === clean || o.token === clean.replace('#', '')
  );

  if (!order) {
    return {
      success: false,
      message: `Invalid QR Code or Token #${clean}. No matching order found.`,
    };
  }

  if (order.isQrUsed || order.status === 'collected') {
    return {
      success: false,
      alreadyUsed: true,
      message: `QR ALREADY USED! This order was already collected.`,
      collectedAt: order.collectedAt || order.updatedAt,
      order,
    };
  }

  // Mark as collected
  order.status = 'collected';
  order.isQrUsed = true;
  order.collectedAt = Date.now();
  order.updatedAt = Date.now();
  saveLocalOrders([...orders]);

  return {
    success: true,
    message: `ORDER VERIFIED ✓ Token #${order.token} marked as collected.`,
    order,
  };
}

/**
 * Real-time order subscription (works with Firestore listener & BroadcastChannel locally)
 */
export function subscribeToOrder(orderId: string, onUpdate: (order: Order | null) => void): () => void {
  let isUnsubscribed = false;

  const checkLocal = () => {
    if (isUnsubscribed) return;
    const orders = getLocalOrders();
    const found = orders.find(
      (o) => o.id === orderId || o.token === orderId || o.token === orderId.replace('Z-', '').replace('#', '')
    );
    if (found) {
      onUpdate(found);
    }
  };

  // Immediate check
  checkLocal();

  // Listen to cross-tab updates
  let ch: BroadcastChannel | null = null;
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    try {
      ch = new BroadcastChannel(CHANNEL_NAME);
      ch.onmessage = (ev) => {
        if (ev.data?.type === 'ORDERS_UPDATED') {
          checkLocal();
        }
      };
    } catch (e) {}
  }

  // Periodic fallback
  const interval = setInterval(checkLocal, 2500);

  return () => {
    isUnsubscribed = true;
    clearInterval(interval);
    if (ch) ch.close();
  };
}

/**
 * Subscribe to all orders for Kitchen / Admin KDS board
 */
export function subscribeToAllOrders(onUpdate: (orders: Order[]) => void): () => void {
  let isUnsubscribed = false;

  const pushLatest = () => {
    if (isUnsubscribed) return;
    onUpdate(getLocalOrders());
  };

  pushLatest();

  let ch: BroadcastChannel | null = null;
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    try {
      ch = new BroadcastChannel(CHANNEL_NAME);
      ch.onmessage = (ev) => {
        if (ev.data?.type === 'ORDERS_UPDATED') {
          pushLatest();
        }
      };
    } catch (e) {}
  }

  const interval = setInterval(pushLatest, 2500);

  return () => {
    isUnsubscribed = true;
    clearInterval(interval);
    if (ch) ch.close();
  };
}

// Alias for backwards compatibility
export const getOrderByToken = getOrderRecord;
