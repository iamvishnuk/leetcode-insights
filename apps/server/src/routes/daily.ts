import { Hono } from 'hono';
import { fetchLeetcode } from '../lib/leetcode';
import { DAILY_CHALLENGE_QUERY } from '../lib/queries';

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

const daily = new Hono();

/**
 * GET /
 * Get today's daily coding challenge
 */
daily.get('/', async (c) => {
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

    return c.json({
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
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

export default daily;
