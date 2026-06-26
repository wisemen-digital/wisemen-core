import { beforeEach, describe, it } from 'node:test'
import { expect } from 'expect'

import { createInterceptors } from '../interceptors.js'

describe('Interceptors', () => {
  let interceptors: ReturnType<typeof createInterceptors<Request, Response, unknown, unknown>>

  beforeEach(() => {
    interceptors = createInterceptors()
  })

  describe('use', () => {
    it('adds a function and returns its index', () => {
      const fn = () => {}
      const id = interceptors.request.use(fn as any)
      expect(id).toBe(0)
    })

    it('increments id for each added function', () => {
      const fn1 = () => {}
      const fn2 = () => {}
      expect(interceptors.request.use(fn1 as any)).toBe(0)
      expect(interceptors.request.use(fn2 as any)).toBe(1)
    })
  })

  describe('exists', () => {
    it('returns true for an active interceptor by id', () => {
      const fn = () => {}
      const id = interceptors.request.use(fn as any)
      expect(interceptors.request.exists(id)).toBe(true)
    })

    it('returns true for an active interceptor by reference', () => {
      const fn = () => {}
      interceptors.request.use(fn as any)
      expect(interceptors.request.exists(fn as any)).toBe(true)
    })

    it('returns false for an unknown id', () => {
      expect(interceptors.request.exists(99)).toBe(false)
    })

    it('returns false after ejecting by id', () => {
      const fn = () => {}
      const id = interceptors.request.use(fn as any)
      interceptors.request.eject(id)
      expect(interceptors.request.exists(id)).toBe(false)
    })

    it('returns false after ejecting by reference', () => {
      const fn = () => {}
      interceptors.request.use(fn as any)
      interceptors.request.eject(fn as any)
      expect(interceptors.request.exists(fn as any)).toBe(false)
    })
  })

  describe('eject', () => {
    it('nulls the slot so other interceptors keep their indices', () => {
      const fn1 = () => {}
      const fn2 = () => {}
      interceptors.request.use(fn1 as any)
      const id2 = interceptors.request.use(fn2 as any)
      interceptors.request.eject(0)
      expect(interceptors.request.fns[0]).toBeNull()
      expect(interceptors.request.fns[id2]).toBe(fn2)
    })

    it('is a no-op for an unknown id', () => {
      interceptors.request.eject(99)
      expect(interceptors.request.fns).toHaveLength(0)
    })
  })

  describe('update', () => {
    it('replaces the function at the given id', () => {
      const fn1 = () => {}
      const fn2 = () => {}
      const id = interceptors.request.use(fn1 as any)
      interceptors.request.update(id, fn2 as any)
      expect(interceptors.request.fns[id]).toBe(fn2)
    })

    it('replaces the function by reference', () => {
      const fn1 = () => {}
      const fn2 = () => {}
      interceptors.request.use(fn1 as any)
      interceptors.request.update(fn1 as any, fn2 as any)
      expect(interceptors.request.fns[0]).toBe(fn2)
    })

    it('returns the id when successful', () => {
      const fn1 = () => {}
      const fn2 = () => {}
      const id = interceptors.request.use(fn1 as any)
      expect(interceptors.request.update(id, fn2 as any)).toBe(id)
    })

    it('returns false when id does not exist', () => {
      const fn = () => {}
      expect(interceptors.request.update(99, fn as any)).toBe(false)
    })
  })

  describe('clear', () => {
    it('removes all interceptors', () => {
      interceptors.request.use((() => {}) as any)
      interceptors.request.use((() => {}) as any)
      interceptors.request.clear()
      expect(interceptors.request.fns).toHaveLength(0)
    })
  })

  describe('createInterceptors', () => {
    it('creates separate request, response, and error slots', () => {
      expect(interceptors.request).toBeDefined()
      expect(interceptors.response).toBeDefined()
      expect(interceptors.error).toBeDefined()
    })

    it('starts with empty fn arrays', () => {
      expect(interceptors.request.fns).toHaveLength(0)
      expect(interceptors.response.fns).toHaveLength(0)
      expect(interceptors.error.fns).toHaveLength(0)
    })
  })
})
