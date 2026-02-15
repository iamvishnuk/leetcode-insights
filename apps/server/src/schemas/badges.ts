import { z } from 'zod';

export const BadgeSchema = z.object({
  id: z.string().openapi({ example: '123' }),
  name: z.string().openapi({ example: 'Guardian' }),
  shortName: z.string().openapi({ example: 'guardian' }),
  description: z.string().openapi({ example: 'Earned by completing...' }),
  icon: z.string().openapi({
    example: 'https://leetcode.com/static/images/badges/guardian.png'
  }),
  earnedDate: z.string().openapi({ example: '2023-01-01' }),
  medal: z
    .object({
      slug: z.string().openapi({ example: 'guardian-medal' }),
      gif: z.string().openapi({
        example: 'https://leetcode.com/static/images/badges/guardian.gif'
      }),
      background: z.string().openapi({
        example: 'https://leetcode.com/static/images/badges/guardian-bg.png'
      })
    })
    .nullable()
});

export const UpcomingBadgeSchema = z.object({
  name: z.string().openapi({ example: 'Knight' }),
  icon: z.string().openapi({
    example: 'https://leetcode.com/static/images/badges/knight.png'
  })
});

export const BadgesResponseSchema = z.object({
  username: z.string().openapi({ example: 'leetcode_user' }),
  totalBadges: z.number().openapi({ example: 5 }),
  badges: z.array(BadgeSchema),
  upcomingBadges: z.array(UpcomingBadgeSchema),
  upcomingCount: z.number().openapi({ example: 2 })
});
