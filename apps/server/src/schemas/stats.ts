import { z } from 'zod';

export const StatsResponseSchema = z.object({
  username: z.string().openapi({ example: 'leetcode_user' }),
  totalQuestions: z.number().openapi({ example: 2000 }),
  totalSolved: z.number().openapi({ example: 500 }),
  totalSubmissions: z.number().openapi({ example: 1000 }),
  acceptanceRate: z.number().openapi({ example: 50.5 }),
  difficulty: z.object({
    easy: z.object({
      total: z.number().openapi({ example: 500 }),
      solved: z.number().openapi({ example: 200 }),
      beats: z.number().openapi({ example: 85.5 })
    }),
    medium: z.object({
      total: z.number().openapi({ example: 1000 }),
      solved: z.number().openapi({ example: 250 }),
      beats: z.number().openapi({ example: 70.2 })
    }),
    hard: z.object({
      total: z.number().openapi({ example: 500 }),
      solved: z.number().openapi({ example: 50 }),
      beats: z.number().openapi({ example: 45.0 })
    })
  })
});

export const SubmissionStatsResponseSchema = z.object({
  username: z.string().openapi({ example: 'leetcode_user' }),
  overall: z.object({
    accepted: z.number().openapi({ example: 500 }),
    total: z.number().openapi({ example: 1000 }),
    acceptanceRate: z.number().openapi({ example: 50.0 })
  }),
  byDifficulty: z
    .record(
      z.string(),
      z.object({
        accepted: z.number().openapi({ example: 100 }),
        total: z.number().openapi({ example: 200 }),
        acceptanceRate: z.number().openapi({ example: 50.0 })
      })
    )
    .openapi({
      example: {
        easy: { accepted: 200, total: 300, acceptanceRate: 66.6 },
        medium: { accepted: 250, total: 500, acceptanceRate: 50.0 },
        hard: { accepted: 50, total: 200, acceptanceRate: 25.0 }
      }
    })
});
