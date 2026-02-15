import { OpenAPIHono, createRoute } from '@hono/zod-openapi';
import { fetchLeetcode } from '../lib/leetcode';
import { USER_SKILLS_QUERY, USER_LANGUAGE_STATS_QUERY } from '../lib/queries';
import { ErrorSchema, UsernameParamSchema } from '../schemas/common';
import {
  SkillsResponseSchema,
  LanguageResponseSchema
} from '../schemas/skills';

interface SkillsResponse {
  matchedUser: {
    tagProblemCounts: {
      advanced: TagStat[];
      intermediate: TagStat[];
      fundamental: TagStat[];
    };
  };
}

interface TagStat {
  tagName: string;
  tagSlug: string;
  problemsSolved: number;
}

interface LanguageStatsResponse {
  matchedUser: {
    languageProblemCount: {
      languageName: string;
      problemsSolved: number;
    }[];
  };
}

const skills = new OpenAPIHono();

const skillsRoute = createRoute({
  method: 'get',
  path: '/{username}',
  tags: ['Skills'],
  summary: 'Get user skills',
  description: "Get user's skill tags (algorithms/data structures solved)",
  request: {
    params: UsernameParamSchema
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: SkillsResponseSchema
        }
      },
      description: 'User skills'
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

skills.openapi(skillsRoute, async (c) => {
  const { username } = c.req.valid('param');

  if (!username) {
    return c.json({ error: 'Username is required' }, 400);
  }

  try {
    const response = await fetchLeetcode<SkillsResponse>(USER_SKILLS_QUERY, {
      username
    });

    if (!response.matchedUser) {
      return c.json({ error: 'User not found' }, 404);
    }

    const { tagProblemCounts } = response.matchedUser;

    // Format skills by level
    const formatSkills = (skills: TagStat[]) =>
      skills
        .filter((s) => s.problemsSolved > 0)
        .sort((a, b) => b.problemsSolved - a.problemsSolved)
        .map((s) => ({
          name: s.tagName,
          slug: s.tagSlug,
          problemsSolved: s.problemsSolved
        }));

    const fundamental = formatSkills(tagProblemCounts.fundamental);
    const intermediate = formatSkills(tagProblemCounts.intermediate);
    const advanced = formatSkills(tagProblemCounts.advanced);

    // Combine all for top skills
    const allSkills = [...fundamental, ...intermediate, ...advanced].sort(
      (a, b) => b.problemsSolved - a.problemsSolved
    );

    return c.json(
      {
        username,
        topSkills: allSkills.slice(0, 10),
        skillsByLevel: {
          fundamental: {
            count: fundamental.length,
            skills: fundamental
          },
          intermediate: {
            count: intermediate.length,
            skills: intermediate
          },
          advanced: {
            count: advanced.length,
            skills: advanced
          }
        },
        totalSkillTags: allSkills.length
      },
      200
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

const languagesRoute = createRoute({
  method: 'get',
  path: '/{username}/languages',
  tags: ['Skills'],
  summary: 'Get user languages',
  description: "Get user's programming language distribution",
  request: {
    params: UsernameParamSchema
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: LanguageResponseSchema
        }
      },
      description: 'User languages'
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

skills.openapi(languagesRoute, async (c) => {
  const { username } = c.req.valid('param');

  if (!username) {
    return c.json({ error: 'Username is required' }, 400);
  }

  try {
    const response = await fetchLeetcode<LanguageStatsResponse>(
      USER_LANGUAGE_STATS_QUERY,
      { username }
    );

    if (!response.matchedUser) {
      return c.json({ error: 'User not found' }, 404);
    }

    const { languageProblemCount } = response.matchedUser;

    // Sort by problems solved
    const languages = languageProblemCount
      .filter((l) => l.problemsSolved > 0)
      .sort((a, b) => b.problemsSolved - a.problemsSolved)
      .map((l) => ({
        name: l.languageName,
        problemsSolved: l.problemsSolved
      }));

    // Calculate percentages
    const totalProblems = languages.reduce(
      (sum, l) => sum + l.problemsSolved,
      0
    );

    const languagesWithPercentage = languages.map((l) => ({
      ...l,
      percentage: parseFloat(
        ((l.problemsSolved / totalProblems) * 100).toFixed(2)
      )
    }));

    return c.json(
      {
        username,
        primaryLanguage: languages[0]?.name ?? null,
        totalLanguages: languages.length,
        languages: languagesWithPercentage
      },
      200
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

export default skills;
