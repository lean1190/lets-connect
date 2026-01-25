'use client';

import { useEffect, useState } from 'react';
import { isAdmin as isAdminSettings } from '@/lib/settings/get/get';

export default function AdminOnly({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAdmin() {
      setIsAdmin(await isAdminSettings());
    }
    checkAdmin();
  }, []);

  if (isAdmin === null) {
    return null;
  }

  return isAdmin ? children : null;
}
