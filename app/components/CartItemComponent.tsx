'use client';

import Image from 'next/image';
import { useState } from 'react';
import { CartItem } from '@/app/store/cartStore';
import { useCartStore } from '@/app/store/cartStore';
import { useToast } from '@/app/components/ToastProvider';

interface CartItemProps {
  item: CartItem;
}

export default function CartItemComponent({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const { showToast } = useToast();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = parseInt(e.target.value, 10);
    if (quantity > 0) {
      updateQuantity(item.id, quantity);
    }
  };

  const handleRemove = async () => {
    if (isRemoving) return;
    setIsRemoving(true);

    const ok = await removeItem(item.id);
    if (ok) {
      showToast('Item removed from cart', 'success');
    } else {
      showToast('Failed to remove item', 'error');
    }

    setIsRemoving(false);
  };

  return (
    <div className={`flex gap-4 border-b pb-4 ${isRemoving ? 'opacity-60' : ''}`}>
      {/* Product Image */}
      <div className="relative w-24 h-24 flex-shrink-0">
        <Image
          src={item.image || '/placeholder.jpg'}
          alt={item.name}
          fill
          className="object-cover rounded-lg"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1">
        <h3 className="font-semibold text-lg text-gray-900">{item.name}</h3>
        <p className="text-gray-600 text-sm mb-2">${item.price.toFixed(2)} each</p>

        {/* Quantity Control */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Qty:</label>
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={handleQuantityChange}
            className="w-16 border border-gray-300 rounded px-2 py-1 text-center"
          />
        </div>
      </div>

      {/* Price and Remove */}
      <div className="flex flex-col items-end justify-between">
        <p className="font-bold text-lg text-gray-900">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
        <button
          onClick={handleRemove}
          disabled={isRemoving}
          className={`text-sm font-medium flex items-center gap-2 ${
            isRemoving
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-red-500 hover:text-red-700'
          }`}
        >
          {isRemoving && (
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          )}
          {isRemoving ? 'Removing…' : 'Remove'}
        </button>
      </div>
    </div>
  );
}
