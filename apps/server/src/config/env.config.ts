import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`
});

const envSchema = z.object({
  PORT: z.string().transform(Number).default(3001),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  API_PREFIX: z.string().default('/api/v1'),
  LEETCODE_BASE_URL: z.string().url().default('https://leetcode.com/graphql')
});

const envParsed = envSchema.safeParse(process.env);

if (!envParsed.success) {
  console.error('❌ Invalid environment variables:', envParsed.error.format());
  process.exit(1);
}

export const EnvConfig = {
  port: envParsed.data.PORT,
  nodeEnv: envParsed.data.NODE_ENV,
  apiPrefix: envParsed.data.API_PREFIX,
  leetcodeBaseUrl: envParsed.data.LEETCODE_BASE_URL
} as const;
