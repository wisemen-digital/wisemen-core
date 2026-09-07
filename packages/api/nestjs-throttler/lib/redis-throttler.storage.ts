import { Injectable } from '@nestjs/common'
import type { ThrottlerStorage } from '@nestjs/throttler'
import type { ThrottlerStorageRecord } from '@nestjs/throttler/dist/throttler-storage-record.interface.js'
import { RedisClient } from '@wisemen/nestjs-redis'
import { MILLIS_PER_SECOND } from './api-throttler.constant.js'

type EvalResult = [number, number, number, number]

@Injectable()
export class RedisThrottlerStorage implements ThrottlerStorage {
  private scriptHash?: string
  private scriptLoadPromise?: Promise<string>

  constructor (private readonly redis: RedisClient) {
  }

  async increment (
    key: string,
    ttl: number,
    limit: number,
    _blockDuration: number,
    throttlerName: string
  ): Promise<ThrottlerStorageRecord> {
    const scriptHash = await this.ensureScriptLoaded()
    const combinedKey = `${throttlerName}.${key}`

    try {
      return await this.calculateSlidingWindow(combinedKey, ttl, limit, scriptHash)
    } catch (error) {
      if (error instanceof Error && error.message.includes('NOSCRIPT')) {
        this.scriptHash = undefined
        this.scriptLoadPromise = undefined

        const newHash = await this.ensureScriptLoaded()
        return await this.calculateSlidingWindow(combinedKey, ttl, limit, newHash)
      }

      throw error
    }
  }

  private async ensureScriptLoaded (): Promise<string> {
    if (this.scriptHash != null) {
      return this.scriptHash
    }

    if (this.scriptLoadPromise == null) {
      this.scriptLoadPromise = this.redis.client.scriptLoad(this.getScriptSource())
    }

    this.scriptHash = await this.scriptLoadPromise

    return this.scriptHash
  }

  private async calculateSlidingWindow (
    key: string,
    ttl: number,
    limit: number,
    hash: string
  ): Promise<ThrottlerStorageRecord> {
    const now = Date.now()

    const currentKey = `${key}:current`
    const previousKey = `${key}:previous`

    const [currentHits, previousHits, currentWindowStart, window]
      = (await this.redis.client.evalSha(hash, {
        keys: [currentKey, previousKey],
        arguments: [ttl.toString(), now.toString()]
      })) as EvalResult

    const timePassed = now - currentWindowStart
    const weight = (window - timePassed) / window

    const totalHits = previousHits * weight + currentHits
    const isBlocked = totalHits > limit

    const timeToExpire = window - timePassed
    const timeToBlockExpire = isBlocked ? timeToExpire : 0

    return {
      totalHits,
      timeToExpire: Math.ceil(timeToExpire / MILLIS_PER_SECOND),
      isBlocked,
      timeToBlockExpire: Math.ceil(timeToBlockExpire / MILLIS_PER_SECOND)
    }
  }

  private getScriptSource (): string {
    return `
    -- KEYS[1] = main hash
    -- ARGV[1] = window (ms)
    -- ARGV[2] = now (ms)

    local key = KEYS[1]
    local window = tonumber(ARGV[1])
    local now = tonumber(ARGV[2])

    local data = redis.call("HGETALL", key)

    local hits = 0
    local prev_hits = 0
    local start = 0

    for i = 1, #data, 2 do
      local field = data[i]
      local value = tonumber(data[i+1])
      if field == "hits" then hits = value end
      if field == "prev_hits" then prev_hits = value end
      if field == "start" then start = value end
    end

    local window_start = now - (now % window)

    if start ~= window_start then
      -- window rollover
      prev_hits = hits
      hits = 1
      start = window_start
    else
      hits = hits + 1
    end

    redis.call("HMSET", key,
      "hits", hits,
      "prev_hits", prev_hits,
      "start", start
    )

    redis.call("PEXPIRE", key, window * 2)

    return {hits, prev_hits, start, window}
  `
  }
}
