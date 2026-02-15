import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { fetchLeetcode } from '../lib/leetcode';
import { USER_CONTEST_RANKING_QUERY } from '../lib/queries';
import { ErrorSchema, UsernameParamSchema } from '../schemas/common';
import { ContestResponseSchema } from '../schemas/contest';

interface ContestRankingResponse {
  userContestRanking: {
    attendedContestsCount: number;
    rating: number;
    globalRanking: number;
    totalParticipants: number;
    topPercentage: number;
    badge: {
      name: string;
    } | null;
  } | null;
  userContestRankingHistory: {
    attended: boolean;
    rating: number;
    ranking: number;
    trendDirection: string;
    problemsSolved: number;
    totalProblems: number;
    finishTimeInSeconds: number;
    contest: {
      title: string;
      startTime: number;
    };
  }[];
}

const contest = new OpenAPIHono();

const route = createRoute({
  method: 'get',
  path: '/{username}',
  tags: ['Contest'],
  summary: 'Get contest ranking',
  description: "Get user's contest ranking and history",
  request: {
    params: UsernameParamSchema
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: ContestResponseSchema
        }
      },
      description: 'Contest ranking and history'
    },
    400: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Bad Request'
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

contest.openapi(route, async (c) => {
  const { username } = c.req.valid('param');

  if (!username) {
    return c.json({ error: 'Username is required' }, 400);
  }

  try {
    const response = await fetchLeetcode<ContestRankingResponse>(
      USER_CONTEST_RANKING_QUERY,
      { username }
    );

    const { userContestRanking, userContestRankingHistory } = response;

    // User might not have participated in contests
    if (!userContestRanking) {
      return c.json(
        {
          username,
          hasContestData: false,
          message: 'User has not participated in any contests'
        },
        200
      );
    }

    // Filter only attended contests
    const attendedContests = userContestRankingHistory.filter(
      (contest) => contest.attended
    );

    // Calculate stats from history
    const ratingHistory = attendedContests.map((contest) => ({
      name: contest.contest.title,
      rating: Math.round(contest.rating),
      date: new Date(contest.contest.startTime * 1000).toISOString()
    }));

    // Best and worst performances
    const sortedByRating = [...attendedContests].sort(
      (a, b) => b.rating - a.rating
    );
    const sortedByRanking = [...attendedContests].sort(
      (a, b) => a.ranking - b.ranking
    );

    const avgProblemsPerContest =
      attendedContests.length > 0
        ? (
            attendedContests.reduce((sum, c) => sum + c.problemsSolved, 0) /
            attendedContests.length
          ).toFixed(2)
        : 0;

    return c.json(
      {
        username,
        hasContestData: true,
        ranking: {
          current: userContestRanking.globalRanking,
          rating: Math.round(userContestRanking.rating),
          topPercentage: parseFloat(
            userContestRanking.topPercentage.toFixed(2)
          ),
          totalParticipants: userContestRanking.totalParticipants,
          attendedCount: userContestRanking.attendedContestsCount,
          badge: userContestRanking.badge?.name ?? null
        },
        stats: {
          averageProblemsPerContest: parseFloat(
            avgProblemsPerContest.toString()
          ),
          bestRating: sortedByRating[0]
            ? Math.round(sortedByRating[0].rating)
            : null,
          bestRank: sortedByRanking[0]?.ranking ?? null
        },
        recentContests: ratingHistory.slice(0, 10),
        ratingHistory: ratingHistory.map((c) => ({
          name: c.name,
          rating: c.rating,
          date: c.date
        }))
      },
      200
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

export default contest;
