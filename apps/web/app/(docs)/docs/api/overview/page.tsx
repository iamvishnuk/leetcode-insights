import BaseUrl from '@/components/docs/base-url';
import EndpointCard, { TEndpoint } from '@/components/docs/endpoint-card';

const profileOverviewEndpoints: TEndpoint[] = [
  {
    method: 'GET',
    path: '/overview/:username',
    description:
      'Get comprehensive user overview (profile + stats + contest) - ideal for portfolios',
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
    "avatar": "https://...",
    "realName": "John Doe",
    "ranking": 238140,
    "solved": {
        "total": 430,
        "easy": 289,
        "medium": 130,
        "hard": 11
    },
    "totalProblems": {
        "total": 3831,
        "easy": 924,
        "medium": 2002,
        "hard": 905
    },
    "solveRate": {
        "easy": 31.3,
        "medium": 6.5,
        "hard": 1.2
    },
    "streak": 33,
    "totalActiveDays": 33,
    "contest": null,
    "primaryLanguage": "JavaScript",
    "profileUrl": "https://leetcode.com/john_doe"
}`
  }
];

const page = () => {
  return (
    <div className='space-y-10'>
      <div className='space-y-8'>
        <h1 className='text-foreground mb-4 text-4xl font-bold'>
          Profile Overview
        </h1>
        <ul className='ml-4 list-inside list-disc space-y-2'>
          <li>
            Get comprehensive user overview (profile + stats + contest) - ideal
            for portfolios
          </li>
        </ul>
        <BaseUrl />
      </div>

      <div className='space-y-6'>
        <h2 className='text-foreground text-2xl font-bold'>Endpoints</h2>
        {profileOverviewEndpoints.map((endpoint, idx) => (
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
