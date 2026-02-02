'use client';

import { Separator } from '@leetcode-insights/ui/components/separator';
import ThemeToggle from '../theme-toggle';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@leetcode-insights/ui/lib/utils';
import { motion } from 'motion/react';

const MENU_ITEMS = [
  {
    label: 'Home',
    href: '/'
  },
  {
    label: 'Docs',
    href: '/docs'
  }
];

const HomeHeader = () => {
  const path = usePathname();
  return (
    <header className='fixed inset-x-0 top-0 z-10 h-16 w-full bg-white dark:bg-neutral-950'>
      <div className='mx-auto h-full max-w-6xl'>
        <div className='flex h-full items-center justify-between'>
          <div className='flex items-baseline gap-2'>
            <svg
              width='17'
              height='20'
              viewBox='0 0 17 20'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M0 11C0 10.4477 0.447715 10 1 10H4C4.55228 10 5 10.4477 5 11V20H0V11Z'
                className='fill-orange-500'
              />
              <path
                d='M6 6C6 5.44772 6.44772 5 7 5H10C10.5523 5 11 5.44772 11 6V20H6V6Z'
                className='fill-orange-500'
              />
              <path
                d='M12 1C12 0.447716 12.4477 0 13 0H16C16.5523 0 17 0.447715 17 1V20H12V1Z'
                className='fill-orange-500'
              />
            </svg>
            <div className='text-xl font-bold'>
              LeetCode&nbsp;
              <span className='text-orange-500'>Insights</span>
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <nav>
              <ul className='flex items-center gap-4'>
                {MENU_ITEMS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'font-medium transition-colors duration-200 hover:text-orange-500 dark:text-gray-400 dark:hover:text-orange-500',
                        path === item.href &&
                          'text-orange-500 dark:text-orange-500'
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <Separator
              orientation='vertical'
              className='data-[orientation=vertical]:h-5'
            />

            <Link href={''}>
              <motion.svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='size-5'
              >
                <motion.path
                  stroke='none'
                  d='M0 0h24v24H0z'
                  fill='none'
                />
                <motion.path
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: 'easeInOut' }}
                  d='M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5'
                />
              </motion.svg>
            </Link>
            <Separator
              orientation='vertical'
              className='data-[orientation=vertical]:h-5'
            />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;
