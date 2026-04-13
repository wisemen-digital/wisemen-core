import type { RedisClientOptions } from 'redis'

/**
 * Options for configuring the Redis module.
 */
export interface RedisModuleOptions extends RedisClientOptions {
  /** The Redis connection URL (e.g. `redis://localhost:6379`). */
  url: string
  /** Optional callback invoked when the Redis client encounters an error. */
  onClientError?: (error: unknown) => void
  /** Optional default time-to-live (in seconds) for cached entries. */
  ttl?: number
}
