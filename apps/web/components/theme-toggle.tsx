'use client';

import { useTheme } from 'next-themes';
import { motion } from 'motion/react';

const ThemeToggle = () => {
  const { setTheme, theme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div>
      <motion.button
        onClick={toggleTheme}
        className={`relative flex size-5 items-center justify-center transition-all duration-500 hover:cursor-pointer`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label='Toggle theme'
      >
        {/* Sun Icon */}
        <motion.div
          className='absolute'
          animate={{
            scale: theme === 'dark' ? 0.3 : 1,
            rotate: theme === 'dark' ? 180 : 0,
            opacity: theme === 'dark' ? 0 : 1
          }}
          transition={{
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1]
          }}
        >
          <motion.svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='currentColor'
            className='text-gray-950'
            animate={{
              rotate: [0, 360]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            <path
              stroke='none'
              d='M0 0h24v24H0z'
              fill='none'
            />
            <path d='M12 19a1 1 0 0 1 .993 .883l.007 .117v1a1 1 0 0 1 -1.993 .117l-.007 -.117v-1a1 1 0 0 1 1 -1z' />
            <path d='M18.313 16.91l.094 .083l.7 .7a1 1 0 0 1 -1.32 1.497l-.094 -.083l-.7 -.7a1 1 0 0 1 1.218 -1.567l.102 .07z' />
            <path d='M7.007 16.993a1 1 0 0 1 .083 1.32l-.083 .094l-.7 .7a1 1 0 0 1 -1.497 -1.32l.083 -.094l.7 -.7a1 1 0 0 1 1.414 0z' />
            <path d='M4 11a1 1 0 0 1 .117 1.993l-.117 .007h-1a1 1 0 0 1 -.117 -1.993l.117 -.007h1z' />
            <path d='M21 11a1 1 0 0 1 .117 1.993l-.117 .007h-1a1 1 0 0 1 -.117 -1.993l.117 -.007h1z' />
            <path d='M6.213 4.81l.094 .083l.7 .7a1 1 0 0 1 -1.32 1.497l-.094 -.083l-.7 -.7a1 1 0 0 1 1.217 -1.567l.102 .07z' />
            <path d='M19.107 4.893a1 1 0 0 1 .083 1.32l-.083 .094l-.7 .7a1 1 0 0 1 -1.497 -1.32l.083 -.094l.7 -.7a1 1 0 0 1 1.414 0z' />
            <path d='M12 2a1 1 0 0 1 .993 .883l.007 .117v1a1 1 0 0 1 -1.993 .117l-.007 -.117v-1a1 1 0 0 1 1 -1z' />
            <path d='M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z' />
          </motion.svg>
        </motion.div>

        {/* Moon Icon */}
        <motion.div
          className='absolute'
          animate={{
            scale: theme === 'dark' ? 1 : 0.3,
            rotate: theme === 'dark' ? 0 : -180,
            opacity: theme === 'dark' ? 1 : 0
          }}
          transition={{
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1]
          }}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='text-white'
          >
            <motion.path
              d='M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454l0 .008'
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: theme === 'dark' ? 1 : 0,
                opacity: theme === 'dark' ? 1 : 0
              }}
              transition={{
                pathLength: { duration: 0.8, ease: 'easeInOut' },
                opacity: { duration: 0.3 }
              }}
            />
          </svg>
        </motion.div>
      </motion.button>
    </div>
  );
};

export default ThemeToggle;
