import { Hono } from 'hono';
import { fetchLeetcode } from '../lib/leetcode';
import { USER_RECENT_SUBMISSIONS_QUERY } from '../lib/queries';

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

const submissions = new Hono();

/**
 * GET /:username
 * Get user's recent accepted submissions
 * Query params:
 *   - limit: number of submissions to fetch (default: 20, max: 100)
 */
submissions.get('/:username', async (c) => {
  const username = c.req.param('username');
  const limitParam = c.req.query('limit');

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

    return c.json({
      username,
      count: submissions.length,
      submissions,
      groupedByDate,
      languageDistribution
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

export default submissions;
