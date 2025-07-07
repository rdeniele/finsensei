import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { ThemeProvider } from "@/lib/theme";
import Script from 'next/script';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: "FinSensei - Personal Finance Management",
  description: "Take control of your financial future with FinSensei. Track expenses, set goals, get AI-powered insights, and learn financial management - all in one place.",
  keywords: "personal finance, money management, budgeting, financial planning, expense tracking, financial goals, AI financial advisor",
  authors: [{ name: "FinSensei Team" }],
  creator: "FinSensei",
  publisher: "FinSensei",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-384x384.png', sizes: '384x384', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://finsensei.com',
    siteName: 'FinSensei',
    title: 'FinSensei - Your AI-Powered Personal Finance Assistant',
    description: 'Take control of your financial future with FinSensei. Track expenses, set goals, get AI-powered insights, and learn financial management - all in one place.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FinSensei - Personal Finance Management',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FinSensei - Your AI-Powered Personal Finance Assistant',
    description: 'Take control of your financial future with FinSensei. Track expenses, set goals, get AI-powered insights, and learn financial management - all in one place.',
    images: ['/twitter-image.jpg'],
    creator: '@finsensei',
    site: '@finsensei',
  },
  verification: {
    google: 'your-google-site-verification',
    yandex: 'your-yandex-verification',
    yahoo: 'your-yahoo-verification',
    other: {
      'facebook-domain-verification': 'your-facebook-domain-verification',
    },
  },
  alternates: {
    canonical: 'https://finsensei.com',
    languages: {
      'en-US': 'https://finsensei.com',
    },
  },
  category: 'Finance',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4143521375584293"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-right" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
