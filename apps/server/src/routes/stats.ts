import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { fetchLeetcode } from '../lib/leetcode';
import { USER_STATS_QUERY, USER_SUBMISSION_STATS_QUERY } from '../lib/queries';
import { ErrorSchema, UsernameParamSchema } from '../schemas/common';
import {
  StatsResponseSchema,
  SubmissionStatsResponseSchema
} from '../schemas/stats';

interface StatsResponse {
  allQuestionsCount: {
    difficulty: string;
    count: number;
  }[];
  matchedUser: {
    submitStatsGlobal: {
      acSubmissionNum: {
        difficulty: string;
        count: number;
        submissions: number;
      }[];
    };
    problemsSolvedBeatsStats: {
      difficulty: string;
      percentage: number;
    }[];
  };
}

interface SubmissionStatsResponse {
  matchedUser: {
    submitStats: {
      acSubmissionNum: {
        difficulty: string;
        count: number;
        submissions: number;
      }[];
      totalSubmissionNum: {
        difficulty: string;
        count: number;
        submissions: number;
      }[];
    };
  };
}

const stats = new OpenAPIHono();

const statsRoute = createRoute({
  method: 'get',
  path: '/{username}',
  tags: ['Stats'],
  summary: 'Get user stats',
  description: "Get user's problem-solving statistics with beats percentage",
  request: {
    params: UsernameParamSchema
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: StatsResponseSchema
        }
      },
      description: 'User statistics'
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

stats.openapi(statsRoute, async (c) => {
  const { username } = c.req.valid('param');

  if (!username) {
    return c.json({ error: 'Username is required' }, 400);
  }

  try {
    const response = await fetchLeetcode<StatsResponse>(USER_STATS_QUERY, {
      username
    });

    if (!response.matchedUser) {
      return c.json({ error: 'User not found' }, 404);
    }

    const { allQuestionsCount, matchedUser } = response;
    const { submitStatsGlobal, problemsSolvedBeatsStats } = matchedUser;

    // Build total questions by difficulty
    const totalQuestions = allQuestionsCount.reduce(
      (acc, item) => {
        acc[item.difficulty.toLowerCase()] = item.count;
        return acc;
      },
      {} as Record<string, number>
    );

    // Build solved questions by difficulty
    const solved = submitStatsGlobal.acSubmissionNum.reduce(
      (acc, item) => {
        acc[item.difficulty.toLowerCase()] = {
          count: item.count,
          submissions: item.submissions
        };
        return acc;
      },
      {} as Record<string, { count: number; submissions: number }>
    );

    // Build beats stats
    const beats = problemsSolvedBeatsStats.reduce(
      (acc, item) => {
        acc[item.difficulty.toLowerCase()] = item.percentage;
        return acc;
      },
      {} as Record<string, number>
    );

    // Calculate acceptance rate
    const totalSolved = solved['all']?.count ?? 0;
    const totalSubmissions = solved['all']?.submissions ?? 0;
    const acceptanceRate =
      totalSubmissions > 0
        ? ((totalSolved / totalSubmissions) * 100).toFixed(2)
        : '0.00';

    const result = {
      username,
      totalQuestions: totalQuestions['all'] ?? 0,
      totalSolved,
      totalSubmissions,
      acceptanceRate: parseFloat(acceptanceRate),
      difficulty: {
        easy: {
          total: totalQuestions['easy'] ?? 0,
          solved: solved['easy']?.count ?? 0,
          beats: beats['easy'] ?? 0
        },
        medium: {
          total: totalQuestions['medium'] ?? 0,
          solved: solved['medium']?.count ?? 0,
          beats: beats['medium'] ?? 0
        },
        hard: {
          total: totalQuestions['hard'] ?? 0,
          solved: solved['hard']?.count ?? 0,
          beats: beats['hard'] ?? 0
        }
      }
    };

    return c.json(result, 200);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

const submissionStatsRoute = createRoute({
  method: 'get',
  path: '/{username}/submissions',
  tags: ['Stats'],
  summary: 'Get submission stats',
  description: 'Get detailed submission statistics',
  request: {
    params: UsernameParamSchema
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: SubmissionStatsResponseSchema
        }
      },
      description: 'User submission statistics'
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

stats.openapi(submissionStatsRoute, async (c) => {
  const { username } = c.req.valid('param');

  if (!username) {
    return c.json({ error: 'Username is required' }, 400);
  }

  try {
    const response = await fetchLeetcode<SubmissionStatsResponse>(
      USER_SUBMISSION_STATS_QUERY,
      { username }
    );

    if (!response.matchedUser) {
      return c.json({ error: 'User not found' }, 404);
    }

    const { submitStats } = response.matchedUser;

    const accepted = submitStats.acSubmissionNum;
    const total = submitStats.totalSubmissionNum;

    const difficulties = ['easy', 'medium', 'hard'];
    const result: Record<
      string,
      { accepted: number; total: number; acceptanceRate: number }
    > = {};

    for (const diff of difficulties) {
      const ac = accepted.find(
        (item) => item.difficulty.toLowerCase() === diff
      );
      const tot = total.find((item) => item.difficulty.toLowerCase() === diff);
      const acCount = ac?.submissions ?? 0;
      const totCount = tot?.submissions ?? 0;

      result[diff] = {
        accepted: acCount,
        total: totCount,
        acceptanceRate:
          totCount > 0 ? parseFloat(((acCount / totCount) * 100).toFixed(2)) : 0
      };
    }

    // Overall stats
    const overallAc = accepted.find(
      (item) => item.difficulty.toLowerCase() === 'all'
    );
    const overallTot = total.find(
      (item) => item.difficulty.toLowerCase() === 'all'
    );

    const match = {
      username,
      overall: {
        accepted: overallAc?.submissions ?? 0,
        total: overallTot?.submissions ?? 0,
        acceptanceRate:
          (overallTot?.submissions ?? 0) > 0
            ? parseFloat(
                (
                  ((overallAc?.submissions ?? 0) /
                    (overallTot?.submissions ?? 1)) *
                  100
                ).toFixed(2)
              )
            : 0
      },
      byDifficulty: result
    };
    return c.json(match, 200);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

export default stats;
