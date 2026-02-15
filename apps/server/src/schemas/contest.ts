import { z } from 'zod';

export const ContestRankingSchema = z.object({
  current: z.number().openapi({ example: 12345 }),
  rating: z.number().openapi({ example: 1500 }),
  topPercentage: z.number().openapi({ example: 15.5 }),
  totalParticipants: z.number().openapi({ example: 500000 }),
  attendedCount: z.number().openapi({ example: 20 }),
  badge: z.string().nullable().openapi({ example: 'Guardian' })
});

export const ContestStatsSchema = z.object({
  averageProblemsPerContest: z.number().openapi({ example: 2.5 }),
  bestRating: z.number().nullable().openapi({ example: 1600 }),
  bestRank: z.number().nullable().openapi({ example: 500 })
});

export const ContestHistorySchema = z.object({
  name: z.string().openapi({ example: 'Weekly Contest 300' }),
  rating: z.number().openapi({ example: 1550 }),
  date: z.string().openapi({ example: '2023-01-01T10:00:00.000Z' })
});

export const ContestResponseSchema = z.object({
  username: z.string().openapi({ example: 'leetcode_user' }),
  hasContestData: z.boolean().openapi({ example: true }),
  ranking: ContestRankingSchema.optional(),
  stats: ContestStatsSchema.optional(),
  recentContests: z.array(ContestHistorySchema).optional(),
  ratingHistory: z.array(ContestHistorySchema).optional(),
  message: z
    .string()
    .optional()
    .openapi({ example: 'User has not participated in any contests' })
});
