import { describe, it, expect, mock, afterEach } from 'bun:test';
import { fetchLeetcode, LeetcodeAPIError } from './leetcode';

describe('fetchLeetcode', () => {
  const MOCK_QUERY = 'query { matchedUser(username: "test") { username } }';

  afterEach(() => {
    mock.restore();
  });

  it('should return data successfully on a valid response', async () => {
    const mockData = { matchedUser: { username: 'test' } };

    // Mock the global fetch
    global.fetch = mock(() =>
      Promise.resolve(new Response(JSON.stringify({ data: mockData })))
    ) as any; // eslint-disable-line @typescript-eslint/no-explicit-any

    const result = await fetchLeetcode<{ matchedUser: { username: string } }>(
      MOCK_QUERY
    );

    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('should throw returning LeetcodeAPIError on HTTP error', async () => {
    global.fetch = mock(() =>
      Promise.resolve(
        new Response(null, { status: 404, statusText: 'Not Found' })
      )
    ) as any; // eslint-disable-line @typescript-eslint/no-explicit-any

    try {
      await fetchLeetcode(MOCK_QUERY);
      // Wait, it shouldn't reach here
      expect(true).toBe(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      expect(e).toBeInstanceOf(LeetcodeAPIError);
      expect(e.status).toBe(404);
      expect(e.message).toContain('HTTP error: Not Found');
    }
  });

  it('should throw returning LeetcodeAPIError on GraphQL error', async () => {
    const mockGraphQLError = {
      errors: [{ message: 'User does not exist' }]
    };

    global.fetch = mock(() =>
      Promise.resolve(new Response(JSON.stringify(mockGraphQLError)))
    ) as any; // eslint-disable-line @typescript-eslint/no-explicit-any

    expect(fetchLeetcode(MOCK_QUERY)).rejects.toThrowError(
      new LeetcodeAPIError('GraphQL Error: User does not exist')
    );
  });

  it('should throw returning LeetcodeAPIError on No Data Error', async () => {
    // Missing 'data' prop entirely
    global.fetch = mock(() =>
      Promise.resolve(new Response(JSON.stringify({})))
    ) as any; // eslint-disable-line @typescript-eslint/no-explicit-any

    expect(fetchLeetcode(MOCK_QUERY)).rejects.toThrowError(
      new LeetcodeAPIError('No data returned from LeetCode API')
    );
  });
});
