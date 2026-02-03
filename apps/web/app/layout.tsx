import { Geist, Geist_Mono, Inter } from 'next/font/google';

import '@leetcode-insights/ui/globals.css';
import { Providers } from '@/components/providers';
import Header from '@/components/core/header';
import Footer from '@/components/core/footer';

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
