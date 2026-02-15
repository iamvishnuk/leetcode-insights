import { z } from 'zod';

export const OverviewResponseSchema = z.object({
  username: z.string().openapi({ example: 'leetcode_user' }),
  avatar: z.string().openapi({ example: 'https://example.com/avatar.jpg' }),
  realName: z.string().openapi({ example: 'John Doe' }),
  ranking: z.number().openapi({ example: 1000 }),
  solved: z.object({
    total: z.number().openapi({ example: 500 }),
    easy: z.number().openapi({ example: 200 }),
    medium: z.number().openapi({ example: 250 }),
    hard: z.number().openapi({ example: 50 })
  }),
  totalProblems: z.object({
    total: z.number().openapi({ example: 2000 }),
    easy: z.number().openapi({ example: 500 }),
    medium: z.number().openapi({ example: 1000 }),
    hard: z.number().openapi({ example: 500 })
  }),
  solveRate: z.object({
    easy: z.number().openapi({ example: 40.0 }),
    medium: z.number().openapi({ example: 25.0 }),
    hard: z.number().openapi({ example: 10.0 })
  }),
  streak: z.number().openapi({ example: 10 }),
  totalActiveDays: z.number().openapi({ example: 100 }),
  contest: z
    .object({
      rating: z.number().openapi({ example: 1500 }),
      ranking: z.number().openapi({ example: 5000 }),
      attended: z.number().openapi({ example: 20 }),
      topPercentage: z.number().openapi({ example: 15.5 })
    })
    .nullable(),
  primaryLanguage: z.string().nullable().openapi({ example: 'Java' }),
  profileUrl: z
    .string()
    .openapi({ example: 'https://leetcode.com/leetcode_user' })
});
