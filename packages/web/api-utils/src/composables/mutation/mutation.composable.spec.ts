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
} from 'vitest'

import { useMutation } from '@/composables/mutation/mutation.composable'
import { flushPromises } from '@/test/flushPromises'
import { runInSetup } from '@/test/runInSetup'
import type { ApiError } from '@/types/apiError.type'

describe('useMutation', () => {
  it('should be defined', () => {
    expect(useMutation).toBeDefined()
  })

  it('should return ApiResult from execute', async () => {
    interface RequestBody {
      name: string
    }

    interface RequestParams {
      id: string
    }

    const mutation = runInSetup(() => {
      return useMutation<RequestBody, string, RequestParams>({
        queryFn: ({
          body, params,
        }) => {
          expect(body).toBeDefined()
          expect(params).toBeDefined()

          return Promise.resolve(ok('test-response'))
        },
        queryKeysToInvalidate: {},
      })
    })

    await flushPromises()

    const result = await mutation.execute({
      body: {
        name: 'test-name',
      },
      params: {
        id: 'test-id',
      },
    })

    expect(result.isOk()).toBeTruthy()

    if (result.isOk()) {
      expect(result._unsafeUnwrap()).toBe('test-response')
    }
  })

  it('should work without body or params when queryFn does not require them', async () => {
    const mutation = runInSetup(() => {
      return useMutation({
        queryFn: () => {
          return Promise.resolve(ok('test-response-no-params'))
        },
        queryKeysToInvalidate: {},
      })
    })

    await flushPromises()

    const result = await mutation.execute()

    expect(result.isOk()).toBeTruthy()

    if (result.isOk()) {
      expect(result._unsafeUnwrap()).toBe('test-response-no-params')
    }
  })

  it('should transition result to ok state on success', async () => {
    const mutation = runInSetup(() => {
      return useMutation<void, string, void>({
        queryFn: () => Promise.resolve(ok('success-data')),
        queryKeysToInvalidate: {},
      })
    })

    // Before execution, should start in loading state
    expect(mutation.result.value.isLoading()).toBeTruthy()
    expect(mutation.result.value.isOk()).toBeFalsy()
    expect(mutation.result.value.isErr()).toBeFalsy()

    await flushPromises()

    // After execution, should be in ok state
    await mutation.execute()
    await flushPromises()

    expect(mutation.result.value.isLoading()).toBeFalsy()
    expect(mutation.result.value.isOk()).toBeTruthy()
    expect(mutation.result.value.isErr()).toBeFalsy()

    if (mutation.result.value.isOk()) {
      expect(mutation.result.value.getValue()).toBe('success-data')
    }
  })

  it('should transition result to err state on failure', async () => {
    const apiError: ApiError = {
      name: 'TestError',
      errors: [],
      message: 'Internal Server Error',
    }

    const mutation = runInSetup(() => {
      return useMutation<void, string, void>({
        queryFn: () => Promise.resolve(err(apiError)),
        queryKeysToInvalidate: {},
      })
    })

    // Before execution, should start in loading state
    expect(mutation.result.value.isLoading()).toBeTruthy()

    await flushPromises()

    // After execution, should be in err state
    await mutation.execute()

    await flushPromises()

    expect(mutation.result.value.isLoading()).toBeFalsy()
    expect(mutation.result.value.isOk()).toBeFalsy()
    expect(mutation.result.value.isErr()).toBeTruthy()

    if (mutation.result.value.isErr()) {
      expect(mutation.result.value.getError()).toEqual(apiError)
    }
  })

  it('should use match() to handle different result states', async () => {
    const mutation = runInSetup(() => {
      return useMutation<void, string, void>({
        queryFn: () => Promise.resolve(ok('matched-data')),
        queryKeysToInvalidate: {},
      })
    })

    // Before execution
    let message = mutation.result.value.match({
      err: () => 'is error',
      loading: () => 'is loading',
      ok: () => 'is ok',
    })

    expect(message).toBe('is loading')

    await flushPromises()

    // After execution
    await mutation.execute()
    await flushPromises()

    message = mutation.result.value.match({
      err: () => 'is error',
      loading: () => 'is loading',
      ok: (data) => `got ${data}`,
    })

    expect(message).toBe('got matched-data')
  })

  it('should provide data property with unwrapped value on success', async () => {
    const mutation = runInSetup(() => {
      return useMutation<void, string, void>({
        queryFn: () => Promise.resolve(ok('unwrapped-data')),
        queryKeysToInvalidate: {},
      })
    })

    // Before execution
    expect(mutation.data.value).toBeNull()

    await flushPromises()

    // After execution
    await mutation.execute()
    await flushPromises()

    expect(mutation.data.value).toBe('unwrapped-data')
  })

  it('should provide null data property on error', async () => {
    const apiError: ApiError = {
      name: 'TestError',
      errors: [],
      message: 'Internal Server Error',
    }

    const mutation = runInSetup(() => {
      return useMutation<void, string, void>({
        queryFn: () => Promise.resolve(err(apiError)),
        queryKeysToInvalidate: {},
      })
    })

    await flushPromises()
    await mutation.execute()
    await flushPromises()

    expect(mutation.data.value).toBeNull()
  })

  describe('useMutation with void return type', () => {
    it('should handle void response on success', async () => {
      const mutation = runInSetup(() => {
        return useMutation<void, void, void>({
          queryFn: () => Promise.resolve(ok(void 0)),
          queryKeysToInvalidate: {},
        })
      })

      await flushPromises()

      const result = await mutation.execute()

      expect(result.isOk()).toBeTruthy()
      expect(result._unsafeUnwrap()).toBeUndefined()
    })

    it('should transition result to ok state on void success', async () => {
      const mutation = runInSetup(() => {
        return useMutation<void, void, void>({
          queryFn: () => Promise.resolve(ok(void 0)),
          queryKeysToInvalidate: {},
        })
      })

      // Before execution, should start in loading state
      expect(mutation.result.value.isLoading()).toBeTruthy()
      expect(mutation.result.value.isOk()).toBeFalsy()
      expect(mutation.result.value.isErr()).toBeFalsy()

      await flushPromises()

      // After execution, should be in ok state
      await mutation.execute()
      await flushPromises()

      expect(mutation.result.value.isLoading()).toBeFalsy()
      expect(mutation.result.value.isOk()).toBeTruthy()
      expect(mutation.result.value.isErr()).toBeFalsy()

      if (mutation.result.value.isOk()) {
        expect(mutation.result.value.getValue()).toBeUndefined()
      }
    })

    it('should use match() to handle void result states', async () => {
      const mutation = runInSetup(() => {
        return useMutation<void, void, void>({
          queryFn: () => Promise.resolve(ok(void 0)),
          queryKeysToInvalidate: {},
        })
      })

      // Before execution
      let message = mutation.result.value.match({
        err: () => 'is error',
        loading: () => 'is loading',
        ok: () => 'is ok',
      })

      expect(message).toBe('is loading')

      await flushPromises()

      // After execution
      await mutation.execute()
      await flushPromises()

      message = mutation.result.value.match({
        err: () => 'is error',
        loading: () => 'is loading',
        ok: (data) => {
          expect(data).toBeUndefined()

          return 'success-with-void'
        },
      })

      expect(message).toBe('success-with-void')
    })

    it('should provide null data property with void response on success', async () => {
      const mutation = runInSetup(() => {
        return useMutation<void, void, void>({
          queryFn: () => Promise.resolve(ok(void 0)),
          queryKeysToInvalidate: {},
        })
      })

      // Before execution
      expect(mutation.data.value).toBeNull()

      await flushPromises()

      // After execution
      await mutation.execute()
      await flushPromises()

      // With void return type, data should be undefined or null
      expect(mutation.data.value === null || mutation.data.value === undefined).toBeTruthy()
    })

    it('should handle void response with request body on success', async () => {
      interface RequestBody {
        message: string
      }

      const mutation = runInSetup(() => {
        return useMutation<RequestBody, void, void>({
          queryFn: ({
            body,
          }) => {
            expect(body).toBeDefined()
            expect(body.message).toBe('test-message')

            return Promise.resolve(ok(void 0))
          },
          queryKeysToInvalidate: {},
        })
      })

      await flushPromises()

      const result = await mutation.execute({
        body: {
          message: 'test-message',
        },
      })

      expect(result.isOk()).toBeTruthy()
      expect(result._unsafeUnwrap()).toBeUndefined()
    })

    it('should handle void response with params on success', async () => {
      interface RequestParams {
        id: string
      }

      const mutation = runInSetup(() => {
        return useMutation<void, void, RequestParams>({
          queryFn: ({
            params,
          }) => {
            expect(params).toBeDefined()
            expect(params.id).toBe('test-id')

            return Promise.resolve(ok(void 0))
          },
          queryKeysToInvalidate: {},
        })
      })

      await flushPromises()

      const result = await mutation.execute({
        params: {
          id: 'test-id',
        },
      })

      expect(result.isOk()).toBeTruthy()
      expect(result._unsafeUnwrap()).toBeUndefined()
    })

    it('should handle void response with body and params on success', async () => {
      interface RequestBody {
        message: string
      }

      interface RequestParams {
        id: string
      }

      const mutation = runInSetup(() => {
        return useMutation<RequestBody, void, RequestParams>({
          queryFn: ({
            body, params,
          }) => {
            expect(body).toBeDefined()
            expect(params).toBeDefined()
            expect(body.message).toBe('test-message')
            expect(params.id).toBe('test-id')

            return Promise.resolve(ok(void 0))
          },
          queryKeysToInvalidate: {},
        })
      })

      await flushPromises()

      const result = await mutation.execute({
        body: {
          message: 'test-message',
        },
        params: {
          id: 'test-id',
        },
      })

      expect(result.isOk()).toBeTruthy()
      expect(result._unsafeUnwrap()).toBeUndefined()
    })

    it('should handle error with void return type', async () => {
      const apiError: ApiError = {
        name: 'TestError',
        errors: [],
        message: 'This is a test error',
      }

      const mutation = runInSetup(() => {
        return useMutation<void, void, void>({
          queryFn: () => Promise.resolve(err(apiError)),
          queryKeysToInvalidate: {},
        })
      })

      await flushPromises()

      const result = await mutation.execute()

      expect(result.isErr()).toBeTruthy()
      expect(result._unsafeUnwrapErr()).toEqual(apiError)
    })

    it('should transition result to err state with void return type on failure', async () => {
      const apiError: ApiError = {
        name: 'TestError',
        errors: [],
        message: 'This is a test error',
      }

      const mutation = runInSetup(() => {
        return useMutation<void, void, void>({
          queryFn: () => Promise.resolve(err(apiError)),
          queryKeysToInvalidate: {},
        })
      })

      // Before execution
      expect(mutation.result.value.isLoading()).toBeTruthy()

      await flushPromises()

      // After execution
      await mutation.execute()
      await flushPromises()

      expect(mutation.result.value.isLoading()).toBeFalsy()
      expect(mutation.result.value.isOk()).toBeFalsy()
      expect(mutation.result.value.isErr()).toBeTruthy()

      if (mutation.result.value.isErr()) {
        expect(mutation.result.value.getError()).toEqual(apiError)
      }
    })
  })
})
