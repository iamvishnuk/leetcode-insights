import { Feature } from './features';

type FeatureCardProps = {
  feature: Feature;
};

const FeatureCard = ({ feature }: FeatureCardProps) => {
  return (
    <div className='space-y-4 rounded-md bg-gray-200 p-6 shadow-md transition-shadow hover:shadow-lg dark:bg-neutral-900'>
      {feature.icon && (
        <feature.icon
          size={32}
          className='mb-4 text-orange-500'
        />
      )}
      <h3 className='text-lg font-medium text-neutral-700 dark:text-neutral-300'>
        {feature.title}
      </h3>
      <p className='text-neutral-600 dark:text-neutral-400'>
        {feature.description}
      </p>
    </div>
  );
};

export default FeatureCard;
