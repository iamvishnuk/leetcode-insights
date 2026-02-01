import { Hono } from 'hono';
import { EnvConfig } from '../config/env.config';

const health = new Hono();

/**
 * GET /
 * Health check endpoint
 */
health.get('/', (c) => {
  return c.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: EnvConfig.nodeEnv,
    version: '1.0.0'
  });
});

/**
 * GET /ping
 * Simple ping endpoint
 */
health.get('/ping', (c) => {
  return c.text('pong');
});

export default health;
