import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Viewport } from "next";
import { getVercelUrl } from "@/lib/environments/is-dev";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0f13" },
  ],
};

export const metadata: Metadata = {
  title: "Fill this",
  description: "Fill this",
  metadataBase: new URL(getVercelUrl()),
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  keywords: "one, two, three",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Fill this",
  },
  openGraph: {
    images: ["/logo-in-public-folder.png"],
    url: "http://localhost:3000 - Fill this",
    locale: "en_US",
    type: "website",
  },
  authors: [{ name: "Lean Vilas" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
