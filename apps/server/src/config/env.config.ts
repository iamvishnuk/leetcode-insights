/* eslint-disable turbo/no-undeclared-env-vars */
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const environment = process.env.NODE_ENV || 'development';
const envFile = `.env.${environment}`;
dotenv.config({ path: path.resolve(__dirname, '../../', envFile) });

export const EnvConfig = {
  port: Number(process.env.PORT) || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: process.env.API_PREFIX || '/api/v1',
  leetcodeBaseUrl:
    process.env.LEETCODE_BASE_URL || 'https://leetcode.com/graphql'
} as const;
