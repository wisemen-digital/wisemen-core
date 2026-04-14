import assert from 'assert'
import { Inject, Injectable, Logger, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common'
import type { RedisClientType } from 'redis'
import { createClient } from 'redis'
import { RedisUnavailableError } from './redis-unavailable.error.js'
import { REDIS_PING_INTERVAL, REDIS_DEFAULT_TTL } from './redis.constant.js'
import { MODULE_OPTIONS_TOKEN } from './redis.module-definitions.js'
import type { RedisModuleOptions } from './redis.module-options.js'

@Injectable()
export class RedisClient implements OnModuleInit, OnModuleDestroy {
  private _client?: RedisClientType
  readonly ttl: number

  constructor (
    @Inject(MODULE_OPTIONS_TOKEN) private readonly config: RedisModuleOptions
  ) {
    this.ttl = config.ttl ?? REDIS_DEFAULT_TTL
  }

  private handleError (error: unknown): void {
    if (this.config.onClientError != null) {
      this.config.onClientError(error)
    } else {
      Logger.error(error)
    }
  }

  public get client (): RedisClientType {
    if (this._client == null) {
      throw new RedisUnavailableError('The Redis client is not configured')
    } else {
      return this._client
    }
  }

  async onModuleInit (): Promise<void> {
    try {
      this._client = createClient({
        url: this.config.url,
        pingInterval: this.config.pingInterval ?? REDIS_PING_INTERVAL,
        disableOfflineQueue: true
      })
    } catch (error) {
      this.handleError(error)

      return
    }

    this._client.on('error', (error) => {
      this.handleError(error)
    })

    await this._client.connect().catch((error) => {
      this.handleError(error)
    })
  }

  async onModuleDestroy (): Promise<void> {
    if (this._client !== undefined) {
      await this._client.close()
    }
  }

  async getCachedValue<T> (key: string): Promise<T | null> {
    const value = await this.performAndCatch(() => this.client.get(key))

    if (value != null) {
      return JSON.parse(value) as T
    }

    return null
  }

  async getCachedValues<T> (keys: string[]): Promise<Array<T | null>> {
    const results = await this.performAndCatch(() => this.client.mGet(keys))

    return results?.map(value => (value != null ? JSON.parse(value) as T : null))
      ?? new Array<T | null>(keys.length).fill(null)
  }

  async putCachedValue<T> (key: string, value: T, ttl = this.ttl): Promise<void> {
    await this.perform(() => this.client.set(key, JSON.stringify(value), { EX: ttl }))
  }

  async putCachedValues<T> (keys: string[], values: T[], ttl = this.ttl): Promise<void> {
    assert(keys.length === values.length, `putCachedValues expects 'keys' and 'values' to have the same length, but received keys.length=${keys.length}, values.length=${values.length}`)

    await this.perform(() => {
      const args = keys.flatMap((key, index) => [key, JSON.stringify(values[index])])

      const pipeline = this.client.multi()

      pipeline.mSet(args)
      keys.forEach(key => pipeline.expire(key, ttl))

      return pipeline.exec()
    })
  }

  async deleteCachedValue (key: string): Promise<void> {
    await this.perform(() => this.client.del(key))
  }

  async deleteCachedValues (keys: string[]): Promise<void> {
    await this.perform(() => this.client.del(keys))
  }

  private async perform<T>(action: () => Promise<T>): Promise<T | null> {
    if (!this.client.isReady) {
      return null
    }

    return await action()
  }

  private async performAndCatch<T>(action: () => Promise<T>): Promise<T | null> {
    if (!this.client.isReady) {
      return null
    }

    try {
      return await action()
    } catch (error) {
      this.handleError(error)

      return null
    }
  }
}
