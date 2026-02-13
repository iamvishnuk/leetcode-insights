'use client';

import { getMethodColor } from '@/utils';
import { Badge } from '@leetcode-insights/ui/components/badge';
import { Button } from '@leetcode-insights/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@leetcode-insights/ui/components/card';
import { Input } from '@leetcode-insights/ui/components/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@leetcode-insights/ui/components/select';
import { cn } from '@leetcode-insights/ui/lib/utils';
import { useState } from 'react';
import dynamic from 'next/dynamic';

const CodeBlock = dynamic(() => import('../code'), { ssr: false });

const endpoints = [
  {
    path: '/profile/:username',
    method: 'GET',
    params: [
      {
        name: 'username',
        type: 'string',
        required: true
      }
    ]
  },
  {
    path: '/overview/:username',
    method: 'GET',
    params: [
      {
        name: 'username',
        type: 'string',
        required: true
      }
    ]
  },
  {
    path: '/calendar/:username',
    method: 'GET',
    params: [
      {
        name: 'username',
        type: 'string',
        required: true
      },
      {
        name: 'year',
        type: 'number',
        required: false
      }
    ]
  },
  {
    path: '/stats/:username',
    method: 'GET',
    params: [
      {
        name: 'username',
        type: 'string',
        required: true
      }
    ]
  },
  {
    path: '/stats/:username/submissions',
    method: 'GET',
    params: [
      {
        name: 'username',
        type: 'string',
        required: true
      }
    ]
  },
  {
    path: '/submissions/:username',
    method: 'GET',
    params: [
      {
        name: 'username',
        type: 'string',
        required: true
      },
      {
        name: 'limit',
        type: 'string',
        required: false
      }
    ]
  },
  {
    path: '/contest/:username',
    method: 'GET',
    params: [
      {
        name: 'username',
        type: 'string',
        required: true
      }
    ]
  },
  {
    path: '/badges/:username',
    method: 'GET',
    params: [
      {
        name: 'username',
        type: 'string',
        required: true
      }
    ]
  },
  {
    path: '/skills/:username',
    method: 'GET',
    params: [
      {
        name: 'username',
        type: 'string',
        required: true
      }
    ]
  },
  {
    path: '/skills/:username/languages',
    method: 'GET',
    params: [
      {
        name: 'username',
        type: 'string',
        required: true
      }
    ]
  }
] as const;

type EndPoint = (typeof endpoints)[number];
type EndpointParamName = EndPoint['params'][number]['name'];

const ApiExplorer = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndPoint | null>(
    endpoints[0]
  );
  const [paramValues, setParamValues] = useState<
    Partial<Record<EndpointParamName, string>>
  >({});
  const [errors, setErrors] = useState<
    Partial<Record<EndpointParamName, string>>
  >({});

  const [response, setResponse] = useState<Record<string, unknown> | null>(
    null
  );

  const handleParamChange = (paramName: EndpointParamName, value: string) => {
    setParamValues((prev) => ({
      ...prev,
      [paramName]: value
    }));
    // Clear error when user starts typing
    if (errors[paramName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[paramName];
        return newErrors;
      });
    }
  };

  const handleMakeRequest = async () => {
    if (!selectedEndpoint) return;

    const newErrors: Partial<Record<EndpointParamName, string>> = {};

    selectedEndpoint.params.forEach((param) => {
      const value = paramValues[param.name]?.trim();

      // Check required fields
      if (param.required && !value) {
        newErrors[param.name] =
          `${param.name.charAt(0).toUpperCase() + param.name.slice(1)} is required`;
        return; // Skip type validation if required field is empty
      }

      // Check the type of param if provided
      if (param.type === 'number' && value) {
        if (isNaN(Number(value))) {
          newErrors[param.name] =
            `${param.name.charAt(0).toUpperCase() + param.name.slice(1)} must be a valid number`;
        }
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Build path with path params replaced and collect query params
    let builtPath: string = selectedEndpoint.path;
    const searchParams = new URLSearchParams();

    selectedEndpoint.params.forEach((param) => {
      const value = paramValues[param.name]?.trim();
      if (!value) return;

      // Replace path params like :username
      if (builtPath.includes(`:${param.name}`)) {
        builtPath = builtPath.replace(
          `:${param.name}`,
          encodeURIComponent(value)
        );
      } else {
        // Add non-path params as query parameters
        searchParams.append(param.name, value);
      }
    });

    const base = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '');
    const url = `${base}${builtPath.startsWith('/') ? '' : '/'}${builtPath}${
      searchParams.toString() ? `?${searchParams.toString()}` : ''
    }`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      console.log(data);

      setResponse({ status: res.status, ok: res.ok, url, data });
    } catch (err) {
      setResponse({ status: 'error', message: (err as Error).message });
    }
  };

  return (
    <div className='grid grid-cols-5 gap-6'>
      <div className='col-span-2'>
        <Card className='rounded-md py-4'>
          <CardHeader className='px-4'>
            <CardTitle>Request</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <label className='text-muted-foreground block text-sm font-medium uppercase'>
                EndPoint
              </label>
              <div className='w-full'>
                <Select
                  defaultValue={endpoints[0].path}
                  onValueChange={(value) => {
                    const endpoint = endpoints.find((ep) => ep.path === value);
                    if (endpoint) {
                      setSelectedEndpoint(endpoint);
                    }
                  }}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {endpoints.map((endpoint) => (
                        <SelectItem
                          key={endpoint.path}
                          value={endpoint.path}
                        >
                          <Badge
                            className={cn(
                              `font-mono text-xs font-bold`,
                              getMethodColor(endpoint.method)
                            )}
                          >
                            {endpoint.method}
                          </Badge>
                          <span>{endpoint.path}</span>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {selectedEndpoint && selectedEndpoint.params.length > 0 && (
              <div className=''>
                <div className='space-y-3'>
                  {selectedEndpoint.params.map((param) => (
                    <div
                      key={param.name}
                      className='space-y-2'
                    >
                      <label className='text-muted-foreground block text-sm uppercase'>
                        {param.name}
                        {param.required && (
                          <span className='ml-1 text-red-500'>*</span>
                        )}
                      </label>
                      <Input
                        placeholder={`Enter ${param.name}`}
                        value={paramValues[param.name] || ''}
                        onChange={(e) =>
                          handleParamChange(param.name, e.target.value)
                        }
                        className={cn(
                          errors[param.name] &&
                            'border-red-500 focus-visible:ring-red-500'
                        )}
                      />
                      {errors[param.name] && (
                        <p className='text-sm text-red-500'>
                          {errors[param.name]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              className='w-full bg-orange-500 text-white transition-colors duration-200 hover:cursor-pointer hover:bg-orange-500/90'
              onClick={handleMakeRequest}
            >
              Make Request
            </Button>
          </CardFooter>
        </Card>
      </div>
      <div className='col-span-3'>
        <Card className='rounded-md py-4'>
          <CardHeader className='px-4'>
            <CardTitle>Response</CardTitle>
            <CardDescription>
              {response
                ? `status: ${response?.status}`
                : 'Make a request to see the response here.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CodeBlock
              samples={
                response
                  ? [
                      {
                        code: JSON.stringify(response, null, 2),
                        label: 'JSON',
                        language: 'json'
                      }
                    ]
                  : [
                      {
                        code: 'Waiting for response...',
                        label: 'Text',
                        language: 'json'
                      }
                    ]
              }
              showHeader={false}
              className='overflow-x-auto rounded-b-md border-t p-3 dark:bg-[#151515]!'
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApiExplorer;
