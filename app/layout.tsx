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
  title: 'Medicine Sales Demo',
  description: 'Demo Next.js medicine shop with language and theme persistence',
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
              <div className="flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center space-x-3">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <span className="text-xl font-bold">Medicine Shop</span>
                </Link>
                <nav className="flex space-x-6">
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
                  <Link
                    href="/admin"
                    className="text-white hover:text-accent transition-colors"
                  >
                    Quản trị
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
