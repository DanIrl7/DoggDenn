import { NextResponse } from 'next/server';
import prisma from '@/app/generated/prisma';

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect();
    
    // Get actual data counts
    const categoryCount = await prisma.category.count();
    const productCount = await prisma.product.count();
    const userCount = await prisma.user.count();
    
    // Get sample categories if any exist
    const categories = await prisma.category.findMany({
      take: 5
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Neon database connected successfully',
      counts: {
        categories: categoryCount,
        products: productCount,
        users: userCount
      },
      sampleCategories: categories
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}