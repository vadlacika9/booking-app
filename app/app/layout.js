'use client';

import './globals.css';
import { SessionProvider } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import OtherNavbar from '@/components/OtherNavbar';

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Oldalak, ahol nem akarjuk használni a layoutot
  const noLayoutPages = ["/"];
  if (noLayoutPages.includes(pathname)) {
    return (
      <html lang="en">
        <head>
          {/* További meta-adatok ide kerülhetnek, pl. charset, title, stb. */}
        </head>
        <body>
          <SessionProvider>
            <main>
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
        {/* További meta-adatok ide kerülhetnek, pl. charset, title, stb. */}
      </head>
      <body >
        <SessionProvider>
          <main >
            <OtherNavbar />
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
