'use client';

import React from 'react';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
