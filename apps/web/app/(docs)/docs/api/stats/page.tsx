import BaseUrl from '@/components/docs/base-url';
import EndpointCard, { TEndpoint } from '@/components/docs/endpoint-card';

const statusEndpoints: TEndpoint[] = [
  {
    method: 'GET',
    path: '/stats/:username',
    description: 'Get problem-solving statistics with beats percentage',
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
    "totalQuestions": 3831,
    "totalSolved": 430,
    "totalSubmissions": 586,
    "acceptanceRate": 73.38,
    "difficulty": {
        "easy": {
            "total": 924,
            "solved": 289,
            "beats": 99.16
        },
        "medium": {
            "total": 2002,
            "solved": 130,
            "beats": 89
        },
        "hard": {
            "total": 905,
            "solved": 11,
            "beats": 65.02
        }
    }
}`
  },
  {
    method: 'GET',
    description: 'Get detailed submission statistics',
    path: '/stats/:username/submissions',
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
    "overall": {
        "accepted": 586,
        "total": 905,
        "acceptanceRate": 64.75
    },
    "byDifficulty": {
        "easy": {
            "accepted": 409,
            "total": 605,
            "acceptanceRate": 67.6
        },
        "medium": {
            "accepted": 161,
            "total": 269,
            "acceptanceRate": 59.85
        },
        "hard": {
            "accepted": 16,
            "total": 31,
            "acceptanceRate": 51.61
        }
    }
}`
  }
];

const page = () => {
  return (
    <div className='space-y-10'>
      <div className='space-y-6'>
        <h1 className='text-foreground mb-4 text-4xl font-bold'>Stats</h1>
        <ul className='ml-4 list-inside list-disc space-y-2'>
          <li>Get problem-solving statistics with beats percentage</li>
          <li>Get detailed submission statistics</li>
        </ul>
        <BaseUrl />
      </div>

      <div className='space-y-6'>
        <h2 className='text-foreground text-2xl font-bold'>Endpoints</h2>
        {statusEndpoints.map((endpoint, idx) => (
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
