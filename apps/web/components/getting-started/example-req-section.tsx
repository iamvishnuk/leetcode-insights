'use client';

import dynamic from 'next/dynamic';
const CodeBlock = dynamic(() => import('@/components/code'), { ssr: false });

export const ExampleReqSection = () => {
  return (
    <section
      id='your-first-request'
      className='scroll-mt-20'
    >
      <h2 className='text-foreground mb-6 text-2xl font-bold'>
        Your First Request
      </h2>
      <p className='text-muted-foreground mb-6'>
        Let&apos;s make your first request to fetch a user profile:
      </p>

      <div className='space-y-4'>
        <CodeBlock
          samples={[
            {
              code: `const response = await fetch(
  'https://api.leetcodeinsights.com/api/v1/profile/username',
);

const data = await response.json();
console.log(data)`,
              label: 'JavaScript',
              language: 'javascript'
            },
            {
              code: `import requests

response = requests.get(
    "https://api.leetcodeinsights.com/api/v1/profile/username"
)

data = response.json()
print(data)
`,
              label: 'Python',
              language: 'python'
            }
          ]}
          title='JavaScript'
          className='rounded-b-md border-t p-3 dark:bg-[#151515]!'
        />
      </div>

      <div className='mt-8'>
        <CodeBlock
          title='Example Response'
          showLineNumbers={false}
          className='rounded-b-md border-t p-3 dark:bg-[#151515]!'
          samples={[
            {
              code: `{
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
}`,
              label: 'JSON',
              language: 'json'
            }
          ]}
        />
      </div>
    </section>
  );
};

export default ExampleReqSection;
