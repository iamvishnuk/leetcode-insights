import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { prettyJSON } from 'hono/pretty-json';
import { EnvConfig } from './config/env.config';
import { errorHandler, timing } from './middleware/error';
import router from './routes/index';

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors());
app.use('*', prettyJSON());
app.use('*', timing);
app.use('*', errorHandler);

// Routes
app.route(EnvConfig.apiPrefix, router);

console.log(`
🚀 LeetCode Insights API Server
================================
Environment: ${EnvConfig.nodeEnv}
Port: ${EnvConfig.port}
API Base: http://localhost:${EnvConfig.port}${EnvConfig.apiPrefix}
`);

serve({
  fetch: app.fetch,
  port: EnvConfig.port
});
