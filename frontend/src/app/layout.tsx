import '../styles/globals.css';

import React from 'react';
import type { Metadata, Viewport } from 'next';
import BottomNav from '@/components/layout/BottomNav';

export const metadata: Metadata = {
  title: 'MamaPro - Поддержка для мам',
  description: 'Общайтесь со специалистами, проходите курсы и находите поддержку в безопасном цифровом пространстве.',
};

export const viewport: Viewport = {
  themeColor: '#F9F6F3',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body 
        className="text-dark-text font-sans antialiased pb-24"
        style={{ background: 'linear-gradient(135deg, #FBCFE8 0%, #FECDD3 50%, #FFEDD5 100%)', minHeight: '100vh' }}
      >
        <main className="max-w-md mx-auto min-h-screen relative shadow-2xl overflow-x-hidden bg-transparent">
          {children}
          <BottomNav />
        </main>
      </body>
    </html>
  );
}
