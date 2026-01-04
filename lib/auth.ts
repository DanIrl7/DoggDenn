import { auth, currentUser } from '@clerk/nextjs/server';

export async function isAdmin(): Promise<boolean> {
  const user = await currentUser();
  
  if (!user) {
    return false;
  }

  const role = user.publicMetadata?.role as string | undefined;
  return role === 'admin';
}

export async function requireAdmin() {
  const admin = await isAdmin();
  
  if (!admin) {
    throw new Error('Unauthorized: Admin access required');
  }
}