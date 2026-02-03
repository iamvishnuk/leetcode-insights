import BaseUrl from '@/components/docs/base-url';
import EndpointCard, { TEndpoint } from '@/components/docs/endpoint-card';

const contestEndpoints: TEndpoint[] = [
  {
    method: 'GET',
    path: '/contest/:username',
    description: 'Get contest participation history and ratings',
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
    "hasContestData": true,
    "ranking": {
        "current": 15603,
        "rating": 2044,
        "topPercentage": 1.99,
        "totalParticipants": 822246,
        "attendedCount": 34,
        "badge": "Knight"
    },
    "stats": {
        "averageProblemsPerContest": 2.12,
        "bestRating": 2049,
        "bestRank": 290
    },
    "recentContests": [
        {
            "contestName": "Weekly Contest 416",
            "rating": 1411,
            "ranking": 30272,
            "problemsSolved": 0,
            "totalProblems": 4,
            "date": "2024-09-22T02:30:00.000Z",
            "finishTimeMinutes": 0,
            "trend": "DOWN"
        },
        ...,
        {
            "contestName": "Biweekly Contest 149",
            "rating": 1470,
            "ranking": 10253,
            "problemsSolved": 1,
            "totalProblems": 4,
            "date": "2025-02-01T14:30:00.000Z",
            "finishTimeMinutes": 8,
            "trend": "UP"
        }
    ],
    "ratingHistory": [
        {
            "name": "Weekly Contest 416",
            "rating": 1411,
            "date": "2024-09-22T02:30:00.000Z"
        },
        ...,
        {
            "name": "Biweekly Contest 170",
            "rating": 2044,
            "date": "2025-11-22T14:30:00.000Z"
        }
    ]
}`
  }
];

const page = () => {
  return (
    <div className='space-y-10'>
      <div className='space-y-6'>
        <h1 className='text-foreground mb-4 text-4xl font-bold'>Contest</h1>
        <ul className='ml-4 list-inside list-disc space-y-2'>
          <li>et contest ranking and history</li>
        </ul>
        <BaseUrl />
      </div>

      <div className='space-y-6'>
        <h2 className='text-foreground text-2xl font-bold'>Endpoints</h2>
        {contestEndpoints.map((endpoint, idx) => (
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
