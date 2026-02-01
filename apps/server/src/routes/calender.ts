import { Hono } from 'hono';
import {
  buildLast365DaysCalendarData,
  buildSingleYearLast365DaysCalendarData,
  buildYearCalendarData
} from '../lib/calender';
import { fetchLeetcode } from '../lib/leetcode';
import { USER_CALENDAR_QUERY } from '../lib/queries';

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

const calender = new Hono();

calender.get(':username', async (c) => {
  const userName = c.req.param('username');
  const yearParam = c.req.query('year');

  if (!userName) {
    throw new Error('Username is required');
  }

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

    return c.json({
      userName,
      year,
      ...calendarData
    });
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

    return c.json({
      userName,
      ...calendarData
    });
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

  return c.json({
    userName,
    ...calendarData
  });
});

export default calender;
