import { Metadata } from 'next';
import ExampleReqSection from '@/components/getting-started/example-req-section';

export const metadata: Metadata = {
  title: 'Getting started',
  description: 'Get started with LeetCode Insights API'
};

const page = () => {
  return (
    <main className='space-y-10'>
      <section>
        <h1 className='text-foreground mb-4 text-4xl font-bold'>
          Getting Started
        </h1>
        <p className='text-muted-foreground mb-8 text-lg'>
          Welcome to the LeetCode Insights API documentation. This guide will
          help you get up and running with our API in minutes.
        </p>
        <div className='space-y-4'>
          <h2 className='text-foreground text-2xl font-bold'>
            What is LeetCode Insights?
          </h2>
          <p className='text-muted-foreground'>
            LeetCode Insights is a REST API that provides comprehensive
            analytics about LeetCode profiles. With it, you can:
          </p>
          <ul className='text-muted-foreground ml-4 list-inside list-disc space-y-2'>
            <li>Fetch user profile information and stats</li>
            <li>Get problem-solving statistics and difficulty breakdown</li>
            <li>Access programming language distribution</li>
            <li>Retrieve submission history and achievements</li>
            <li>Display badges and ranking information</li>
          </ul>
        </div>
      </section>

      <ExampleReqSection />
    </main>
  );
};

export default page;
