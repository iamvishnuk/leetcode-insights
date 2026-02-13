import ApiExplorer from '@/components/explorer/api-explorer';

const page = () => {
  return (
    <div className='min-h-svh space-y-10 py-5'>
      <div className='space-y-6'>
        <h1 className='text-foreground text-4xl font-bold'>API Explorer</h1>
        <p className='text-muted-foreground text-lg'>
          Test API endpoints directly from your browser and see live responses.
        </p>
      </div>
      <ApiExplorer />
    </div>
  );
};

export default page;
