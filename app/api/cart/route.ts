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

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const cart = await prisma.tempCart.findFirst({
      where: { userId },
    });

    if (!cart) {
      return NextResponse.json({ items: [] satisfies CartItemInput[] }, { status: 200 });
    }

    const items = JSON.parse(cart.items) as CartItemInput[];

    const missingImageIds = items
      .filter((item) => item.image == null || item.image === '')
      .map((item) => item.id);

    if (missingImageIds.length === 0) {
      return NextResponse.json({ items }, { status: 200 });
    }

    const products = await prisma.product.findMany({
      where: { id: { in: missingImageIds } },
      select: { id: true, image: true },
    });

    const imageById = new Map(products.map((product) => [product.id, product.image] as const));
    let didUpdate = false;
    const hydratedItems = items.map((item) => {
      if (item.image == null || item.image === '') {
        const image = imageById.get(item.id);
        if (image) {
          didUpdate = true;
          return { ...item, image };
        }
      }
      return item;
    });

    if (didUpdate) {
      await prisma.tempCart.update({
        where: { id: cart.id },
        data: { items: JSON.stringify(hydratedItems) },
      });
    }

    return NextResponse.json({ items: hydratedItems }, { status: 200 });
  } catch (error) {
    console.error('Get cart error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
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
    const { productId, name, price, quantity, image } = await request.json();

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

      // If the existing item doesn't have an image yet, allow setting it.
      if (items[existingItemIndex].image == null && image !== undefined) {
        items[existingItemIndex].image = image;
      }
    } else {
      // Add new item
      items.push({
        id: productId,
        name,
        price,
        quantity,
        image: image ?? null,
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

export async function DELETE() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const cart = await prisma.tempCart.findFirst({
      where: { userId },
    });

    if (cart) {
      await prisma.tempCart.delete({
        where: { id: cart.id },
      });
    }

    return NextResponse.json({ message: 'Cart cleared' }, { status: 200 });
  } catch (error) {
    console.error('Clear cart error:', error);
    return NextResponse.json({ message: 'Failed to clear cart' }, { status: 500 });
  }
}
