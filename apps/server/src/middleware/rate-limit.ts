import { Context } from 'hono';
import { rateLimiter } from 'hono-rate-limiter';

export const limiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-6',
  keyGenerator: (c: Context) =>
    c.req.header('cf-connecting-ip') ||
    c.req.header('x-forwarded-for') ||
    'unknown'
});
