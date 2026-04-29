import './globals.css';

import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MamPro - Support for Moms',
  description: 'Connect with specialists, learn from experts, and find support.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#F9F6F3" />
      </head>
      <body className="bg-cream">
        {children}
      </body>
    </html>
  );
}
