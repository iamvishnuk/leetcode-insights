import { z } from 'zod';

export const TopicTagSchema = z.object({
  name: z.string().openapi({ example: 'Array' }),
  slug: z.string().openapi({ example: 'array' })
});

export const QuestionSchema = z.object({
  id: z.string().openapi({ example: '1' }),
  title: z.string().openapi({ example: 'Two Sum' }),
  titleSlug: z.string().openapi({ example: 'two-sum' }),
  difficulty: z.string().openapi({ example: 'Easy' }),
  isPaidOnly: z.boolean().openapi({ example: false }),
  likes: z.number().openapi({ example: 1000 }),
  dislikes: z.number().openapi({ example: 50 }),
  acceptanceRate: z.string().nullable().openapi({ example: '45.5%' }),
  totalAccepted: z.string().nullable().openapi({ example: '1.5M' }),
  totalSubmissions: z.string().nullable().openapi({ example: '3.3M' })
});

export const DailyChallengeResponseSchema = z.object({
  date: z.string().openapi({ example: '2023-01-01' }),
  link: z
    .string()
    .openapi({ example: 'https://leetcode.com/problems/two-sum' }),
  question: QuestionSchema,
  topics: z.array(TopicTagSchema)
});
