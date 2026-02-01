import { Hono } from 'hono';
import { fetchLeetcode } from '../lib/leetcode';
import { cache, CacheTTL, userCacheKey } from '../lib/cache';
import {
  USER_PROFILE_QUERY,
  USER_STATS_QUERY,
  USER_CONTEST_RANKING_QUERY,
  USER_LANGUAGE_STATS_QUERY,
  USER_CALENDAR_QUERY
} from '../lib/queries';

const overview = new Hono();

/**
 * GET /:username
 * Get a comprehensive overview of user's LeetCode profile
 * Perfect for portfolio displays - all data in one request
 */
overview.get('/:username', async (c) => {
  const username = c.req.param('username');

  if (!username) {
    return c.json({ error: 'Username is required' }, 400);
  }

  // Check cache
  const cacheKey = userCacheKey('overview', username);
  const cached = cache.get(cacheKey);
  if (cached) {
    c.res.headers.set('X-Cache', 'HIT');
    return c.json(cached);
  }

  try {
    const currentYear = new Date().getFullYear();

    // Fetch all data in parallel
    const [profileRes, statsRes, contestRes, languageRes, calendarRes] =
      await Promise.all([
        fetchLeetcode<{
          matchedUser: {
            username: string;
            profile: {
              realName: string;
              userAvatar: string;
              ranking: number;
            };
          };
        }>(USER_PROFILE_QUERY, { username }),

        fetchLeetcode<{
          allQuestionsCount: { difficulty: string; count: number }[];
          matchedUser: {
            submitStatsGlobal: {
              acSubmissionNum: { difficulty: string; count: number }[];
            };
          };
        }>(USER_STATS_QUERY, { username }),

        fetchLeetcode<{
          userContestRanking: {
            rating: number;
            globalRanking: number;
            attendedContestsCount: number;
            topPercentage: number;
          } | null;
        }>(USER_CONTEST_RANKING_QUERY, { username }),

        fetchLeetcode<{
          matchedUser: {
            languageProblemCount: {
              languageName: string;
              problemsSolved: number;
            }[];
          };
        }>(USER_LANGUAGE_STATS_QUERY, { username }),

        fetchLeetcode<{
          matchedUser: {
            userCalendar: {
              streak: number;
              totalActiveDays: number;
            };
          };
        }>(USER_CALENDAR_QUERY, { username, year: currentYear })
      ]);

    if (!profileRes.matchedUser) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Extract solved counts
    const solved = {
      easy: 0,
      medium: 0,
      hard: 0,
      total: 0
    };

    const total = {
      easy: 0,
      medium: 0,
      hard: 0,
      total: 0
    };

    for (const item of statsRes.allQuestionsCount) {
      const key = item.difficulty.toLowerCase() as keyof typeof total;
      if (key in total) {
        total[key] = item.count;
      }
    }

    for (const item of statsRes.matchedUser.submitStatsGlobal.acSubmissionNum) {
      const key = item.difficulty.toLowerCase() as keyof typeof solved;
      if (key in solved) {
        solved[key] = item.count;
      }
    }

    // Get primary language
    const languages = languageRes.matchedUser?.languageProblemCount ?? [];
    const primaryLanguage = languages.sort(
      (a, b) => b.problemsSolved - a.problemsSolved
    )[0]?.languageName;

    const result = {
      username: profileRes.matchedUser.username,
      avatar: profileRes.matchedUser.profile.userAvatar,
      realName: profileRes.matchedUser.profile.realName,
      ranking: profileRes.matchedUser.profile.ranking,
      solved: {
        total: solved.easy + solved.medium + solved.hard,
        easy: solved.easy,
        medium: solved.medium,
        hard: solved.hard
      },
      totalProblems: {
        total: total.easy + total.medium + total.hard,
        easy: total.easy,
        medium: total.medium,
        hard: total.hard
      },
      solveRate: {
        easy:
          total.easy > 0
            ? parseFloat(((solved.easy / total.easy) * 100).toFixed(1))
            : 0,
        medium:
          total.medium > 0
            ? parseFloat(((solved.medium / total.medium) * 100).toFixed(1))
            : 0,
        hard:
          total.hard > 0
            ? parseFloat(((solved.hard / total.hard) * 100).toFixed(1))
            : 0
      },
      streak: calendarRes.matchedUser?.userCalendar?.streak ?? 0,
      totalActiveDays:
        calendarRes.matchedUser?.userCalendar?.totalActiveDays ?? 0,
      contest: contestRes.userContestRanking
        ? {
            rating: Math.round(contestRes.userContestRanking.rating),
            ranking: contestRes.userContestRanking.globalRanking,
            attended: contestRes.userContestRanking.attendedContestsCount,
            topPercentage: parseFloat(
              contestRes.userContestRanking.topPercentage.toFixed(2)
            )
          }
        : null,
      primaryLanguage: primaryLanguage ?? null,
      profileUrl: `https://leetcode.com/${username}`
    };

    // Cache result
    cache.set(cacheKey, result, CacheTTL.PROFILE);
    c.res.headers.set('X-Cache', 'MISS');

    return c.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

export default overview;
