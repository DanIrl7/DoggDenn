'use client';

import { useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { useCartStore, type CartItem } from '@/app/store/cartStore';

export default function CartHydrator() {
  const { user, isLoaded } = useUser();
  const setItems = useCartStore((state) => state.setItems);
  const setIsHydrating = useCartStore((state) => state.setIsHydrating);
  const setHasHydrated = useCartStore((state) => state.setHasHydrated);
  const hasHydratedRef = useRef(false);

  useEffect(() => {
    if (!isLoaded) return;

    // On sign-out, ensure the in-memory cart is cleared.
    if (!user) {
      setItems([]);
      setIsHydrating(false);
      setHasHydrated(true);
      hasHydratedRef.current = false;
      return;
    }

    if (hasHydratedRef.current) return;
    hasHydratedRef.current = true;
    setHasHydrated(false);

    const hydrate = async () => {
      try {
        setIsHydrating(true);
        const response = await fetch('/api/cart', { method: 'GET' });
        if (!response.ok) return;

        const data = (await response.json()) as { items?: CartItem[] };
        if (Array.isArray(data.items)) {
          setItems(data.items);
        }
      } catch {
        // Ignore hydration failures; cart can still be used and will persist on next successful API call.
      } finally {
        setIsHydrating(false);
        setHasHydrated(true);
      }
    };

    hydrate();
  }, [isLoaded, user, setItems, setIsHydrating, setHasHydrated]);

  return null;
}
