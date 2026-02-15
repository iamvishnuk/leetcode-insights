import { z } from 'zod';

export const SubmissionSchema = z.object({
  id: z.string().openapi({ example: '123456789' }),
  title: z.string().openapi({ example: 'Two Sum' }),
  titleSlug: z.string().openapi({ example: 'two-sum' }),
  problemUrl: z
    .string()
    .openapi({ example: 'https://leetcode.com/problems/two-sum' }),
  language: z.string().openapi({ example: 'python3' }),
  status: z.string().openapi({ example: 'Accepted' }),
  timestamp: z.number().openapi({ example: 1678886400 }),
  date: z.string().openapi({ example: '2023-03-15T10:00:00.000Z' })
});

export const RecentSubmissionsResponseSchema = z.object({
  username: z.string().openapi({ example: 'leetcode_user' }),
  count: z.number().openapi({ example: 20 }),
  submissions: z.array(SubmissionSchema),
  groupedByDate: z.record(z.string(), z.array(SubmissionSchema)).openapi({
    example: {
      '2023-03-15': [
        {
          id: '123456789',
          title: 'Two Sum',
          titleSlug: 'two-sum',
          problemUrl: 'https://leetcode.com/problems/two-sum',
          language: 'python3',
          status: 'Accepted',
          timestamp: 1678886400,
          date: '2023-03-15T10:00:00.000Z'
        }
      ]
    }
  }),
  languageDistribution: z.record(z.string(), z.number()).openapi({
    example: {
      python3: 15,
      java: 5
    }
  })
});

export const LimitQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .openapi({
      param: {
        name: 'limit',
        in: 'query'
      },
      example: '20'
    })
});
