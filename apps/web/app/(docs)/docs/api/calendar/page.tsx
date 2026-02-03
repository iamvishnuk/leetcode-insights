import BaseUrl from '@/components/docs/base-url';
import EndpointCard, { TEndpoint } from '@/components/docs/endpoint-card';

const calenderEndpoints: TEndpoint[] = [
  {
    method: 'GET',
    path: '/calendar/:username',
    description: 'Get submission calendar (last 365 days)',
    params: [
      {
        name: 'username',
        type: 'string',
        required: true,
        description: 'LeetCode username'
      },
      {
        name: 'year',
        type: 'number',
        required: false,
        description: 'Specific year for the submission calendar'
      }
    ],
    response: `{
    "userName": "john_doe",
    "days": [
        {
            "date": "2025-02-04",
            "timestamp": 1738627200,
            "submissions": 0
        },
        ...,
        {
            "date": "2026-02-03",
            "timestamp": 1770076800,
            "submissions": 1
        }
    ],
    "totalSubmissions": 160,
    "totalActiveDays": 71,
    "streak": 33,
    "activeYears": [
        2023,
        2024,
        2025,
        2026
    ],
    "startDate": "2025-02-04",
    "endDate": "2026-02-03"
}`
  }
];

const page = () => {
  return (
    <div className='space-y-10'>
      <div className='space-y-6'>
        <h1 className='text-foreground mb-4 text-4xl font-bold'>Calender</h1>
        <ul className='ml-4 list-inside list-disc space-y-2'>
          <li>Get submission calendar (last 365 days by default)</li>
          <li>Get submission calendar for specific year</li>
        </ul>
        <BaseUrl />
      </div>

      <div className='space-y-6'>
        <h2 className='text-foreground text-2xl font-bold'>Endpoints</h2>
        {calenderEndpoints.map((endpoint, idx) => (
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
