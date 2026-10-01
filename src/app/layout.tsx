import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'JYOTHI (ஜோதி) - Her Voice. Her Language. Her Access.',
  description: 'AI-Powered Digital Companion for Rural and Underserved Women in India. Multilingual, Voice-First, Safe, and Empowering.',
  manifest: '/manifest.json',
  icons: {
    icon: '/jyothi-logo.jpg',
    apple: '/jyothi-logo.jpg'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#432874'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ta" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full bg-slate-900 font-sans antialiased text-slate-900 selection:bg-purple-200 selection:text-purple-900">
        {children}
      </body>
    </html>
  );
}
