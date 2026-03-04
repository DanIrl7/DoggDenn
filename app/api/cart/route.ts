import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

interface CartItemInput {
  id: string;
  name: string;
  price: number;
  quantity: number;
  addedAt: string;
}

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const { productId, name, price, quantity } = await request.json();

    if (!productId || !name || price === undefined || !quantity) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get or create user's cart
    const cart = await prisma.tempCart.findFirst({
      where: { userId },
    });

    // Parse existing items or create empty array
    const items = cart ? JSON.parse(cart.items) : [];

    // Find and update existing item or add new one
    const existingItemIndex = items.findIndex((item: CartItemInput) => item.id === productId);

    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      items.push({
        id: productId,
        name,
        price,
        quantity,
        addedAt: new Date().toISOString(),
      });
    }

    // Set expiration to 1 month from now
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Update if exists, create if not
    let updatedCart;
    
    if (cart) {
      updatedCart = await prisma.tempCart.update({
        where: { id: cart.id },
        data: {
          items: JSON.stringify(items),
          expiresAt,
        },
      });
    } else {
      updatedCart = await prisma.tempCart.create({
        data: {
          userId,
          items: JSON.stringify(items),
          expiresAt,
        },
      });
    }

    return NextResponse.json(
      { message: 'Item added to cart', cart: updatedCart },
      { status: 200 }
    );
  } catch (error) {
    console.error('Cart error:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const productId = url.pathname.split('/').pop();

    if (!productId) {
      return NextResponse.json(
        { message: 'Product ID required' },
        { status: 400 }
      );
    }

    const cart = await prisma.tempCart.findFirst({
      where: { userId },
    });

    if (!cart) {
      return NextResponse.json(
        { message: 'Cart not found' },
        { status: 404 }
      );
    }

    let items = JSON.parse(cart.items);
    items = items.filter((item: CartItemInput) => item.id !== productId);

    if (items.length === 0) {
      // Delete empty cart
      await prisma.tempCart.delete({
        where: { id: cart.id },
      });
    } else {
      await prisma.tempCart.update({
        where: { id: cart.id },
        data: { items: JSON.stringify(items) },
      });
    }

    return NextResponse.json(
      { message: 'Item removed from cart' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete cart error:', error);
    return NextResponse.json(
      { message: 'Failed to remove item from cart' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const productId = url.pathname.split('/').pop();
    const { quantity } = await request.json();

    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { message: 'Product ID and quantity required' },
        { status: 400 }
      );
    }

    const cart = await prisma.tempCart.findFirst({
      where: { userId },
    });

    if (!cart) {
      return NextResponse.json(
        { message: 'Cart not found' },
        { status: 404 }
      );
    }

    const items = JSON.parse(cart.items);
    const itemIndex = items.findIndex((item: CartItemInput) => item.id === productId);

    if (itemIndex < 0) {
      return NextResponse.json(
        { message: 'Item not found in cart' },
        { status: 404 }
      );
    }

    if (quantity <= 0) {
      items.splice(itemIndex, 1);
    } else {
      items[itemIndex].quantity = quantity;
    }

    await prisma.tempCart.update({
      where: { id: cart.id },
      data: { items: JSON.stringify(items) },
    });

    return NextResponse.json(
      { message: 'Cart updated' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Patch cart error:', error);
    return NextResponse.json(
      { message: 'Failed to update cart' },
      { status: 500 }
    );
  }
}
