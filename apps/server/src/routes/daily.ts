import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { fetchLeetcode } from '../lib/leetcode';
import { DAILY_CHALLENGE_QUERY } from '../lib/queries';
import { ErrorSchema } from '../schemas/common';
import { DailyChallengeResponseSchema } from '../schemas/daily';

interface DailyChallengeResponse {
  activeDailyCodingChallengeQuestion: {
    date: string;
    link: string;
    question: {
      questionId: string;
      questionFrontendId: string;
      title: string;
      titleSlug: string;
      difficulty: string;
      topicTags: {
        name: string;
        slug: string;
      }[];
      stats: string;
      likes: number;
      dislikes: number;
      isPaidOnly: boolean;
    };
  };
}

const daily = new OpenAPIHono();

const route = createRoute({
  method: 'get',
  path: '/',
  tags: ['Daily'],
  summary: 'Get daily challenge',
  description: "Get today's daily coding challenge",
  responses: {
    200: {
      content: {
        'application/json': {
          schema: DailyChallengeResponseSchema
        }
      },
      description: 'Daily challenge'
    },
    404: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'No daily challenge found'
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

daily.openapi(route, async (c) => {
  try {
    const response = await fetchLeetcode<DailyChallengeResponse>(
      DAILY_CHALLENGE_QUERY
    );

    const { activeDailyCodingChallengeQuestion: challenge } = response;

    if (!challenge) {
      return c.json({ error: 'No daily challenge found' }, 404);
    }

    // Parse stats JSON
    let statsData: {
      totalAccepted?: string;
      totalSubmission?: string;
      acRate?: string;
    } = {};
    try {
      statsData = JSON.parse(challenge.question.stats);
    } catch {
      // ignore parse errors
    }

    return c.json(
      {
        date: challenge.date,
        link: `https://leetcode.com${challenge.link}`,
        question: {
          id: challenge.question.questionFrontendId,
          title: challenge.question.title,
          titleSlug: challenge.question.titleSlug,
          difficulty: challenge.question.difficulty,
          isPaidOnly: challenge.question.isPaidOnly,
          likes: challenge.question.likes,
          dislikes: challenge.question.dislikes,
          acceptanceRate: statsData.acRate ?? null,
          totalAccepted: statsData.totalAccepted ?? null,
          totalSubmissions: statsData.totalSubmission ?? null
        },
        topics: challenge.question.topicTags.map((tag) => ({
          name: tag.name,
          slug: tag.slug
        }))
      },
      200
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

export default daily;
