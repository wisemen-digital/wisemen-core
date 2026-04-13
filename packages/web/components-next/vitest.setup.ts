import { vi } from 'vitest'

vi.mock('vue-i18n', () => ({
  useI18n: (): any => ({
    d: (key: string) => key,
    t: (key: string) => key,
  }),
}))

class ResizeObserverMock {
  disconnect = vi.fn()
  observe = vi.fn()
  unobserve = vi.fn()
}

vi.stubGlobal('ResizeObserver', ResizeObserverMock)
