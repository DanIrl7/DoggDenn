import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { AdminDashboard } from './AdminDashboardClient';

export default async function AdminDashboardPage() {
  const { userId } = await auth();

  // Redirect to home if not authenticated
  if (!userId) {
    redirect('/sign-in');
  }

  // Check if user is an admin
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  // Redirect to home if user is not an admin
  if (!user || user.role !== 'ADMIN') {
    console.log(`Access denied: User ${userId} attempted to access admin dashboard but has role: ${user?.role || 'NOT_FOUND'}`);
    redirect('/');
  }

  // User is authenticated and is an admin - render the dashboard
  return <AdminDashboard />;
}
