import BaseUrl from '@/components/docs/base-url';
import EndpointCard, { TEndpoint } from '@/components/docs/endpoint-card';

const profileEndpoints: TEndpoint[] = [
  {
    method: 'GET',
    path: '/profile/:username',
    description: 'Get user profile information',
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
    "realName": "John Doe",
    "aboutMe": "",
    "avatar": "https://...",
    "location": "terminal",
    "company": null,
    "school": null,
    "websites": [...],
    "skillTags": [
        "javascript",
        "java"
    ],
    "ranking": 238140,
    "reputation": 0,
    "starRating": 2.5,
    "solutionCount": 0,
    "postViewCount": 0,
    "totalSolved": 430,
    "solvedByDifficulty": {
        "easy": 289,
        "medium": 130,
        "hard": 11
    }
}`
  }
];

const page = () => {
  return (
    <div className='space-y-10'>
      <div className='space-y-6'>
        <h1 className='text-foreground mb-4 text-4xl font-bold'>Profile</h1>
        <ul className='ml-4 list-inside list-disc space-y-2'>
          <li>Get user public profile information</li>
        </ul>
        <BaseUrl />
      </div>

      <div className='space-y-6'>
        <h2 className='text-foreground text-2xl font-bold'>Endpoints</h2>
        {profileEndpoints.map((endpoint, idx) => (
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
