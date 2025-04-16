'use client';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useUserStore } from '@/lib/zustand/useUserStore';
import LoginPage from './login';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const metadata: Metadata = {
  title: 'DIFY Buddy',
  description: "I'll do it for you, buddy!",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user, setUser } = useUserStore((state) => state);
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          id: currentUser.uid,
          email: currentUser.email,
          name: currentUser.displayName,
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [setUser, router]);

  if (!user) {
    return (
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <LoginPage />
        </body>
      </html>
    );
  }
  
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <nav className="bg-secondary p-4 relative">
          <div className="container mx-auto flex items-center justify-between">
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button onClick={toggleMenu} variant="outline" size="icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </Button>
            </div>

            {/* Desktop Navigation */}
            <ul
              className={cn(
                'md:flex space-x-4',
                'md:static absolute top-full left-0 w-full bg-secondary z-10',
                isMenuOpen ? 'flex flex-col gap-y-4 p-4' : 'hidden',
              )}
            >
              <li>
                <Link
                  href="/"
                  className={cn(
                    'text-foreground',
                    'hover:text-primary',
                    'transition-colors duration-200',
                    'text-sm font-medium',
                    'focus:outline-none focus:ring-2 focus:ring-primary',
                    'relative',
                    'after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100',
                    'data-[active=true]:after:scale-x-100',
                  )}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/journal"
                  className={cn(
                    'text-foreground',
                    'hover:text-primary',
                    'transition-colors duration-200',
                    'text-sm font-medium',
                    'focus:outline-none focus:ring-2 focus:ring-primary',
                    'relative',
                    'after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100',
                    'data-[active=true]:after:scale-x-100',
                  )}
                >
                  Journal
                </Link>
              </li>
              <li>
                <Link href="/habits" className={cn('text-foreground', 'hover:text-primary', 'transition-colors duration-200', 'text-sm font-medium', 'focus:outline-none focus:ring-2 focus:ring-primary', 'relative', 'after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100', 'data-[active=true]:after:scale-x-100')}>Habits</Link>
              </li>
            </ul>
          </div>
        </nav>
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
