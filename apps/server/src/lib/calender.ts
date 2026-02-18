export interface DayData {
  date: string; // YYYY-MM-DD format
  timestamp: number;
  submissions: number;
}

export interface CalendarData {
  days: DayData[];
  totalSubmissions: number;
  totalActiveDays: number;
  streak: number;
  activeYears: number[];
  startDate: string;
  endDate: string;
}

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

/**
 * Parse the submissionCalendar JSON string from LeetCode API
 */
export const parseSubmissionCalendar = (
  submissionCalendar: string
): Record<number, number> => {
  try {
    return JSON.parse(submissionCalendar);
  } catch {
    return {};
  }
};

/**
 * Convert timestamp to YYYY-MM-DD format
 */
export const timestampToDateString = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toISOString().split('T')[0]!;
};

/**
 * Get start of day timestamp for a given date
 */
export const getStartOfDayTimestamp = (date: Date): number => {
  const utc = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  );

  return Math.floor(utc / 1000);
};

/**
 * Generate all dates for a specific year
 */
export const generateYearDates = (year: number): Date[] => {
  const dates: Date[] = [];
  const startDate = new Date(Date.UTC(year, 0, 1));
  const endDate = new Date(Date.UTC(year, 11, 31));

  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  return dates;
};

/**
 * Generate dates for the last N days from today
 */
export const generateLastNDaysDates = (days: number): Date[] => {
  const dates: Date[] = [];
  const now = new Date();

  const todayUTC = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(todayUTC);
    date.setUTCDate(todayUTC.getUTCDate() - i);
    dates.push(date);
  }

  return dates;
};

/**
 * Build calendar data for a specific year
 */
export const buildYearCalendarData = (
  response: LeetCodeCalendarResponse
): CalendarData => {
  const { userCalendar } = response.matchedUser;
  const submissions = parseSubmissionCalendar(userCalendar.submissionCalendar);

  // Get the year from the first submission or current year
  const timestamps = Object.keys(submissions).map(Number);
  if (timestamps.length === 0) {
    const currentYear = new Date().getFullYear();
    const dates = generateYearDates(currentYear);
    return {
      days: dates.map((date) => ({
        date: date.toISOString().split('T')[0]!,
        timestamp: getStartOfDayTimestamp(date),
        submissions: 0
      })),
      totalSubmissions: 0,
      totalActiveDays: userCalendar.totalActiveDays,
      streak: userCalendar.streak,
      activeYears: userCalendar.activeYears,
      startDate: dates[0]!.toISOString().split('T')[0]!,
      endDate: dates[dates.length - 1]!.toISOString().split('T')[0]!
    };
  }

  const year = new Date(timestamps[0]! * 1000).getUTCFullYear();
  const dates = generateYearDates(year);

  const days: DayData[] = dates.map((date) => {
    const timestamp = getStartOfDayTimestamp(date);
    return {
      date: date.toISOString().split('T')[0]!,
      timestamp,
      submissions: submissions[timestamp] ?? 0
    };
  });

  const totalSubmissions = days.reduce((sum, day) => sum + day.submissions, 0);

  return {
    days,
    totalSubmissions,
    totalActiveDays: userCalendar.totalActiveDays,
    streak: userCalendar.streak,
    activeYears: userCalendar.activeYears,
    startDate: days[0]!.date,
    endDate: days[days.length - 1]!.date
  };
};

/**
 * Build calendar data for the last 365 days from two year responses
 */
export const buildLast365DaysCalendarData = (
  currentYearResponse: LeetCodeCalendarResponse,
  previousYearResponse: LeetCodeCalendarResponse
): CalendarData => {
  const currentSubmissions = parseSubmissionCalendar(
    currentYearResponse.matchedUser.userCalendar.submissionCalendar
  );
  const previousSubmissions = parseSubmissionCalendar(
    previousYearResponse.matchedUser.userCalendar.submissionCalendar
  );

  // Merge both submission calendars
  const allSubmissions = { ...previousSubmissions, ...currentSubmissions };

  const dates = generateLastNDaysDates(365);

  const days: DayData[] = dates.map((date) => {
    const timestamp = getStartOfDayTimestamp(date);
    return {
      date: date.toISOString().split('T')[0]!,
      timestamp,
      submissions: allSubmissions[timestamp] ?? 0
    };
  });

  const totalSubmissions = days.reduce((sum, day) => sum + day.submissions, 0);
  const activeDaysCount = days.filter((day) => day.submissions > 0).length;

  // Calculate current streak from today going backwards
  let streak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i]!.submissions > 0) {
      streak++;
    } else {
      break;
    }
  }

  return {
    days,
    totalSubmissions,
    totalActiveDays: activeDaysCount,
    streak,
    activeYears: currentYearResponse.matchedUser.userCalendar.activeYears,
    startDate: days[0]!.date,
    endDate: days[days.length - 1]!.date
  };
};

/**
 * Build calendar data for a single year (when both years are the same)
 */
export const buildSingleYearLast365DaysCalendarData = (
  response: LeetCodeCalendarResponse
): CalendarData => {
  const submissions = parseSubmissionCalendar(
    response.matchedUser.userCalendar.submissionCalendar
  );

  const dates = generateLastNDaysDates(365);

  const days: DayData[] = dates.map((date) => {
    const timestamp = getStartOfDayTimestamp(date);
    return {
      date: date.toISOString().split('T')[0]!,
      timestamp,
      submissions: submissions[timestamp] ?? 0
    };
  });

  const totalSubmissions = days.reduce((sum, day) => sum + day.submissions, 0);
  const activeDaysCount = days.filter((day) => day.submissions > 0).length;

  // Calculate current streak from today going backwards
  let streak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i]!.submissions > 0) {
      streak++;
    } else {
      break;
    }
  }

  return {
    days,
    totalSubmissions,
    totalActiveDays: activeDaysCount,
    streak,
    activeYears: response.matchedUser.userCalendar.activeYears,
    startDate: days[0]!.date,
    endDate: days[days.length - 1]!.date
  };
};
