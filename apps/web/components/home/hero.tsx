import { Button } from '@leetcode-insights/ui/components/button';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className='py-28'>
      <div className='grid grid-cols-2'>
        <div className='flex flex-col justify-center space-y-5'>
          <h1 className='text-5xl font-bold tracking-tight'>
            LeetCode <span className='text-orange-500'>Insights</span>
          </h1>

          <h2 className='text-5xl font-bold tracking-tight text-gray-800 dark:text-gray-200'>
            A REST API for LeetCode analytics
          </h2>

          <p className='max-w-2xl text-xl text-gray-600 dark:text-gray-400'>
            Access LeetCode profile stats, user metrics, and achievements for
            portfolios and developer tools.
          </p>

          <Button
            asChild
            className='w-fit rounded-full bg-orange-500 px-5! py-4! text-white transition-colors duration-200 dark:bg-orange-500 dark:hover:bg-orange-500/90'
          >
            <Link href='/docs'>
              Get Started <ChevronRight />
            </Link>
          </Button>
        </div>
        <div>
          <div className=''>
            <Image
              src={'/images/leetcode-insights-example-02.png'}
              alt='leetcode Insights'
              width={1024}
              height={512}
              className='rounded-md'
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
