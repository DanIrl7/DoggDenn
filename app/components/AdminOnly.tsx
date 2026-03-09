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

      const clerkRole = user.publicMetadata?.role;
      if (typeof clerkRole === 'string' && clerkRole.toLowerCase() === 'admin') {
        setIsAdmin(true);
        setIsChecking(false);
        return;
      }

      try {
        const res = await fetch('/api/user/role');
        if (res.ok) {
          const data = await res.json();
          setIsAdmin(String(data.role).toUpperCase() === 'ADMIN');
        } else {
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