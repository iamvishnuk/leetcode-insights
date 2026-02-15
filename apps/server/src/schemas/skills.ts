import { z } from 'zod';

export const SkillSchema = z.object({
  name: z.string().openapi({ example: 'Dynamic Programming' }),
  slug: z.string().openapi({ example: 'dynamic-programming' }),
  problemsSolved: z.number().openapi({ example: 50 })
});

export const LanguageStatsSchema = z.object({
  name: z.string().openapi({ example: 'Java' }),
  problemsSolved: z.number().openapi({ example: 100 }),
  percentage: z.number().openapi({ example: 45.5 })
});

export const SkillsResponseSchema = z.object({
  username: z.string().openapi({ example: 'leetcode_user' }),
  topSkills: z.array(SkillSchema),
  skillsByLevel: z.object({
    fundamental: z.object({
      count: z.number().openapi({ example: 10 }),
      skills: z.array(SkillSchema)
    }),
    intermediate: z.object({
      count: z.number().openapi({ example: 20 }),
      skills: z.array(SkillSchema)
    }),
    advanced: z.object({
      count: z.number().openapi({ example: 5 }),
      skills: z.array(SkillSchema)
    })
  }),
  totalSkillTags: z.number().openapi({ example: 35 })
});

export const LanguageResponseSchema = z.object({
  username: z.string().openapi({ example: 'leetcode_user' }),
  primaryLanguage: z.string().nullable().openapi({ example: 'Java' }),
  totalLanguages: z.number().openapi({ example: 3 }),
  languages: z.array(LanguageStatsSchema)
});
