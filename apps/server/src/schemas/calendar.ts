import { z } from 'zod';

export const DayDataSchema = z.object({
  date: z.string().openapi({ example: '2023-01-01' }),
  timestamp: z.number().openapi({ example: 1672531200 }),
  submissions: z.number().openapi({ example: 5 })
});

export const CalendarResponseSchema = z.object({
  userName: z.string().openapi({ example: 'leetcode_user' }),
  year: z.number().optional().openapi({ example: 2023 }),
  days: z.array(DayDataSchema),
  totalSubmissions: z.number().openapi({ example: 500 }),
  totalActiveDays: z.number().openapi({ example: 100 }),
  streak: z.number().openapi({ example: 10 }),
  activeYears: z.array(z.number()).openapi({ example: [2022, 2023] }),
  startDate: z.string().openapi({ example: '2023-01-01' }),
  endDate: z.string().openapi({ example: '2023-12-31' })
});

export const YearQuerySchema = z.object({
  year: z
    .string()
    .optional()
    .openapi({
      param: {
        name: 'year',
        in: 'query'
      },
      example: '2023'
    })
});
