import type { Mock } from 'vitest'
import { vi } from 'vitest'

import {
  mockAsyncPaginatedResult,
  mockAsyncVoidResult,
} from './asyncResult.mock'

type ServiceMethodKeys<TService> = {
  [TKey in keyof TService]-?: TService[TKey] extends (...args: never[]) => Promise<unknown>
    ? TKey
    : never
}[keyof TService]

type ServiceMethodDefaults<TService> = {
  [TKey in ServiceMethodKeys<TService>]?: TService[TKey] extends (...args: infer TArgs) => Promise<infer TResult>
    ? (...args: TArgs) => TResult
    : never
}

export type MockService<TService, TMethods extends keyof TService = keyof TService> = {
  [TMethod in TMethods]: TService[TMethod] extends (...args: infer TArgs) => infer TResult
    ? Mock<(...args: TArgs) => TResult>
    : never
}

interface ServiceMockOptions<TService, TMethods extends ServiceMethodDefaults<TService>> {
  methods: TMethods
  serviceName: string
  path: string
}

const mockedServices = new Map<string, Record<string, Mock>>()

export const ServiceMock = {
  mock<TService>({
    methods,
    serviceName,
    path,
  }: ServiceMockOptions<TService, ServiceMethodDefaults<TService>>): MockService<TService> {
    const key = `${path}:${serviceName}`
    const service = mockedServices.get(key) ?? {}

    for (const mock of Object.values(service)) {
      mock.mockReset()
    }

    for (const [
      method,
      result,
    ] of Object.entries(methods as Record<string, (() => unknown) | undefined>)) {
      if (result === undefined) {
        continue
      }

      service[method] ??= vi.fn()
      service[method].mockImplementation(() => Promise.resolve(result()))
    }

    if (!mockedServices.has(key)) {
      vi.doMock(path, () => ({
        [serviceName]: service,
      }))
      mockedServices.set(key, service)
    }

    return service as MockService<TService>
  },

  toPaginatedResult: mockAsyncPaginatedResult,
  toVoid: mockAsyncVoidResult,
}
