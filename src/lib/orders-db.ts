import { Order, OrderStatus, MenuItem } from '@/types';
import { isFirebaseConfigured, getFirebaseDb } from './firebase';
import { INITIAL_MENU } from '@/data/menu';

const STORAGE_ORDERS_KEY = 'zcafe_orders_store_v1';
const STORAGE_MENU_KEY = 'zcafe_menu_store_v1';
const CHANNEL_NAME = 'zcafe_live_sync_channel';

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

// Generate token e.g. "Z-0247"
export function generateOrderToken(): string {
  const randomNum = Math.floor(100 + Math.random() * 900);
  return `Z-${randomNum}`;
}

// Local Storage Fallback Helpers
export function getLocalOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
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
  if (typeof window === 'undefined') return INITIAL_MENU;
  try {
    const raw = localStorage.getItem(STORAGE_MENU_KEY);
    return raw ? JSON.parse(raw) : INITIAL_MENU;
  } catch (e) {
    return INITIAL_MENU;
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
  const updatedMenu = currentMenu.map((menuItem) => {
    const ordered = order.items.find((i) => i.menuItemId === menuItem.id);
    if (ordered && menuItem.remainingStock !== undefined) {
      const newStock = Math.max(0, menuItem.remainingStock - ordered.quantity);
      return {
        ...menuItem,
        remainingStock: newStock,
        isAvailable: newStock > 0 ? menuItem.isAvailable : false,
      };
    }
    return menuItem;
  });
  saveLocalMenu(updatedMenu);

  return order;
}

/**
 * Get order by ID
 */
export async function getOrderById(id: string): Promise<Order | null> {
  if (isFirebaseConfigured) {
    try {
      const db = await getFirebaseDb();
      if (db) {
        const { doc, getDoc } = await import('firebase/firestore');
        const orderRef = doc(db, 'orders', id);
        const snapshot = await getDoc(orderRef);
        if (snapshot.exists()) {
          return snapshot.data() as Order;
        }
      }
    } catch (e) {
      console.warn('Error reading from Firestore', e);
    }
  }

  const orders = getLocalOrders();
  return orders.find((o) => o.id === id) || null;
}

/**
 * Get order by token (e.g. "Z-0247")
 */
export async function getOrderByToken(token: string): Promise<Order | null> {
  const cleanToken = token.trim().toUpperCase();
  if (isFirebaseConfigured) {
    try {
      const db = await getFirebaseDb();
      if (db) {
        const { collection, query, where, getDocs } = await import('firebase/firestore');
        const q = query(collection(db, 'orders'), where('token', '==', cleanToken));
        const snap = await getDocs(q);
        if (!snap.empty) {
          return snap.docs[0].data() as Order;
        }
      }
    } catch (e) {
      console.warn('Error finding token in Firestore', e);
    }
  }

  const orders = getLocalOrders();
  return orders.find((o) => o.token.toUpperCase() === cleanToken) || null;
}

/**
 * Update order status
 */
export async function updateOrderStatus(id: string, status: OrderStatus): Promise<boolean> {
  const now = Date.now();
  if (isFirebaseConfigured) {
    try {
      const db = await getFirebaseDb();
      if (db) {
        const { doc, updateDoc } = await import('firebase/firestore');
        const orderRef = doc(db, 'orders', id);
        await updateDoc(orderRef, {
          status,
          updatedAt: now,
        });
        return true;
      }
    } catch (e) {
      console.error('Failed to update status in Firestore', e);
    }
  }

  const orders = getLocalOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index !== -1) {
    orders[index] = { ...orders[index], status, updatedAt: now };
    saveLocalOrders(orders);
    return true;
  }
  return false;
}

/**
 * Real-time subscription to an individual order
 */
export function subscribeToOrder(id: string, callback: (order: Order | null) => void): () => void {
  let isSubscribed = true;

  if (isFirebaseConfigured) {
    getFirebaseDb().then(async (db) => {
      if (!isSubscribed || !db) return;
      try {
        const { doc, onSnapshot } = await import('firebase/firestore');
        const orderRef = doc(db, 'orders', id);
        return onSnapshot(orderRef, (docSnap) => {
          if (docSnap.exists()) {
            callback(docSnap.data() as Order);
          } else {
            callback(null);
          }
        });
      } catch (e) {
        console.warn('Firestore subscription fallback', e);
      }
    });
  }

  // Initial local value
  const initial = getLocalOrders().find((o) => o.id === id) || null;
  callback(initial);

  const handleUpdate = () => {
    const updated = getLocalOrders().find((o) => o.id === id) || null;
    callback(updated);
  };

  let ch: BroadcastChannel | null = null;
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    try {
      ch = new BroadcastChannel(CHANNEL_NAME);
      ch.onmessage = (e) => {
        if (e.data?.type === 'ORDERS_UPDATED') {
          handleUpdate();
        }
      };
    } catch (e) {}
  }

  const storageHandler = (e: StorageEvent) => {
    if (e.key === STORAGE_ORDERS_KEY) {
      handleUpdate();
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', storageHandler);
  }

  return () => {
    isSubscribed = false;
    if (ch) ch.close();
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', storageHandler);
    }
  };
}

/**
 * Real-time subscription to all orders for Kitchen / Admin
 */
export function subscribeToAllOrders(callback: (orders: Order[]) => void): () => void {
  let isSubscribed = true;

  if (isFirebaseConfigured) {
    getFirebaseDb().then(async (db) => {
      if (!isSubscribed || !db) return;
      try {
        const { collection, query, orderBy, onSnapshot } = await import('firebase/firestore');
        const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
        return onSnapshot(q, (snapshot) => {
          const orders = snapshot.docs.map((doc) => doc.data() as Order);
          callback(orders);
        });
      } catch (e) {
        console.warn('Firestore all orders fallback', e);
      }
    });
  }

  // Local fallback
  callback(getLocalOrders());

  const handleUpdate = () => {
    callback(getLocalOrders());
  };

  let ch: BroadcastChannel | null = null;
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    try {
      ch = new BroadcastChannel(CHANNEL_NAME);
      ch.onmessage = (e) => {
        if (e.data?.type === 'ORDERS_UPDATED') {
          handleUpdate();
        }
      };
    } catch (e) {}
  }

  const storageHandler = (e: StorageEvent) => {
    if (e.key === STORAGE_ORDERS_KEY) {
      handleUpdate();
    }
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', storageHandler);
  }

  return () => {
    isSubscribed = false;
    if (ch) ch.close();
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', storageHandler);
    }
  };
}
