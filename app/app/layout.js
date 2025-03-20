'use client';

import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import OtherNavbar from '@/components/OtherNavbar';
import Footer from '@/components/Footer';

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // pages that have special layout
  const noLayoutPages = ["/","/api/auth/signin", "/register"];
  if (noLayoutPages.includes(pathname)) {
    return (
      <html lang="en">
        <head>
          {/* meta */}
        </head>
        <body className="flex flex-col min-h-screen">
          <SessionProvider>
            <main className="flex-1">
              {children}
            </main>
          </SessionProvider>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <head>
        {/* meta */}
      </head>
      <body className="flex flex-col min-h-screen">
        <SessionProvider>
            <OtherNavbar />
            <main className="flex-1">
            {children}
            </main>
            <Footer/>
        </SessionProvider>
      </body>
    </html>
  );
}
