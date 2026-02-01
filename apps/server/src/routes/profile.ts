import { Hono } from 'hono';
import { fetchLeetcode } from '../lib/leetcode';
import { USER_PROFILE_QUERY } from '../lib/queries';
import { cache, CacheTTL, userCacheKey } from '../lib/cache';

interface ProfileResponse {
  matchedUser: {
    username: string;
    profile: {
      realName: string;
      aboutMe: string;
      userAvatar: string;
      location: string;
      skillTags: string[];
      websites: string[];
      company: string;
      school: string;
      ranking: number;
      reputation: number;
      starRating: number;
      solutionCount: number;
      postViewCount: number;
    };
    submitStatsGlobal: {
      acSubmissionNum: {
        difficulty: string;
        count: number;
      }[];
    };
  };
}

const profile = new Hono();

/**
 * GET /:username
 * Get user's public profile information
 */
profile.get('/:username', async (c) => {
  const username = c.req.param('username');

  if (!username) {
    return c.json({ error: 'Username is required' }, 400);
  }

  // Check cache first
  const cacheKey = userCacheKey('profile', username);
  const cached = cache.get(cacheKey);
  if (cached) {
    c.res.headers.set('X-Cache', 'HIT');
    return c.json(cached);
  }

  try {
    const response = await fetchLeetcode<ProfileResponse>(USER_PROFILE_QUERY, {
      username
    });

    if (!response.matchedUser) {
      return c.json({ error: 'User not found' }, 404);
    }

    const { matchedUser } = response;
    const { profile: userProfile, submitStatsGlobal } = matchedUser;

    // Calculate total solved
    const totalSolved = submitStatsGlobal.acSubmissionNum.reduce(
      (sum, item) => (item.difficulty !== 'All' ? sum + item.count : sum),
      0
    );

    const result = {
      username: matchedUser.username,
      realName: userProfile.realName,
      aboutMe: userProfile.aboutMe,
      avatar: userProfile.userAvatar,
      location: userProfile.location,
      company: userProfile.company,
      school: userProfile.school,
      websites: userProfile.websites,
      skillTags: userProfile.skillTags,
      ranking: userProfile.ranking,
      reputation: userProfile.reputation,
      starRating: userProfile.starRating,
      solutionCount: userProfile.solutionCount,
      postViewCount: userProfile.postViewCount,
      totalSolved,
      solvedByDifficulty: submitStatsGlobal.acSubmissionNum
        .filter((item) => item.difficulty !== 'All')
        .reduce(
          (acc, item) => {
            acc[item.difficulty.toLowerCase()] = item.count;
            return acc;
          },
          {} as Record<string, number>
        )
    };

    // Cache the result
    cache.set(cacheKey, result, CacheTTL.PROFILE);
    c.res.headers.set('X-Cache', 'MISS');

    return c.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

export default profile;
