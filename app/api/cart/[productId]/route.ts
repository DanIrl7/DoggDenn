import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

interface CartItemInput {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
  addedAt: string;
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = await params;

    if (!productId) {
      return NextResponse.json({ message: 'Product ID required' }, { status: 400 });
    }

    const cart = await prisma.tempCart.findFirst({
      where: { userId },
    });

    if (!cart) {
      return NextResponse.json({ message: 'Cart not found' }, { status: 404 });
    }

    let items = JSON.parse(cart.items) as CartItemInput[];
    items = items.filter((item) => item.id !== productId);

    if (items.length === 0) {
      await prisma.tempCart.delete({ where: { id: cart.id } });
    } else {
      await prisma.tempCart.update({
        where: { id: cart.id },
        data: { items: JSON.stringify(items) },
      });
    }

    return NextResponse.json({ message: 'Item removed from cart' }, { status: 200 });
  } catch (error) {
    console.error('Delete cart error:', error);
    return NextResponse.json(
      { message: 'Failed to remove item from cart' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { productId } = await params;
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
      return NextResponse.json({ message: 'Cart not found' }, { status: 404 });
    }

    const items = JSON.parse(cart.items) as CartItemInput[];
    const itemIndex = items.findIndex((item) => item.id === productId);

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

    if (items.length === 0) {
      await prisma.tempCart.delete({ where: { id: cart.id } });
    } else {
      await prisma.tempCart.update({
        where: { id: cart.id },
        data: { items: JSON.stringify(items) },
      });
    }

    return NextResponse.json({ message: 'Cart updated' }, { status: 200 });
  } catch (error) {
    console.error('Patch cart error:', error);
    return NextResponse.json(
      { message: 'Failed to update cart' },
      { status: 500 }
    );
  }
}
