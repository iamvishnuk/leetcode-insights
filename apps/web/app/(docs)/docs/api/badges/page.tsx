import BaseUrl from '@/components/docs/base-url';
import EndpointCard, { TEndpoint } from '@/components/docs/endpoint-card';

const badgesEndpoints: TEndpoint[] = [
  {
    method: 'GET',
    path: '/badges/:username',
    description: 'Get earned and upcoming badges',
    params: [
      {
        name: 'username',
        type: 'string',
        required: true,
        description: 'LeetCode username'
      }
    ],
    response: `{
    "username": "john_doe",
    "totalBadges": 2,
    "badges": [
        {
            "id": "3138042",
            "name": "100 Days Badge 2023",
            "shortName": "100 Days Badge 2023",
            "description": "100 Days Badge 2023",
            "icon": "https://assets.leetcode.com/...",
            "earnedDate": "2023-12-30",
            "medal": {
                "slug": "100-days-badge-2023",
                "gif": "https://assets.leetcode.com/...",
                "background": "https://assets.leetcode.com/..."
            }
        },
        {
            "id": "3079316",
            "name": "50 Days Badge 2023",
            "shortName": "50 Days Badge 2023",
            "description": "50 Days Badge 2023",
            "icon": "https://assets.leetcode.com/...",
            "earnedDate": "2023-12-19",
            "medal": {
                "slug": "50-days-badge-2023",
                "gif": "https://assets.leetcode.com/...",
                "background": "https://assets.leetcode.com/..."
            }
        }
    ],
    "upcomingBadges": [
        {
            "name": "Feb LeetCoding Challenge",
            "icon": "/static/images/badges/dcc-2026-2.png"
        },
        {
            "name": "Mar LeetCoding Challenge",
            "icon": "/static/images/badges/dcc-2026-3.png"
        },
        {
            "name": "Apr LeetCoding Challenge",
            "icon": "/static/images/badges/dcc-2026-4.png"
        }
    ],
    "upcomingCount": 3
}`
  }
];

const page = () => {
  return (
    <div>
      <div className='space-y-10'>
        <div className='space-y-6'>
          <h1 className='text-foreground mb-4 text-4xl font-bold'>Badges</h1>
          <ul className='ml-4 list-inside list-disc space-y-2'>
            <li>Get earned and upcoming badges</li>
          </ul>
          <BaseUrl />
        </div>
      </div>

      <div className='space-y-6'>
        <h2 className='text-foreground text-2xl font-bold'>Endpoints</h2>
        {badgesEndpoints.map((endpoint, idx) => (
          <EndpointCard
            key={idx}
            endpoint={endpoint}
          />
        ))}
      </div>
    </div>
  );
};

export default page;
