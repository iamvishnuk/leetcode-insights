import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { fetchLeetcode } from '../lib/leetcode';
import { USER_BADGES_QUERY } from '../lib/queries';
import { ErrorSchema, UsernameParamSchema } from '../schemas/common';
import { BadgesResponseSchema } from '../schemas/badges';

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

const badges = new OpenAPIHono();

const route = createRoute({
  method: 'get',
  path: '/{username}',
  tags: ['Badges'],
  summary: 'Get user badges',
  description: "Get user's earned badges and upcoming badges",
  request: {
    params: UsernameParamSchema
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: BadgesResponseSchema
        }
      },
      description: 'User badges'
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

badges.openapi(route, async (c) => {
  const { username } = c.req.valid('param');

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

    return c.json(
      {
        username,
        totalBadges: earnedBadges.length,
        badges: earnedBadges,
        upcomingBadges: upcoming,
        upcomingCount: upcoming.length
      },
      200
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

export default badges;
