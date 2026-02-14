import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const { userId } = await auth();
    console.log('DEBUG: /api/user/role endpoint called');
    console.log('DEBUG: Clerk userId:', userId);

    if (!userId) {
      console.log('DEBUG: No userId found');
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    console.log('DEBUG: Querying database for userId:', userId);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, email: true, name: true, id: true },
    });

    console.log('DEBUG: Database query result:', user);

    if (!user) {
      console.log('DEBUG: User not found in database for userId:', userId);
      // List all users in the database for debugging
      const allUsers = await prisma.user.findMany({
        select: { id: true, email: true, role: true },
      });
      console.log('DEBUG: All users in database:', allUsers);
      
      return NextResponse.json(
        { 
          error: 'User not found in database',
          clerkId: userId,
          databaseUsers: allUsers.map(u => u.id),
        },
        { status: 404 }
      );
    }

    console.log(`DEBUG: User ${userId} (${user.email}) has role: ${user.role}`);

    return NextResponse.json({
      userId,
      role: user.role,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    console.error('DEBUG: Error in /api/user/role:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user role', details: String(error) },
      { status: 500 }
    );
  }
}
