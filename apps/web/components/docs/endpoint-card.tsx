'use client';
import {
  Card,
  CardContent,
  CardHeader
} from '@leetcode-insights/ui/components/card';
import { Badge } from '@leetcode-insights/ui/components/badge';
import dynamic from 'next/dynamic';
const CodeBlock = dynamic(() => import('../code'), {
  ssr: false
});

export type TEndpoint = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  params: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  response?: string;
};

type EndpointCardProps = {
  endpoint: TEndpoint;
};

const EndpointCard = ({ endpoint }: EndpointCardProps) => {
  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-blue-100 text-blue-800';
      case 'POST':
        return 'bg-green-100 text-green-800';
      case 'PUT':
        return 'bg-yellow-100 text-yellow-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className='rounded-md'>
      <CardHeader>
        <div className='flex flex-wrap items-start justify-between gap-4'>
          <div>
            <div className='mb-2 flex flex-wrap items-center gap-3'>
              <Badge
                className={`font-mono font-bold ${getMethodColor(endpoint.method)}`}
              >
                {endpoint.method}
              </Badge>
              <code className='text-foreground rounded bg-gray-100 px-2 py-1 font-mono text-sm dark:bg-neutral-900'>
                {endpoint.path}
              </code>
            </div>
            <p className='text-muted-foreground'>{endpoint.description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {endpoint?.params.length > 0 && (
          <div>
            <h4 className='text-foreground mb-4 font-semibold'>Parameters</h4>
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead className='border-border border-b'>
                  <tr className='text-muted-foreground text-left'>
                    <th className='pb-2'>Name</th>
                    <th className='pb-2'>Type</th>
                    <th className='pb-2'>Required</th>
                    <th className='pb-2'>Description</th>
                  </tr>
                </thead>
                <tbody className='divide-border divide-y'>
                  {endpoint.params.map((param, idx) => (
                    <tr
                      key={idx}
                      className='text-foreground'
                    >
                      <td className='px-2 py-3 font-mono text-xs'>
                        {param.name}
                      </td>
                      <td className='py-3 font-mono text-xs'>{param.type}</td>
                      <td className='py-3'>
                        <Badge
                          className='text-xs'
                          variant={param.required ? 'default' : 'secondary'}
                        >
                          {param.required ? 'Yes' : 'No'}
                        </Badge>
                      </td>
                      <td className='text-muted-foreground py-3'>
                        {param.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className='mt-6 border-t pt-6'>
          <h4 className='text-foreground mb-4 font-semibold'>
            Example Response
          </h4>
          <CodeBlock
            samples={[
              {
                code: endpoint.response || '',
                label: 'JSON',
                language: 'json'
              }
            ]}
            showCopyButton={false}
            showHeader={false}
            className='rounded-md p-3 dark:bg-neutral-900/20!'
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default EndpointCard;
