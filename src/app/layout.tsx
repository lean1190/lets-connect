import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Viewport } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { getAppBaseUrl } from '@/lib/environments/url';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0e0f13' }
  ]
};

export const metadata: Metadata = {
  title: "Let's connect",
  description: 'Keep in touch with your entrepreneurial circle',
  metadataBase: new URL(getAppBaseUrl()),
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  },
  keywords: 'connect, entrepreneur, circle, networking, network, founder',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: "Let's connect"
  },
  openGraph: {
    images: ['/logo-in-public-folder.png'],
    url: 'http://localhost:3000',
    locale: 'en_US',
    type: 'website'
  },
  authors: [{ name: 'Lean Vilas' }]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
