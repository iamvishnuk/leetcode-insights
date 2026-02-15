import { serve } from '@hono/node-server';
import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';
import { EnvConfig } from './config/env.config';
import { errorHandler, timing } from './middleware/error';
import { limiter } from './middleware/rate-limit';
import router from './routes/index';

const app = new OpenAPIHono();

// Middleware
app.use('*', logger());
app.use('*', cors());
app.use('*', prettyJSON());
app.use('*', timing);
app.use('*', errorHandler);
app.use('*', limiter);

// OpenAPI Documentation
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'LeetCode Insights API',
    description:
      'REST API for fetching LeetCode user statistics and insights. Ideal for portfolios and developer tools.'
  }
});

app.get('/swagger', swaggerUI({ url: '/doc' }));

// Routes
app.route(EnvConfig.apiPrefix, router);

console.log(`
🚀 LeetCode Insights API Server
================================
Environment: ${EnvConfig.nodeEnv}
Port: ${EnvConfig.port}
API Base: http://localhost:${EnvConfig.port}${EnvConfig.apiPrefix}
Docs: http://localhost:${EnvConfig.port}/swagger
`);

serve({
  fetch: app.fetch,
  port: EnvConfig.port
});
