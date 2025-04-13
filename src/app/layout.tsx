import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import {cn} from '@/lib/utils';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'DIFY Buddy',
  description: "I'll do it for you, buddy!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <nav className="bg-secondary p-4">
          <ul className="flex space-x-4">
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
                  'data-[active=true]:after:scale-x-100'
                )}>
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
                  'data-[active=true]:after:scale-x-100'
                )}>
                Journal
              </Link>
            </li>
            <li>
              <Link
                href="/habits"
                className={cn(
                  'text-foreground',
                  'hover:text-primary',
                  'transition-colors duration-200',
                  'text-sm font-medium',
                  'focus:outline-none focus:ring-2 focus:ring-primary',
                  'relative',
                  'after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100',
                  'data-[active=true]:after:scale-x-100'
                )}>
                Habits
              </Link>
            </li>
          </ul>
        </nav>
        {children}
      </body>
    </html>
  );
}
