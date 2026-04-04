import { EnvConfig } from '../config/env.config.js';

interface GraphQLError {
  message: string;
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLError[];
}

export class LeetcodeAPIError extends Error {
  constructor(
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = 'LeetcodeAPIError';
  }
}

export const fetchLeetcode = async <T>(
  query: string,
  variables?: Record<string, unknown>,
  timeoutMs = 10000
): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(EnvConfig.leetcodeBaseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'LeetCodeInsights/1.0'
      },
      body: JSON.stringify({ query, variables }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new LeetcodeAPIError(
        `LeetCode API HTTP error: ${response.statusText}`,
        response.status
      );
    }

    const json = (await response.json()) as GraphQLResponse<T>;

    if (json.errors && json.errors.length > 0) {
      const messages = json.errors.map((e) => e.message).join(', ');
      throw new LeetcodeAPIError(`GraphQL Error: ${messages}`);
    }

    if (!json.data) {
      throw new LeetcodeAPIError('No data returned from LeetCode API');
    }

    return json.data;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new LeetcodeAPIError('LeetCode API request timed out');
    }
    throw error;
  }
};
