import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, MenuItem } from '@/types';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  pickupSlot: string;
  customerName: string;
  customerPhone: string;
  couponCode: string;
  discount: number;
  
  // Actions
  setIsOpen: (isOpen: boolean) => void;
  addItem: (item: MenuItem, selectedSize?: string, notes?: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  updateNotes: (id: string, notes: string) => void;
  clearCart: () => void;
  setPickupSlot: (slot: string) => void;
  setCustomerInfo: (name: string, phone: string) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  
  // Computed helpers
  getSubtotal: () => number;
  getGst: () => number;
  getTotal: () => number;
  getTotalCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      pickupSlot: 'ASAP (10-15 mins)',
      customerName: '',
      customerPhone: '',
      couponCode: '',
      discount: 0,

      setIsOpen: (isOpen) => set({ isOpen }),

      addItem: (item, selectedSize, notes = '') => {
        const sizeVariant = item.sizeVariants?.find(v => v.name === selectedSize);
        const price = sizeVariant ? sizeVariant.price : item.price;
        const cartId = selectedSize ? `${item.id}-${selectedSize}` : item.id;

        set((state) => {
          const existingIndex = state.items.findIndex((i) => i.id === cartId);
          if (existingIndex > -1) {
            const newItems = [...state.items];
            newItems[existingIndex].quantity += 1;
            if (notes && !newItems[existingIndex].notes) {
              newItems[existingIndex].notes = notes;
            }
            return { items: newItems, isOpen: true };
          } else {
            const newItem: CartItem = {
              id: cartId,
              menuItemId: item.id,
              name: item.name,
              price,
              quantity: 1,
              selectedSize: selectedSize || (item.sizeVariants ? item.sizeVariants[0].name : undefined),
              notes,
              isVeg: item.isVeg,
              image: item.image,
            };
            return { items: [...state.items, newItem], isOpen: true };
          }
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, delta) => {
        set((state) => {
          const newItems = state.items
            .map((item) => {
              if (item.id === id) {
                const newQty = item.quantity + delta;
                return newQty > 0 ? { ...item, quantity: newQty } : null;
              }
              return item;
            })
            .filter((item): item is CartItem => item !== null);
          return { items: newItems };
        });
      },

      updateNotes: (id, notes) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, notes } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], couponCode: '', discount: 0 });
      },

      setPickupSlot: (slot) => set({ pickupSlot: slot }),

      setCustomerInfo: (customerName, customerPhone) =>
        set({ customerName, customerPhone }),

      applyCoupon: (code: string) => {
        const clean = code.trim().toUpperCase();
        const subtotal = get().getSubtotal();
        if (clean === 'ZCAFE50' || clean === 'ZPUFF') {
          if (subtotal < 100) {
            return { success: false, message: 'Minimum ₹100 required for ZCAFE50' };
          }
          const discount = Math.min(50, Math.round(subtotal * 0.2));
          set({ couponCode: clean, discount });
          return { success: true, message: `Coupon ${clean} applied! You saved ₹${discount}` };
        } else if (clean === 'FIRST10') {
          const discount = Math.round(subtotal * 0.1);
          set({ couponCode: clean, discount });
          return { success: true, message: `10% discount applied! You saved ₹${discount}` };
        } else {
          return { success: false, message: 'Invalid coupon code. Try ZCAFE50 or FIRST10' };
        }
      },

      removeCoupon: () => set({ couponCode: '', discount: 0 }),

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },

      getGst: () => {
        const subtotal = get().getSubtotal();
        const discounted = Math.max(0, subtotal - get().discount);
        return Math.round(discounted * 0.05); // 5% GST for restaurant/kiosk
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().discount;
        const taxable = Math.max(0, subtotal - discount);
        const gst = Math.round(taxable * 0.05);
        return taxable + gst;
      },

      getTotalCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'zcafe-cart-storage',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      })),
      partialize: (state) => ({
        items: state.items,
        pickupSlot: state.pickupSlot,
        customerName: state.customerName,
        customerPhone: state.customerPhone,
      }),
    }
  )
);
