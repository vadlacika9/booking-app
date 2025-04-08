'use client';

import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import OtherNavbar from '@/components/OtherNavbar';
import Footer from '@/components/Footer';
import { Inter } from 'next/font/google'

const interFont = Inter({
  subsets: ["latin"],
  weight:"400"
})

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
        <body className={`flex flex-col min-h-screen ${interFont.className}`}>
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
      <body className={`flex flex-col min-h-screen ${interFont.className}`}>
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
