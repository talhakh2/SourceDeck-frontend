import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sellables - E-Commerce Product Research Marketplace',
  description: 'A marketplace where Virtual Assistants (VAs) can sell researched e-commerce products to Business Owners (BOs), with secure escrow payment handling and sensitive data protection.',
  keywords: ['e-commerce', 'marketplace', 'product research', 'virtual assistant', 'business owner', 'dropshipping'],
  authors: [{ name: 'Sellables Team' }],
  creator: 'Sellables',
  publisher: 'Sellables',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://sellables.com'),
  openGraph: {
    title: 'Sellables - E-Commerce Product Research Marketplace',
    description: 'A marketplace where Virtual Assistants (VAs) can sell researched e-commerce products to Business Owners (BOs).',
    url: '/',
    siteName: 'Sellables',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Sellables Marketplace',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sellables - E-Commerce Product Research Marketplace',
    description: 'A marketplace where Virtual Assistants (VAs) can sell researched e-commerce products to Business Owners (BOs).',
    images: ['/og-image.jpg'],
  },
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
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <Providers>
          <ErrorBoundary>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 2000,
                style: {
                  background: '#363636',
                  color: '#fff',
                  fontSize: '14px',
                },
                success: {
                  duration: 1500,
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  );
}
