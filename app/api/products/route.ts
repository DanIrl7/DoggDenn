import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');

    const products = await prisma.product.findMany({
      where: categoryId ? { categoryId } : undefined,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Convert Decimal prices to numbers
    const productsWithNumbers = products.map(product => ({
      ...product,
      price: parseFloat(product.price.toString()),
    }));

    return NextResponse.json(productsWithNumbers);
  } catch (error) {
    console.error('Fetch products error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const { name, description, price, categoryId, image, inventory } = body;

    // Validate required fields
    if (!name || !description || !price || !categoryId || inventory === undefined) {
      return NextResponse.json(
        { error: 'Name, description, price, categoryId, and inventory are required' },
        { status: 400 }
      );
    }

    // Create the product
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        image: image,
        categoryId: categoryId,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Failed to create product', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}