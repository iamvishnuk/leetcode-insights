import { Context, Next } from 'hono';
import { HTTPException } from 'hono/http-exception';

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
      // Handle specific LeetCode API errors
      if (
        err.message.includes('not found') ||
        err.message.includes('does not exist')
      ) {
        return c.json(
          {
            error: 'User not found',
            status: 404
          },
          404
        );
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
          error: err.message,
          status: 500
        },
        500
      );
    }

    return c.json(
      {
        error: 'Internal server error',
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
