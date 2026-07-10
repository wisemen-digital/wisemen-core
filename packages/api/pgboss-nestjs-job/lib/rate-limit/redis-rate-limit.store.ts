import { Injectable, Logger } from '@nestjs/common'
import { RedisClient } from '@wisemen/nestjs-redis'

/** The API-reported budget mirrored from response headers (header mode). */
export interface HeaderState {
  remaining: number
  resetAt: Date | null
}

/**
 * Fallback TTL for mirrored header state when the reset time is unknown, so an
 * exhausted-without-reset response can't wedge the queue forever: the state
 * expires, the queue re-probes, and the fresh response updates it.
 */
const HEADER_STATE_FALLBACK_TTL_SECONDS = 60
/** Small margin added past a known reset so state outlives the block it drives. */
const HEADER_STATE_TTL_BUFFER_SECONDS = 5

/**
 * Redis-backed rate-limit state, keyed by queue name. Every operation is
 * **fail-soft**: when Redis is unconfigured, not yet connected, or errors, reads
 * return an "allow" fallback and writes are dropped, so a Redis hiccup never
 * wedges a queue (rate limiting fails open).
 */
@Injectable()
export class RedisRateLimitStore {
  private readonly logger = new Logger(RedisRateLimitStore.name)

  constructor (private readonly redis: RedisClient) {}

  private countKey (key: string): string {
    return `ratelimit:${key}:count`
  }

  private headerKey (key: string): string {
    return `ratelimit:${key}:header`
  }

  private blockedKey (key: string): string {
    return `ratelimit:${key}:blocked`
  }

  private async withClient<T> (
    action: (client: RedisClient['client']) => Promise<T>,
    fallback: T
  ): Promise<T> {
    try {
      const client = this.redis.client

      if (!client.isReady) {
        return fallback
      }

      return await action(client)
    } catch (error) {
      this.logger.warn(`Redis rate-limit op failed; failing open: ${(error as Error).message}`)

      return fallback
    }
  }

  /**
   * Fixed-window increment: `INCR` the counter and arm its TTL only on the first
   * increment of a window. Both run in one `MULTI` with `EXPIRE ... NX`, so a
   * crash can never leave a TTL-less counter that would block the queue forever.
   * Returns the new count, or `null` when Redis is unavailable.
   */
  async incrementWindow (key: string, windowSeconds: number): Promise<number | null> {
    return this.withClient(async (client) => {
      const replies = await client.multi()
        .incr(this.countKey(key))
        .expire(this.countKey(key), windowSeconds, 'NX')
        .exec()

      const count = Number(replies?.[0])

      return Number.isFinite(count) ? count : null
    }, null)
  }

  /** Current window count (0 when unset or Redis unavailable). */
  async getCount (key: string): Promise<number> {
    return this.withClient(async (client) => {
      const raw = await client.get(this.countKey(key))
      const count = Number(raw)

      return Number.isFinite(count) ? count : 0
    }, 0)
  }

  async setHeaderState (key: string, remaining: number, resetAt: Date | null): Promise<void> {
    await this.withClient(async (client) => {
      // Always carry a TTL: a `remaining: 0` with no reset would otherwise block
      // the queue forever (it stops fetching, so no later response ever clears
      // the state). The TTL bounds that — the state self-heals and the queue
      // re-probes.
      await client.multi()
        .hSet(this.headerKey(key), {
          remaining: String(remaining),
          resetAt: resetAt != null ? String(resetAt.getTime()) : ''
        })
        .expire(this.headerKey(key), this.headerStateTtlSeconds(resetAt))
        .exec()
    }, undefined)
  }

  private headerStateTtlSeconds (resetAt: Date | null): number {
    if (resetAt == null) {
      return HEADER_STATE_FALLBACK_TTL_SECONDS
    }

    const seconds = Math.ceil((resetAt.getTime() - Date.now()) / 1000)

    return seconds > 0 ? seconds + HEADER_STATE_TTL_BUFFER_SECONDS : HEADER_STATE_FALLBACK_TTL_SECONDS
  }

  /** API-reported budget, or `null` when unknown / Redis unavailable. */
  async getHeaderState (key: string): Promise<HeaderState | null> {
    return this.withClient(async (client) => {
      const data = await client.hGetAll(this.headerKey(key))

      if (data == null || data.remaining === undefined) {
        return null
      }

      const remaining = Number(data.remaining)
      const resetMs = data.resetAt !== undefined && data.resetAt !== ''
        ? Number(data.resetAt)
        : null

      return {
        remaining: Number.isFinite(remaining) ? remaining : 0,
        resetAt: resetMs != null && Number.isFinite(resetMs) ? new Date(resetMs) : null
      }
    }, null)
  }

  /**
   * Block the key until `until`. Stored with a matching TTL so the cooldown
   * self-clears even if nothing reads it again.
   */
  async setBlockedUntil (key: string, until: Date): Promise<void> {
    await this.withClient(async (client) => {
      const seconds = Math.ceil((until.getTime() - Date.now()) / 1000)

      if (seconds <= 0) {
        return
      }

      await client.set(this.blockedKey(key), String(until.getTime()), { EX: seconds })
    }, undefined)
  }

  /** The instant this key is blocked until, or `null` when not blocked / unavailable. */
  async getBlockedUntil (key: string): Promise<Date | null> {
    return this.withClient(async (client) => {
      const raw = await client.get(this.blockedKey(key))

      if (raw == null) {
        return null
      }

      const ms = Number(raw)

      return Number.isFinite(ms) ? new Date(ms) : null
    }, null)
  }
}
