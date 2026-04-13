/* eslint-disable test/no-conditional-expect */
/* eslint-disable test/no-conditional-in-test */
import {
  err,
  ok,
} from 'neverthrow'
import {
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import {
  nextTick,
  ref,
} from 'vue'

import { useQuery } from '@/composables/query/query.composable'
import { flushPromises } from '@/test/flushPromises'
import { runInSetup } from '@/test/runInSetup'
import type { ApiError } from '@/types/apiError.type'

interface TestUser {
  id: string
  name: string
}

describe('useQuery with AsyncResult', () => {
  it('should be defined', () => {
    expect(useQuery).toBeDefined()
  })

  it('result should start in loading state', () => {
    const query = runInSetup(() => {
      return useQuery<TestUser>({
        queryFn: async () => {
          // Never resolves during the test
          return await new Promise(() => {})
        },
        queryKey: {
          test: {},
        },
      })
    })

    expect(query.result.value.isLoading()).toBeTruthy()
    expect(query.result.value.isOk()).toBeFalsy()
    expect(query.result.value.isErr()).toBeFalsy()
  })

  it('result should transition to ok state on success', async () => {
    const user: TestUser = {
      id: '1',
      name: 'John',
    }

    const query = runInSetup(() => {
      return useQuery<TestUser>({
        queryFn: async () => await Promise.resolve(ok(user)),
        queryKey: {
          test: {},
        },
      })
    })

    // Wait for query to resolve
    await flushPromises()
    await nextTick()

    expect(query.result.value.isLoading()).toBeFalsy()
    expect(query.result.value.isOk()).toBeTruthy()
    expect(query.result.value.isErr()).toBeFalsy()

    // After narrowing, getValue() should work
    if (query.result.value.isOk()) {
      expect(query.result.value.getValue()).toEqual(user)
    }
  })

  it('result should transition to err state on failure', async () => {
    const apiError: ApiError = {
      name: 'TestError',
      errors: [],
      message: 'Internal Server Error',
    }

    const query = runInSetup(() => {
      return useQuery<TestUser>({
        queryFn: async () => await Promise.resolve(err(apiError)),
        queryKey: {
          test: {},
        },

      })
    })

    // Wait for query to resolve
    await flushPromises()
    await nextTick()

    expect(query.result.value.isLoading()).toBeFalsy()
    expect(query.result.value.isOk()).toBeFalsy()
    expect(query.result.value.isErr()).toBeTruthy()

    // After narrowing, getError() should work
    if (query.result.value.isErr()) {
      expect(query.result.value.getError()).toEqual(apiError)
    }
  })

  it('result.match() should work for all states', async () => {
    const user: TestUser = {
      id: '1',
      name: 'John',
    }

    const query = runInSetup(() => {
      return useQuery<TestUser>({
        queryFn: async () => await Promise.resolve(ok(user)),
        queryKey: {
          test: {},
        },

      })
    })

    // Before resolving - loading state
    const loadingMessage = query.result.value.match({
      err: () => 'error',
      loading: () => 'loading',
      ok: () => 'success',
    })

    expect(loadingMessage).toBe('loading')

    // Wait for query to resolve
    await flushPromises()
    await nextTick()

    // After resolving - ok state
    const successMessage = query.result.value.match({
      err: () => 'error',
      loading: () => 'loading',
      ok: (u) => `Hello, ${u.name}`,
    })

    expect(successMessage).toBe('Hello, John')
  })

  it('result.map() should transform success values reactively', async () => {
    const user: TestUser = {
      id: '1',
      name: 'John',
    }

    const query = runInSetup(() => {
      return useQuery<TestUser>({
        queryFn: async () => await Promise.resolve(ok(user)),
        queryKey: {
          test: {},
        },

      })
    })

    // Wait for query to resolve
    await flushPromises()
    await nextTick()

    const mapped = query.result.value.map((u) => u.name.toUpperCase())

    expect(mapped.isOk()).toBeTruthy()

    if (mapped.isOk()) {
      expect(mapped.getValue()).toBe('JOHN')
    }
  })

  it('result.unwrapOr() should provide default on loading', () => {
    const defaultUser: TestUser = {
      id: 'default',
      name: 'Guest',
    }

    const query = runInSetup(() => {
      return useQuery<TestUser>({
        queryFn: async () => {
          // Never resolves during this check
          return await new Promise(() => {})
        },
        queryKey: {
          test: {},
        },

      })
    })

    // Should return default while loading
    const user = query.result.value.unwrapOr(defaultUser)

    expect(user).toEqual(defaultUser)
  })

  it('result.unwrapOr(null) should return T | null', async () => {
    const user: TestUser = {
      id: '1',
      name: 'John',
    }

    const query = runInSetup(() => {
      return useQuery<TestUser>({
        queryFn: async () => await Promise.resolve(ok(user)),
        queryKey: {
          test: {},
        },

      })
    })

    // While loading, should return null
    const loadingValue = query.result.value.unwrapOr(null)

    expect(loadingValue).toBeNull()

    // Wait for query to resolve
    await flushPromises()
    await nextTick()

    // After resolving, should return the user
    const resolvedValue = query.result.value.unwrapOr(null)

    expect(resolvedValue).toEqual(user)
  })

  it('result should update reactively when refetch is called', async () => {
    let callCount = 0
    const users: TestUser[] = [
      {
        id: '1',
        name: 'John',
      },
      {
        id: '2',
        name: 'Jane',
      },
    ]

    const query = runInSetup(() => {
      return useQuery<TestUser>({
        queryFn: async () => {
          const user = users[callCount]

          callCount++

          return await Promise.resolve(ok(user))
        },
        queryKey: {
          test: {},
        },

      })
    })

    // Wait for initial query to resolve
    await flushPromises()
    await nextTick()

    expect(query.result.value.isOk()).toBeTruthy()

    if (query.result.value.isOk()) {
      expect(query.result.value.getValue().name).toBe('John')
    }

    // Refetch
    await query.refetch()
    await flushPromises()
    await nextTick()

    expect(query.result.value.isOk()).toBeTruthy()

    if (query.result.value.isOk()) {
      expect(query.result.value.getValue().name).toBe('Jane')
    }
  })

  it('result should respect isEnabled reactively', async () => {
    const isEnabled = ref<boolean>(false)
    const queryFn = vi.fn(async () => await Promise.resolve(ok({
      id: '1',
      name: 'John',
    })))

    const query = runInSetup(() => {
      return useQuery<TestUser>({
        isEnabled,
        queryFn,
        queryKey: {
          test: {},
        },

      })
    })

    // Wait a bit
    await flushPromises()
    await nextTick()

    // Should not have been called because isEnabled is false
    expect(queryFn).not.toHaveBeenCalled()
    expect(query.result.value.isLoading()).toBeTruthy()

    // Enable the query
    isEnabled.value = true
    await flushPromises()
    await nextTick()

    // Now it should have been called
    // eslint-disable-next-line test/prefer-called-with
    expect(queryFn).toHaveBeenCalled()
    expect(query.result.value.isOk()).toBeTruthy()
  })

  it('getResult() should return neverthrow Result after success', async () => {
    const user: TestUser = {
      id: '1',
      name: 'John',
    }

    const query = runInSetup(() => {
      return useQuery<TestUser>({
        queryFn: async () => await Promise.resolve(ok(user)),
        queryKey: {
          test: {},
        },

      })
    })

    // Wait for query to resolve
    await flushPromises()
    await nextTick()

    if (query.result.value.isOk()) {
      const result = query.result.value.getResult()

      expect(result.isOk()).toBeTruthy()

      if (result.isOk()) {
        expect(result.value).toEqual(user)
      }
    }
  })

  it('getResult() should return null during loading', () => {
    const query = runInSetup(() => {
      return useQuery<TestUser>({
        queryFn: async () => {
          return await new Promise(() => {})
        },
        queryKey: {
          test: {},
        },

      })
    })

    if (query.result.value.isLoading()) {
      expect(query.result.value.getResult()).toBeNull()
    }
  })

  it('result should reactively update from loading to success with slow API call', async () => {
    const user: TestUser = {
      id: '1',
      name: 'John',
    }

    const query = runInSetup(() => {
      return useQuery<TestUser>({
        queryFn: async () => {
          // Simulate a slow API call (100ms delay)
          await new Promise((resolve) => setTimeout(resolve, 100))

          return await Promise.resolve(ok(user))
        },
        queryKey: {
          test: {},
        },

      })
    })

    // Initially should be loading
    expect(query.result.value.isLoading()).toBeTruthy()
    expect(query.result.value.isOk()).toBeFalsy()
    expect(query.result.value.isErr()).toBeFalsy()

    // unwrapOr should return default during loading
    const loadingValue = query.result.value.unwrapOr(null)

    expect(loadingValue).toBeNull()

    // Wait for the slow API call to complete
    await new Promise((resolve) => setTimeout(resolve, 150))
    await flushPromises()
    await nextTick()

    // Now should be success
    expect(query.result.value.isLoading()).toBeFalsy()
    expect(query.result.value.isOk()).toBeTruthy()
    expect(query.result.value.isErr()).toBeFalsy()

    // After narrowing, getValue() should return the user
    if (query.result.value.isOk()) {
      expect(query.result.value.getValue()).toEqual(user)
    }

    // unwrapOr should now return the actual value
    const successValue = query.result.value.unwrapOr(null)

    expect(successValue).toEqual(user)
  })

  it('result should reactively update from loading to error with slow API call', async () => {
    const apiError: ApiError = {
      name: 'TestError',
      errors: [
        {
          code: 'SERVER_ERROR',
          detail: 'Something went wrong',
          status: '500',
        },
      ],
      message: 'Internal Server Error',
    }

    const query = runInSetup(() => {
      return useQuery<TestUser>({
        queryFn: async () => {
          // Simulate a slow API call that fails (100ms delay)
          await new Promise((resolve) => setTimeout(resolve, 100))

          return await Promise.resolve(err(apiError))
        },
        queryKey: {
          test: {},
        },

      })
    })

    // Initially should be loading
    expect(query.result.value.isLoading()).toBeTruthy()
    expect(query.result.value.isOk()).toBeFalsy()
    expect(query.result.value.isErr()).toBeFalsy()

    // unwrapOr should return default during loading
    const loadingValue = query.result.value.unwrapOr(null)

    expect(loadingValue).toBeNull()

    // Wait for the slow API call to complete
    await new Promise((resolve) => setTimeout(resolve, 150))
    await flushPromises()
    await nextTick()

    // Now should be error
    expect(query.result.value.isLoading()).toBeFalsy()
    expect(query.result.value.isOk()).toBeFalsy()
    expect(query.result.value.isErr()).toBeTruthy()

    // After narrowing, getError() should return the error
    if (query.result.value.isErr()) {
      expect(query.result.value.getError()).toEqual(apiError)
    }

    // unwrapOr should still return the default on error
    const errorValue = query.result.value.unwrapOr(null)

    expect(errorValue).toBeNull()
  })
})
