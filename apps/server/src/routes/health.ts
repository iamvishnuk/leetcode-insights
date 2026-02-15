import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { EnvConfig } from '../config/env.config';
import { HealthResponseSchema } from '../schemas/health';

const health = new OpenAPIHono();

const healthRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Health'],
  summary: 'Health check',
  description: 'Health check endpoint',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: HealthResponseSchema
        }
      },
      description: 'Server health status'
    }
  }
});

health.openapi(healthRoute, (c) => {
  return c.json(
    {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: EnvConfig.nodeEnv,
      version: '1.0.0'
    },
    200
  );
});

export default health;
