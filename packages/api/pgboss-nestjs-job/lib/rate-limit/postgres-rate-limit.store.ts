import { Injectable } from '@nestjs/common'
import { EntityManager } from 'typeorm'
import { InjectEntityManager } from '@wisemen/nestjs-typeorm'
import { RateLimitBucketRow } from './rate-limit.strategy.js'
import { RateLimitStore } from './rate-limit.store.js'

// Field names mirror the raw Postgres column names returned by the query below.
/* eslint-disable @typescript-eslint/naming-convention */
interface RawRow {
  key: string
  tokens: number | null
  window_start_at: Date | null
  reset_at: Date | null
  blocked_until: Date | null
}
/* eslint-enable @typescript-eslint/naming-convention */

@Injectable()
export class PostgresRateLimitStore extends RateLimitStore {
  constructor (
    @InjectEntityManager() private readonly manager: EntityManager
  ) {
    super()
  }

  async ensureSchema (): Promise<void> {
    await this.manager.query(`
      CREATE TABLE IF NOT EXISTS pgboss.rate_limit (
        key text PRIMARY KEY,
        tokens integer,
        window_start_at timestamptz,
        reset_at timestamptz,
        blocked_until timestamptz,
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `)
  }

  async getMany (keys: string[]): Promise<RateLimitBucketRow[]> {
    if (keys.length === 0) {
      return []
    }

    const rows = await this.manager.query<RawRow[]>(
      `SELECT key, tokens, window_start_at, reset_at, blocked_until
       FROM pgboss.rate_limit WHERE key = ANY($1)`,
      [keys]
    )

    return rows.map(r => ({
      key: r.key,
      tokens: r.tokens,
      windowStartAt: r.window_start_at,
      resetAt: r.reset_at,
      blockedUntil: r.blocked_until
    }))
  }

  async tryConsumeToken (key: string, limit: number, windowSeconds: number): Promise<boolean> {
    // Upsert-then-atomically-decrement in one statement. The window resets to a
    // full budget when window_start_at is null or older than windowSeconds;
    // otherwise the counter is ALWAYS decremented (it may drift negative under
    // contention — that is fine, it self-heals at the next window). The call is
    // granted iff the resulting count is >= 0: the last token lands on exactly 0
    // (granted), an over-budget call lands on -1 (denied). This unambiguous
    // grant test is why we do not clamp at 0.
    const rows = await this.manager.query<Array<{ tokens: number }>>(
      `
      INSERT INTO pgboss.rate_limit (key, tokens, window_start_at, updated_at)
      VALUES ($1, $2 - 1, now(), now())
      ON CONFLICT (key) DO UPDATE SET
        window_start_at = CASE
          WHEN pgboss.rate_limit.window_start_at IS NULL
            OR pgboss.rate_limit.window_start_at < now() - ($3 || ' seconds')::interval
          THEN now() ELSE pgboss.rate_limit.window_start_at END,
        tokens = CASE
          WHEN pgboss.rate_limit.window_start_at IS NULL
            OR pgboss.rate_limit.window_start_at < now() - ($3 || ' seconds')::interval
          THEN $2 - 1
          ELSE pgboss.rate_limit.tokens - 1 END,
        updated_at = now()
      RETURNING tokens
      `,
      [key, limit, String(windowSeconds)]
    )

    return rows.length > 0 && rows[0].tokens >= 0
  }

  async setBlockedUntil (key: string, until: Date): Promise<void> {
    await this.manager.query(
      `INSERT INTO pgboss.rate_limit (key, blocked_until, updated_at)
       VALUES ($1, $2, now())
       ON CONFLICT (key) DO UPDATE SET blocked_until = $2, updated_at = now()`,
      [key, until]
    )
  }

  async setHeaderState (key: string, remaining: number, resetAt: Date | null): Promise<void> {
    await this.manager.query(
      `INSERT INTO pgboss.rate_limit (key, tokens, reset_at, updated_at)
       VALUES ($1, $2, $3, now())
       ON CONFLICT (key) DO UPDATE SET tokens = $2, reset_at = $3, updated_at = now()`,
      [key, remaining, resetAt]
    )
  }
}
