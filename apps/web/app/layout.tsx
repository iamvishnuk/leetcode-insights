import { Geist, Geist_Mono, Inter } from 'next/font/google';

import '@leetcode-insights/ui/globals.css';
import { Providers } from '@/components/providers';

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
          <div className='min-h-svh max-w-svw overflow-x-hidden bg-white dark:bg-neutral-950'>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
