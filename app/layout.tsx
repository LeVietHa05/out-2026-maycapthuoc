import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import Image from 'next/image';
import './globals.css';
import { AppProviders } from './providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Medicine Vending Machine ',
  description: 'Medicine Vending Machine website',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AppProviders>
          <header className="bg-primary text-white shadow-lg">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <Link href="/" className="flex items-center space-x-3">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <span className="text-xl font-bold">Medicine Vending Machine</span>
                </Link>
                <nav className="flex flex-wrap justify-center gap-4 sm:justify-end">
                  <Link
                    href="/"
                    className="text-white hover:text-accent transition-colors"
                  >
                    Trang chủ
                  </Link>
                  <Link
                    href="/list"
                    className="text-white hover:text-accent transition-colors"
                  >
                    Danh sách thuốc
                  </Link>
                </nav>
              </div>
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </AppProviders>
      </body>
    </html>
  );
}
