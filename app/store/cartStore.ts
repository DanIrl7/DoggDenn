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
  setItems: (items: CartItem[]) => void;
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  setItems: (items: CartItem[]) => {
    set({ items });
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
            image: product.image ?? null,
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
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  },

  updateQuantity: async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
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
    } catch (error) {
      console.error('Failed to update quantity:', error);
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
