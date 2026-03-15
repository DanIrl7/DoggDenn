import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCartStore, type CartItem } from '../cartStore';
import type { Product } from '../../types';

// HELPER: Create a mock product for testing
const createMockProduct = (overrides?: Partial<Product>): Product => {
  return {
    id: '1',
    name: 'Test Product',
    description: 'A test product',
    price: 10,
    image: null,
    categoryId: null,
    ...overrides,
  };
};

describe('cartStore', () => {
  beforeEach(() => {
    // Clear the store before each test
    useCartStore.setState({ items: [] });
  });

  describe('addItem', () => {
    it('should add a product to an empty cart', () => {
      const product = createMockProduct();
      const store = useCartStore.getState();

      // ACT
      store.addItem(product, 1);

      // ASSERT - Get fresh state after update
      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].id).toBe('1');
      expect(items[0].name).toBe('Test Product');
      expect(items[0].price).toBe(10);
      expect(items[0].quantity).toBe(1);
    });

    it('should increase quantity if item already exists', () => {
      const product = createMockProduct();
      const store = useCartStore.getState();

      // ACT - Add the same product twice
      store.addItem(product, 1);
      store.addItem(product, 1);

      // ASSERT - Get fresh state after update
      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1); // Still only 1 unique item
      expect(items[0].quantity).toBe(2); // But quantity is 2
    });

    it('should add multiple different products', () => {
      const store = useCartStore.getState();

      // ACT
      store.addItem(createMockProduct({ id: '1', price: 10 }), 1);
      store.addItem(createMockProduct({ id: '2', price: 20 }), 1);

      // ASSERT - Get fresh state after update
      const { items } = useCartStore.getState();
      expect(items).toHaveLength(2);
      expect(items[0].id).toBe('1');
      expect(items[1].id).toBe('2');
    });
  });

  describe('getTotal', () => {
    it('should calculate correct total for single item', () => {
      const store = useCartStore.getState();

      store.addItem(createMockProduct({ price: 10 }), 1);

      expect(store.getTotal()).toBe(10);
    });

    it('should calculate correct total with quantity', () => {
      const store = useCartStore.getState();

      store.addItem(createMockProduct({ price: 10 }), 3); // 3 items at $10 = $30

      expect(store.getTotal()).toBe(30);
    });

    it('should calculate total for multiple items', () => {
      const store = useCartStore.getState();

      store.addItem(createMockProduct({ id: '1', price: 10 }), 2); // $20
      store.addItem(createMockProduct({ id: '2', price: 15 }), 1); // $15

      expect(store.getTotal()).toBe(35); // $20 + $15
    });
  });

  describe('getItemCount', () => {
    it('should return total quantity of all items', () => {
      const store = useCartStore.getState();

      store.addItem(createMockProduct({ id: '1' }), 2);
      store.addItem(createMockProduct({ id: '2' }), 3);

      expect(store.getItemCount()).toBe(5); // 2 + 3
    });

    it('should return 0 for empty cart', () => {
      const store = useCartStore.getState();

      expect(store.getItemCount()).toBe(0);
    });
  });

  describe('clearCart', () => {
    it('should empty the cart', () => {
      const store = useCartStore.getState();

      store.addItem(createMockProduct(), 1);
      store.clearCart();

      expect(store.items).toHaveLength(0);
    });
  });

  describe('removeItem', () => {
    const product = createMockProduct()
    // TEST 1: WHEN THE API SUCCEEDS
    it('should remove item when API succeeds', async () => {
        //ARRANGE
    const store = useCartStore.getState()
    store.addItem(product, 1)

    // MOCK FETCH TO RETURN SUCCEES
    global.fetch = vi.fn().mockResolvedValue({ ok: true })

    // ACT
    const result = await store.removeItem('1')

    // ASSERT
    expect(result).toBe(true) // Function returned success
    expect(useCartStore.getState().items).toHaveLength(0) //ITEMS REMOVED
    expect(global.fetch).toHaveBeenCalledWith('/api/cart/1', { method: 'DELETE' })
    })

    // TEST 2: When API fails
  it('should not remove item when API fails', async () => {
    // ARRANGE
    const store = useCartStore.getState()
    store.addItem(product, 1)
    
    // Mock fetch to return failure
    global.fetch = vi.fn().mockResolvedValue({ ok: false })
    
    // ACT
    const result = await store.removeItem('1')
    
    // ASSERT
    expect(result).toBe(false) // Function returned failure
    expect(useCartStore.getState().items).toHaveLength(1) // Item still there!
  })
  })
  
});
