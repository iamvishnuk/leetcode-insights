import {
  Card,
  CardContent,
  CardHeader
} from '@leetcode-insights/ui/components/card';
import { Code } from 'lucide-react';

const BaseUrl = () => {
  return (
    <Card className='rounded-md py-4'>
      <CardHeader className='flex items-center gap-2 px-4 font-medium'>
        <Code size={20} /> Base URL
      </CardHeader>
      <CardContent className='px-4'>
        <div className='rounded bg-gray-100 p-4 font-mono text-sm dark:bg-neutral-900'>
          https://api.leetcodeinsights.com/v1
        </div>
      </CardContent>
    </Card>
  );
};

export default BaseUrl;
