import { BookOpen, Code, LucideIcon, Zap } from 'lucide-react';
import FeatureCard from './feature-card';

export type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const FeaturesData: Feature[] = [
  {
    title: 'Fast & Reliable',
    description:
      'Get real-time LeetCode data with minimal latency and high availability.',
    icon: Zap
  },
  {
    title: 'Easy Integration',
    description:
      'Simple REST API with clear documentation and code examples in multiple languages.',
    icon: Code
  },
  {
    title: 'Comprehensive Data',
    description:
      'Access profile info, problem statistics, language breakdown, and submission history.',
    icon: BookOpen
  }
];

const Features = () => {
  return (
    <div className='py-20'>
      <div className='grid grid-cols-3 gap-3'>
        {FeaturesData.map((feature) => (
          <FeatureCard
            key={feature.title}
            feature={feature}
          />
        ))}
      </div>
    </div>
  );
};

export default Features;
