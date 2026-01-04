'use client';

import { useUser } from '@clerk/nextjs';
import { ReactNode } from 'react';

export default function AdminOnly({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return null;
  }

  const isAdmin = user?.publicMetadata?.role === 'admin';

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}