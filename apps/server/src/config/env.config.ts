import dotenv from 'dotenv';

dotenv.config({
  path: `.env.${process.env.NODE_ENV || 'development'}`
});

export const EnvConfig = {
  port: Number(process.env.PORT) || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  leetcodeBaseUrl:
    process.env.LEETCODE_BASE_URL || 'https://leetcode.com/graphql'
} as const;
