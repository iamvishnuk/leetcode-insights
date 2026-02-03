'use client';

import dynamic from 'next/dynamic';
const CodeBlock = dynamic(() => import('@/components/code'), {
  ssr: false
});

const page = () => {
  return (
    <main className='space-y-10'>
      <section>
        <h1 className='text-foreground mb-4 text-4xl font-bold'>
          Getting Started
        </h1>
        <p className='text-muted-foreground mb-8 text-lg'>
          Welcome to the LeetCode Insights API documentation. This guide will
          help you get up and running with our API in minutes.
        </p>
        <div className='space-y-4'>
          <h2 className='text-foreground text-2xl font-bold'>
            What is LeetCode Insights?
          </h2>
          <p className='text-muted-foreground'>
            LeetCode Insights is a REST API that provides comprehensive
            analytics about LeetCode profiles. With it, you can:
          </p>
          <ul className='text-muted-foreground ml-4 list-inside list-disc space-y-2'>
            <li>Fetch user profile information and stats</li>
            <li>Get problem-solving statistics and difficulty breakdown</li>
            <li>Access programming language distribution</li>
            <li>Retrieve submission history and achievements</li>
            <li>Display badges and ranking information</li>
          </ul>
        </div>
      </section>

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
    "username": "username",
    "realName": "real name",
    "aboutMe": "",
    "avatar": "https://...",
    "location": "location",
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
    </main>
  );
};

export default page;
