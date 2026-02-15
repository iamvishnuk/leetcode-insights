import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import {
  buildLast365DaysCalendarData,
  buildSingleYearLast365DaysCalendarData,
  buildYearCalendarData
} from '../lib/calender';
import { fetchLeetcode } from '../lib/leetcode';
import { USER_CALENDAR_QUERY } from '../lib/queries';
import { ErrorSchema, UsernameParamSchema } from '../schemas/common';
import { CalendarResponseSchema, YearQuerySchema } from '../schemas/calendar';

interface LeetCodeCalendarResponse {
  matchedUser: {
    userCalendar: {
      submissionCalendar: string;
      streak: number;
      totalActiveDays: number;
      activeYears: number[];
    };
  };
}

const calender = new OpenAPIHono();

const route = createRoute({
  method: 'get',
  path: '/{username}',
  tags: ['Calendar'],
  summary: 'Get submission calendar',
  description: 'Get submission calendar (last 365 days or specific year)',
  request: {
    params: UsernameParamSchema,
    query: YearQuerySchema
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: CalendarResponseSchema
        }
      },
      description: 'Submission calendar'
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

calender.openapi(route, async (c) => {
  const { username: userName } = c.req.valid('param');
  const { year: yearParam } = c.req.valid('query');

  if (!userName) {
    // This probably won't be reached due to Zod validation, but matching existing logic style
    return c.json({ error: 'Username is required' }, 400);
  }

  try {
    // If year is provided, fetch data for that specific year
    if (yearParam) {
      const year = parseInt(yearParam, 10);
      const response = await fetchLeetcode<LeetCodeCalendarResponse>(
        USER_CALENDAR_QUERY,
        {
          username: userName,
          year: year
        }
      );

      const calendarData = buildYearCalendarData(response);

      return c.json(
        {
          userName,
          year,
          ...calendarData
        },
        200
      );
    }

    // Default: fetch last 365 days (may span current and previous year)
    const now = new Date();
    const currentYear = now.getFullYear();
    const oneYearAgo = new Date(now);
    oneYearAgo.setDate(oneYearAgo.getDate() - 365);
    const previousYear = oneYearAgo.getFullYear();

    // Fetch both years in parallel if they differ
    if (currentYear !== previousYear) {
      const [currentYearResponse, previousYearResponse] = await Promise.all([
        fetchLeetcode<LeetCodeCalendarResponse>(USER_CALENDAR_QUERY, {
          username: userName,
          year: currentYear
        }),
        fetchLeetcode<LeetCodeCalendarResponse>(USER_CALENDAR_QUERY, {
          username: userName,
          year: previousYear
        })
      ]);

      const calendarData = buildLast365DaysCalendarData(
        currentYearResponse,
        previousYearResponse
      );

      return c.json(
        {
          userName,
          ...calendarData
        },
        200
      );
    }

    // Same year (edge case: within first few days of the year)
    const response = await fetchLeetcode<LeetCodeCalendarResponse>(
      USER_CALENDAR_QUERY,
      {
        username: userName,
        year: currentYear
      }
    );

    const calendarData = buildSingleYearLast365DaysCalendarData(response);

    return c.json(
      {
        userName,
        ...calendarData
      },
      200
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: message }, 500);
  }
});

export default calender;
