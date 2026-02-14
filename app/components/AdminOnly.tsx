'use client';

import { useUser } from '@clerk/nextjs';
import { ReactNode, useEffect, useState } from 'react';

export default function AdminOnly({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!isLoaded || !user) {
        setIsChecking(false);
        return;
      }

      try {
        const res = await fetch('/api/user/role');
        if (res.ok) {
          const data = await res.json();
          console.log('AdminOnly component: User role is', data.role);
          setIsAdmin(data.role === 'ADMIN');
        } else {
          console.log('AdminOnly: Failed to fetch role:', res.status);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('AdminOnly: Error checking role:', error);
        setIsAdmin(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAdminRole();
  }, [user, isLoaded]);

  if (!isLoaded || isChecking) {
    return null;
  }

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}