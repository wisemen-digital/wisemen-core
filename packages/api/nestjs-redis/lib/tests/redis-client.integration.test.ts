import { randomUUID } from 'node:crypto'
import { after, before, describe, it } from 'node:test'
import { expect } from 'expect'
import { RedisClient } from '../redis.client.js'

describe('RedisClient', () => {
  const redisClient = new RedisClient({ url: process.env.REDIS_URL ?? 'redis://localhost:6379' })

  before(async () => {
    await redisClient.onModuleInit()
  })

  after(async () => {
    await redisClient.onModuleDestroy()
  })

  function uniqueKey (name: string): string {
    return `${name}.${randomUUID()}`
  }

  describe('getCachedValue / getCachedValues', () => {
    it('returns null for a value that was never cached', async () => {
      const value = await redisClient.getCachedValue(uniqueKey('missing'))

      expect(value).toBeNull()
    })

    it('retrieves multiple cached values', async () => {
      const keys = [uniqueKey('multi-1'), uniqueKey('multi-2'), uniqueKey('multi-3')]
      const values = [1, 2, 3]

      await redisClient.putCachedValues(keys, values)

      const result = await redisClient.getCachedValues<number>(keys)

      expect(result).toEqual(values)
    })

    it('returns null entries for keys that were never cached', async () => {
      const keys = [uniqueKey('mixed-1'), uniqueKey('mixed-2')]

      await redisClient.putCachedValue(keys[0], 'cached')

      const result = await redisClient.getCachedValues<string>(keys)

      expect(result).toEqual(['cached', null])
    })

    it('returns an empty array and reports no error when called with 0 keys', async () => {
      const errors: unknown[] = []
      const spiedClient = new RedisClient({
        url: process.env.REDIS_URL ?? 'redis://localhost:6379',
        onClientError: (error) => errors.push(error)
      })

      await spiedClient.onModuleInit()

      try {
        const result = await spiedClient.getCachedValues([])

        expect(result).toEqual([])
        expect(errors).toEqual([])
      } finally {
        await spiedClient.onModuleDestroy()
      }
    })
  })

  describe('putCachedValue / putCachedValues', () => {
    it('stores and retrieves a single cached value', async () => {
      const key = uniqueKey('single')

      await redisClient.putCachedValue(key, { name: 'Alice' })

      const value = await redisClient.getCachedValue<{ name: string }>(key)

      expect(value).toEqual({ name: 'Alice' })
    })

    it('overwrites an existing cached value', async () => {
      const key = uniqueKey('overwrite')

      await redisClient.putCachedValue(key, 'first')
      await redisClient.putCachedValue(key, 'second')

      const value = await redisClient.getCachedValue<string>(key)

      expect(value).toBe('second')
    })

    it('stores multiple cached values', async () => {
      const keys = [uniqueKey('put-multi-1'), uniqueKey('put-multi-2')]
      const values = ['a', 'b']

      await redisClient.putCachedValues(keys, values)

      const result = await redisClient.getCachedValues<string>(keys)

      expect(result).toEqual(values)
    })

    it('does not throw and performs no writes when called with 0 keys', async () => {
      await expect(redisClient.putCachedValues([], [])).resolves.toBeUndefined()
    })
  })

  describe('deleteCachedValue / deleteCachedValues', () => {
    it('deletes a single cached value', async () => {
      const key = uniqueKey('delete-single')

      await redisClient.putCachedValue(key, 'value')
      await redisClient.deleteCachedValue(key)

      const value = await redisClient.getCachedValue(key)

      expect(value).toBeNull()
    })

    it('deletes multiple cached values', async () => {
      const keys = [uniqueKey('delete-multi-1'), uniqueKey('delete-multi-2')]

      await redisClient.putCachedValues(keys, ['a', 'b'])
      await redisClient.deleteCachedValues(keys)

      const result = await redisClient.getCachedValues(keys)

      expect(result).toEqual([null, null])
    })
  })

  describe('setLock / releaseLock', () => {
    it('acquires a lock and prevents a second acquisition until it is released', async () => {
      const key = uniqueKey('lock')

      const first = await redisClient.setLock(key, 10)
      expect(first.success).toBe(true)
      expect(first.token).not.toBeNull()

      const second = await redisClient.setLock(key, 10)
      expect(second.success).toBe(false)
      expect(second.token).toBeNull()

      await redisClient.releaseLock(key, first.token!)

      const third = await redisClient.setLock(key, 10)
      expect(third.success).toBe(true)
    })

    it('does not release a lock when given the wrong token', async () => {
      const key = uniqueKey('lock-wrong-token')

      await redisClient.setLock(key, 10)

      const released = await redisClient.releaseLock(key, randomUUID())

      expect(released).toBe(false)
    })
  })
})
