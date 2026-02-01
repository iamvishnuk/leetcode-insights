interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class MemoryCache {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private defaultTTL: number;

  constructor(defaultTTLSeconds: number = 300) {
    // Default 5 minutes TTL
    this.defaultTTL = defaultTTLSeconds * 1000;

    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  /**
   * Get a cached value
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set a cached value
   */
  set<T>(key: string, data: T, ttlSeconds?: number): void {
    const ttl = ttlSeconds ? ttlSeconds * 1000 : this.defaultTTL;
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  /**
   * Delete a cached value
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   */
  stats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Cache TTL values in seconds
export const CacheTTL = {
  PROFILE: 600, // 10 minutes
  STATS: 300, // 5 minutes
  CALENDAR: 300, // 5 minutes
  SUBMISSIONS: 120, // 2 minutes
  CONTEST: 600, // 10 minutes
  BADGES: 1800, // 30 minutes
  SKILLS: 600, // 10 minutes
  DAILY: 3600 // 1 hour
} as const;

// Export singleton instance
export const cache = new MemoryCache();

/**
 * Generate cache key for user-specific endpoints
 */
export const userCacheKey = (
  endpoint: string,
  username: string,
  extra?: string
): string => {
  return `${endpoint}:${username.toLowerCase()}${extra ? `:${extra}` : ''}`;
};
