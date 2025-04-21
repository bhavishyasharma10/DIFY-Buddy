// This file is NOT marked with 'use client' — so it's a Server Component

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import AppShell from '@/components/ui/appShell';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'DIFY Buddy',
    description: "I'll do it for you, buddy!",
    themeColor: '#ffffff',
    manifest: '/manifest.json',
    icons: {
      icon: '/icons/icon-192x192.png',  // Correct path
      apple: '/icons/apple-icon.png',  // Correct path for Apple icon
    },
  };
  

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppShell>
            {children}
        </AppShell>
      </body>
    </html>
  );
}
