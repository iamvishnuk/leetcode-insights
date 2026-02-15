import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { fetchLeetcode } from '../lib/leetcode';
import { USER_RECENT_SUBMISSIONS_QUERY } from '../lib/queries';
import { ErrorSchema, UsernameParamSchema } from '../schemas/common';
import {
  RecentSubmissionsResponseSchema,
  LimitQuerySchema
} from '../schemas/submissions';

const count = 100;

interface RecentSubmissionsResponse {
  recentAcSubmissionList: {
    id: string;
    title: string;
    titleSlug: string;
    timestamp: string;
    statusDisplay: string;
    lang: string;
  }[];
}

const submissions = new OpenAPIHono();

const route = createRoute({
  method: 'get',
  path: '/{username}',
  tags: ['Submissions'],
  summary: 'Get recent submissions',
  description: "Get user's recent accepted submissions",
  request: {
    params: UsernameParamSchema,
    query: LimitQuerySchema
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: RecentSubmissionsResponseSchema
        }
      },
      description: 'Recent submissions'
    },
    400: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Bad Request'
    },
    404: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'User not found'
    },
    500: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Server Error'
    }
  }
});

submissions.openapi(route, async (c) => {
  const { username } = c.req.valid('param');
  const { limit: limitParam } = c.req.valid('query');

  if (!username) {
    return c.json({ error: 'Username is required' }, 400);
  }

  // Parse and validate limit
  let limit = 20;
  if (limitParam) {
    limit = Math.min(Math.max(parseInt(limitParam, 10) || 20, 1), 100);
  }

  try {
    const response = await fetchLeetcode<RecentSubmissionsResponse>(
      USER_RECENT_SUBMISSIONS_QUERY,
      { username, limit }
    );

    if (!response.recentAcSubmissionList) {
      return c.json({ error: 'User not found or no submissions' }, 404);
    }

    const submissions = response.recentAcSubmissionList.map((submission) => ({
      id: submission.id,
      title: submission.title,
      titleSlug: submission.titleSlug,
      problemUrl: `https://leetcode.com/problems/${submission.titleSlug}`,
      language: submission.lang,
      status: submission.statusDisplay,
      timestamp: parseInt(submission.timestamp, 10),
      date: new Date(parseInt(submission.timestamp, 10) * 1000).toISOString()
    }));

    // Group by date for easy display
    const groupedByDate = submissions.reduce(
      (acc, sub) => {
        const date = sub.date.split('T')[0]!;
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(sub);
        return acc;
      },
      {} as Record<string, typeof submissions>
    );

    // Language distribution
    const languageDistribution = submissions.reduce(
      (acc, sub) => {
        acc[sub.language] = (acc[sub.language] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return c.json(
      {
        username,
        count: submissions.length,
        submissions,
        groupedByDate,
        languageDistribution
      },
      200
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

export default submissions;
