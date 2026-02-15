import { z } from 'zod';

export const ProfileResponseSchema = z.object({
  username: z.string().openapi({ example: 'leetcode_user' }),
  realName: z.string().openapi({ example: 'John Doe' }),
  aboutMe: z.string().openapi({ example: 'Software Engineer' }),
  avatar: z
    .string()
    .openapi({ example: 'https://assets.leetcode.com/users/avatar.jpg' }),
  location: z.string().openapi({ example: 'San Francisco, CA' }),
  company: z.string().openapi({ example: 'Google' }),
  school: z.string().openapi({ example: 'Stanford University' }),
  websites: z.array(z.string()).openapi({ example: ['https://example.com'] }),
  skillTags: z.array(z.string()).openapi({ example: ['Java', 'Python'] }),
  ranking: z.number().openapi({ example: 12345 }),
  reputation: z.number().openapi({ example: 100 }),
  starRating: z.number().openapi({ example: 4.5 }),
  solutionCount: z.number().openapi({ example: 50 }),
  postViewCount: z.number().openapi({ example: 1000 }),
  totalSolved: z.number().openapi({ example: 200 }),
  solvedByDifficulty: z.record(z.string(), z.number()).openapi({
    example: {
      easy: 100,
      medium: 80,
      hard: 20
    }
  })
});
