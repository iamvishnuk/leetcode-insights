import { OpenAPIHono } from '@hono/zod-openapi';
import calenderRoutes from './calender';
import profileRoutes from './profile';
import statsRoutes from './stats';
import submissionsRoutes from './submissions';
import contestRoutes from './contest';
import badgesRoutes from './badges';
import skillsRoutes from './skills';
import dailyRoutes from './daily';
import healthRoutes from './health';
import overviewRoutes from './overview';

const router = new OpenAPIHono();

// Health check routes
router.route('/health', healthRoutes);

// User-related routes
router.route('/overview', overviewRoutes); // Combined data - perfect for portfolios
router.route('/profile', profileRoutes);
router.route('/stats', statsRoutes);
router.route('/calendar', calenderRoutes);
router.route('/calender', calenderRoutes); // Keep legacy spelling
router.route('/submissions', submissionsRoutes);
router.route('/contest', contestRoutes);
router.route('/badges', badgesRoutes);
router.route('/skills', skillsRoutes);

// LeetCode platform routes
router.route('/daily', dailyRoutes);

// API documentation endpoint
router.get('/', (c) => {
  return c.json({
    name: 'LeetCode Insights API',
    version: '1.0.0',
    description: 'REST API for fetching LeetCode user statistics and insights',
    documentation: 'https://github.com/your-repo/leetcode-insights',
    endpoints: {
      health: {
        'GET /health': 'Health check with server info',
        'GET /health/ping': 'Simple ping/pong'
      },
      overview: {
        'GET /overview/:username':
          'Get comprehensive user overview (profile + stats + contest) - ideal for portfolios'
      },
      profile: {
        'GET /profile/:username': 'Get user public profile information'
      },
      stats: {
        'GET /stats/:username':
          'Get problem-solving statistics with beats percentage',
        'GET /stats/:username/submissions': 'Get detailed submission statistics'
      },
      calendar: {
        'GET /calendar/:username': 'Get submission calendar (last 365 days)',
        'GET /calendar/:username?year=YYYY':
          'Get submission calendar for specific year'
      },
      submissions: {
        'GET /submissions/:username': 'Get recent accepted submissions',
        'GET /submissions/:username?limit=N':
          'Get N recent submissions (max 100)'
      },
      contest: {
        'GET /contest/:username': 'Get contest ranking and history'
      },
      badges: {
        'GET /badges/:username': 'Get earned and upcoming badges'
      },
      skills: {
        'GET /skills/:username': 'Get skill tags (algorithms/data structures)',
        'GET /skills/:username/languages':
          'Get programming language distribution'
      },
      daily: {
        'GET /daily': "Get today's daily coding challenge"
      }
    },
    examples: {
      overview: '/api/v1/overview/leetcode_username',
      profile: '/api/v1/profile/leetcode_username',
      stats: '/api/v1/stats/leetcode_username',
      calendar: '/api/v1/calendar/leetcode_username?year=2025',
      daily: '/api/v1/daily'
    }
  });
});

export default router;
