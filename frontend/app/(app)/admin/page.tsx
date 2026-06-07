// app/admin/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminDashboard } from '@/components/AdminDashboard';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Cek dari localStorage (atau bisa juga dari cookie)
    const role = localStorage.getItem('user_role');
    if (role !== 'admin') {
      router.replace('/dashboard');
    }
  }, []);

  return <AdminDashboard />;
}