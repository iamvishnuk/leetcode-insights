import Features from '@/components/home/features';
import Hero from '@/components/home/hero';

export default function Page() {
  return (
    <div className='mx-auto max-w-6xl pt-16'>
      <Hero />
      <Features />
    </div>
  );
}
