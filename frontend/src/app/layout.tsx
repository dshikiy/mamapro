import '../styles/globals.css';

import React from 'react';
import type { Metadata, Viewport } from 'next';
import Header from '@/components/shared/Header';
import BottomNav from '@/components/layout/BottomNav';

export const metadata: Metadata = {
  title: 'MamaPro — Аналарға қолдау',
  description: 'MamaPro — психологтармен кеңес, марафондар, маркетплейс және қоғамдастық. Аналарға арналған онлайн платформа.',
  keywords: ['мама', 'психолог', 'перинаталды', 'аналар', 'мampro'],
  openGraph: {
    title: 'MamaPro — Аналарға қолдау',
    description: 'Онлайн платформа — психологтар, педиатрлар, марафондар',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#FDFBF7',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="kk">
      <head>
        <meta charSet="utf-8" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Nunito:wght@400;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-gradient-to-br from-[#FDFBF7] via-[#FCF6EE] to-[#F7EEE5] text-dark-text">
        <div className="min-h-screen">
          <Header />
          <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-8">
            <div className="mx-auto min-h-[calc(100vh-120px)]">{children}</div>
          </main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
