import { Injectable, Logger } from '@nestjs/common'
import { RedisClient } from '@wisemen/nestjs-redis'

/** The API-reported budget mirrored from response headers (header mode). */
export interface HeaderState {
  remaining: number
  resetAt: Date | null
}

/** Fallback TTL when the reset time is unknown, so exhausted-without-reset can't wedge the queue. */
const HEADER_STATE_FALLBACK_TTL_SECONDS = 60
/** Small margin added past a known reset so state outlives the block it drives. */
const HEADER_STATE_TTL_BUFFER_SECONDS = 5

/**
 * Redis-backed rate-limit state, keyed by queue name. Every op is fail-soft: if Redis is
 * unavailable, reads return an "allow" fallback and writes are dropped. Bouncers that
 * must not run unprotected check {@link isAvailable} first.
 */
@Injectable()
export class RedisRateLimitStore {
  private readonly logger = new Logger(RedisRateLimitStore.name)

  constructor (private readonly redis: RedisClient) {}

  /** Whether Redis can answer right now; `.client` throws when it was never initialised. */
  isAvailable (): boolean {
    try {
      return this.redis.client.isReady
    } catch {
      return false
    }
  }

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
      this.logger.warn(`Redis rate-limit op failed; falling back to allow: ${(error as Error).message}`)

      return fallback
    }
  }

  /**
   * Fixed-window `INCR`, arming the TTL only on the window's first increment. One `MULTI`
   * with `EXPIRE NX`, so a crash cannot leave a TTL-less counter. `null` if unavailable.
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
      // Always carry a TTL: `remaining: 0` with no reset would otherwise wedge the
      // queue forever, since it stops fetching and no later response can clear it.
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

  /** Block the key until `until`, with a matching TTL so the cooldown self-clears. */
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
