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
import { usePathname } from 'next/navigation';

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
  const pathname = usePathname();
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
              <nav className="bg-secondary px-4 py-3 relative">
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
                              "md:flex space-x-6 items-center",
                              "md:static absolute top-full left-0 w-full bg-secondary z-10",
                              isMenuOpen ? "flex flex-col gap-y-4 p-4" : "hidden",
                          )}
                      >
                          {[
                              { href: "/", label: "Home" },
                              { href: "/journal", label: "Journal" },
                              { href: "/habits", label: "Habits" },
                          ].map(({ href, label }) => (
                              <li key={href}>
                                  <Link
                                      href={href}
                                      onClick={() => setIsMenuOpen(false)}
                                      className={cn(
                                          "text-foreground text-sm font-medium rounded-md px-3 py-2 transition-colors duration-200",
                                          "focus:outline-none focus:ring-2 focus:ring-primary",
                                          pathname === href
                                              ? "bg-primary text-primary-foreground"
                                              : "hover:bg-primary/10",
                                      )}
                                  >
                                      {label}
                                  </Link>
                              </li>
                          ))}
                      </ul>
                  </div>
              </nav>
              <main className="container mx-auto p-4">{children}</main>
          </body>
      </html>
  );
}
