import { z } from 'zod';

export const HealthResponseSchema = z.object({
  status: z.string().openapi({ example: 'healthy' }),
  timestamp: z.string().openapi({ example: '2023-01-01T12:00:00.000Z' }),
  uptime: z.number().openapi({ example: 123.45 }),
  environment: z.string().openapi({ example: 'development' }),
  version: z.string().openapi({ example: '1.0.0' })
});
