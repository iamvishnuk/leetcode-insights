import BaseUrl from '@/components/docs/base-url';
import EndpointCard, { TEndpoint } from '@/components/docs/endpoint-card';

const skillsEndpoints: TEndpoint[] = [
  {
    method: 'GET',
    path: '/skills/:username',
    description: 'Get skill tags (algorithms/data structures)',
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
    "topSkills": [
        {
            "name": "Array",
            "slug": "array",
            "problemsSolved": 237
        },
        ...,
        {
            "name": "Depth-First Search",
            "slug": "depth-first-search",
            "problemsSolved": 32
        }
    ],
    "skillsByLevel": {
        "fundamental": {
            "count": 10,
            "skills": [
                {
                    "name": "Array",
                    "slug": "array",
                    "problemsSolved": 237
                },
                ...,
                {
                    "name": "Queue",
                    "slug": "queue",
                    "problemsSolved": 4
                }
            ]
        },
        "intermediate": {
            "count": 16,
            "skills": [
                {
                    "name": "Hash Table",
                    "slug": "hash-table",
                    "problemsSolved": 86
                },
                ...,
                {
                    "name": "Randomized",
                    "slug": "randomized",
                    "problemsSolved": 1
                }
            ]
        },
        "advanced": {
            "count": 13,
            "skills": [
                {
                    "name": "Dynamic Programming",
                    "slug": "dynamic-programming",
                    "problemsSolved": 28
                },
                ...,
                {
                    "name": "Topological Sort",
                    "slug": "topological-sort",
                    "problemsSolved": 1
                }
            ]
        }
    },
    "totalSkillTags": 39
}`
  },
  {
    method: 'GET',
    path: '/skills/:username/languages',
    description: 'Get programming language distribution',
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
    "primaryLanguage": "JavaScript",
    "totalLanguages": 4,
    "languages": [
        {
            "name": "JavaScript",
            "problemsSolved": 372,
            "percentage": 75.76
        },
        {
            "name": "TypeScript",
            "problemsSolved": 65,
            "percentage": 13.24
        },
        {
            "name": "Java",
            "problemsSolved": 47,
            "percentage": 9.57
        },
        {
            "name": "MySQL",
            "problemsSolved": 7,
            "percentage": 1.43
        }
    ]
}`
  }
];

const page = () => {
  return (
    <div className='space-y-10'>
      <div className='space-y-6'>
        <h1 className='text-foreground mb-4 text-4xl font-bold'>Skills</h1>
        <ul className='ml-4 list-inside list-disc space-y-2'>
          <li>Get skill tags (algorithms/data structures)</li>
          <li>Get programming language distribution</li>
        </ul>
        <BaseUrl />
      </div>

      <div className='space-y-6'>
        <h2 className='text-foreground text-2xl font-bold'>Endpoints</h2>
        {skillsEndpoints.map((endpoint, idx) => (
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
