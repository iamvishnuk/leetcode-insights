import '@leetcode-insights/ui/globals.css';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import Header from '@/components/core/header';
import Footer from '@/components/core/footer';
import { Metadata } from 'next';
import { PUBLIC_SITE_URL } from '@/constants';

const fontSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans'
});

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono'
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
});

export const metadata: Metadata = {
  metadataBase: new URL(PUBLIC_SITE_URL),
  title: {
    default: 'LeetCode Insights API',
    template: '%s | LeetCode Insights API'
  },
  description:
    'LeetCode Insights is a REST API built on top of LeetCode GraphQL API. Fetch user stats, submission data, and build dashboards, calendars, and portfolio widgets.',
  keywords: [
    'leetcode api',
    'leetcode rest api',
    'leetcode stats api',
    'leetcode portfolio api',
    'graphql wrapper api',
    'developer portfolio tools'
  ],
  creator: 'Vishnu',
  authors: [{ name: 'Vishnu' }],
  openGraph: {
    title: 'LeetCode Insights API',
    description:
      'REST API wrapper over LeetCode GraphQL to fetch user stats and build portfolio dashboards.',
    url: PUBLIC_SITE_URL,
    siteName: 'LeetCode Insights API',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'LeetCode Insights API'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LeetCode Insights API',
    description:
      'REST API wrapper over LeetCode GraphQL for portfolio dashboards and analytics.',
    images: ['/opengraph-image.png']
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
    >
      <body
        className={`${fontSans.variable} ${fontMono.variable} ${inter.variable} font-inter antialiased`}
      >
        <Providers>
          <div className='min-h-screen max-w-svw bg-white dark:bg-neutral-950'>
            <Header />
            <div className='mx-auto max-w-6xl pt-16'>{children}</div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
