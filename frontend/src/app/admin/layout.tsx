'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, fetchProfile } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (user && user.role !== 'admin') {
      router.push('/');
    }
  }, [isAuthenticated, user, router, mounted]);

  useEffect(() => {
    if (mounted && isAuthenticated) {
      fetchProfile();
    }
  }, [mounted, isAuthenticated]);

  if (!mounted || !user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FDFBF9]">
        <div className="w-10 h-10 border-4 border-sage border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="admin-layout min-h-screen bg-[#FDFBF9]">
      {children}
    </div>
  );
}
