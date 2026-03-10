import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, email: true, name: true, id: true },
    });

    if (!user) {
      return NextResponse.json(
        { 
          error: 'User not found in database',
          clerkId: userId,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      userId,
      role: user.role,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    console.error('Error in /api/user/role:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user role', details: String(error) },
      { status: 500 }
    );
  }
}
