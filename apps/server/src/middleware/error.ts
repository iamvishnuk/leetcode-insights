import type { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { LeetcodeAPIError } from '../lib/leetcode.js';

export const errorHandler = async (c: Context, next: Next) => {
  try {
    await next();
  } catch (err) {
    console.error('Error:', err);

    if (err instanceof HTTPException) {
      return c.json(
        {
          error: err.message,
          status: err.status
        },
        err.status
      );
    }

    if (err instanceof Error) {
      // Handle our custom LeetcodeAPIError from lib/leetcode.ts
      if (err instanceof LeetcodeAPIError) {
        let status = err.status || 500;
        let message = err.message;

        // Map common GraphQL/LeetCode messages to human-readable ones
        if (
          message.includes('not found') ||
          message.includes('does not exist')
        ) {
          status = 404;
          message = 'User not found';
        } else if (message.includes('rate limit')) {
          status = 429;
          message = 'Rate limit exceeded. Please try again later.';
        } else if (message.includes('timed out')) {
          status = 504;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return c.json({ error: message, status }, status as any);
      }

      // Handle generic fallback errors containing known strings
      if (
        err.message.includes('not found') ||
        err.message.includes('does not exist')
      ) {
        return c.json({ error: 'User not found', status: 404 }, 404);
      }

      if (err.message.includes('rate limit')) {
        return c.json(
          {
            error: 'Rate limit exceeded. Please try again later.',
            status: 429
          },
          429
        );
      }

      return c.json(
        {
          error: err.message || 'Internal Server Error',
          status: 500
        },
        500
      );
    }

    return c.json(
      {
        error: 'Unknown internal server error',
        status: 500
      },
      500
    );
  }
};

/**
 * Request timing middleware
 */
export const timing = async (c: Context, next: Next) => {
  const start = Date.now();
  await next();
  const duration = Date.now() - start;
  c.res.headers.set('X-Response-Time', `${duration}ms`);
};

/**
 * Cache headers middleware for GET requests
 */
export const cacheHeaders = (maxAge: number = 300) => {
  return async (c: Context, next: Next) => {
    await next();
    if (c.req.method === 'GET' && c.res.status === 200) {
      c.res.headers.set('Cache-Control', `public, max-age=${maxAge}`);
    }
  };
};
