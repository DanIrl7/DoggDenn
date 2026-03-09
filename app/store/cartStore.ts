import { create } from 'zustand';
import { Product } from '../types';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
  addedAt: string;
}

interface CartStore {
  items: CartItem[];
  isHydrating: boolean;
  hasHydrated: boolean;
  setItems: (items: CartItem[]) => void;
  setIsHydrating: (isHydrating: boolean) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => Promise<boolean>;
  updateQuantity: (productId: string, quantity: number) => Promise<boolean>;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isHydrating: false,
  hasHydrated: false,

  setItems: (items: CartItem[]) => {
    set({ items });
  },

  setIsHydrating: (isHydrating: boolean) => {
    set({ isHydrating });
  },

  setHasHydrated: (hasHydrated: boolean) => {
    set({ hasHydrated });
  },

  addItem: (product: Product, quantity: number) => {
    set((state) => {
      const existingItem = state.items.find(item => item.id === product.id);
      if (existingItem) {
        return {
          items: state.items.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity,
            image: product.image ?? product.images?.[0] ?? null,
            addedAt: new Date().toISOString(),
          },
        ],
      };
    });
  },

  removeItem: async (productId: string) => {
    try {
      const response = await fetch(`/api/cart/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }

      set((state) => ({
        items: state.items.filter(item => item.id !== productId),
      }));

      return true;
    } catch (error) {
      console.error('Failed to remove item:', error);
      return false;
    }
  },

  updateQuantity: async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      return await get().removeItem(productId);
    }

    try {
      const response = await fetch(`/api/cart/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        throw new Error('Failed to update cart');
      }

      set((state) => ({
        items: state.items.map(item =>
          item.id === productId
            ? { ...item, quantity }
            : item
        ),
      }));

      return true;
    } catch (error) {
      console.error('Failed to update quantity:', error);
      return false;
    }
  },

  clearCart: () => {
    set({ items: [] });
  },

  getTotal: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },
}));
