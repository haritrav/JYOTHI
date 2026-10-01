import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AccessibilityProvider } from '@/contexts/AccessibilityContext';
import { LocationProvider } from '@/contexts/LocationContext';
import { SafetyProvider } from '@/contexts/SafetyContext';

export const metadata: Metadata = {
  title: 'JYOTHI — Her Voice. Her Language. Her Access.',
  description:
    'AI-powered multilingual digital companion designed for women in rural and underserved communities in India.',
  manifest: '/manifest.webmanifest',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#b11b65',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ta" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <LanguageProvider>
          <AccessibilityProvider>
            <LocationProvider>
              <SafetyProvider>
                {children}
              </SafetyProvider>
            </LocationProvider>
          </AccessibilityProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
