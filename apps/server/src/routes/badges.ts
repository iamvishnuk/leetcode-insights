import { Hono } from 'hono';
import { fetchLeetcode } from '../lib/leetcode';
import { USER_BADGES_QUERY } from '../lib/queries';

interface BadgesResponse {
  matchedUser: {
    badges: {
      id: string;
      name: string;
      shortName: string;
      displayName: string;
      icon: string;
      hoverText: string;
      creationDate: string;
      medal: {
        slug: string;
        config: {
          iconGif: string;
          iconGifBackground: string;
        };
      } | null;
    }[];
    upcomingBadges: {
      name: string;
      icon: string;
    }[];
  };
}

const badges = new Hono();

/**
 * GET /:username
 * Get user's earned badges and upcoming badges
 */
badges.get('/:username', async (c) => {
  const username = c.req.param('username');

  if (!username) {
    return c.json({ error: 'Username is required' }, 400);
  }

  try {
    const response = await fetchLeetcode<BadgesResponse>(USER_BADGES_QUERY, {
      username
    });

    if (!response.matchedUser) {
      return c.json({ error: 'User not found' }, 404);
    }

    const { badges: userBadges, upcomingBadges } = response.matchedUser;

    // Format earned badges
    const earnedBadges = userBadges.map((badge) => ({
      id: badge.id,
      name: badge.displayName || badge.name,
      shortName: badge.shortName,
      description: badge.hoverText,
      icon: badge.icon,
      earnedDate: badge.creationDate,
      medal: badge.medal
        ? {
            slug: badge.medal.slug,
            gif: badge.medal.config.iconGif,
            background: badge.medal.config.iconGifBackground
          }
        : null
    }));

    // Sort by earned date (most recent first)
    earnedBadges.sort((a, b) => {
      const dateA = new Date(a.earnedDate).getTime();
      const dateB = new Date(b.earnedDate).getTime();
      return dateB - dateA;
    });

    // Format upcoming badges
    const upcoming = upcomingBadges.map((badge) => ({
      name: badge.name,
      icon: badge.icon
    }));

    return c.json({
      username,
      totalBadges: earnedBadges.length,
      badges: earnedBadges,
      upcomingBadges: upcoming,
      upcomingCount: upcoming.length
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

export default badges;
