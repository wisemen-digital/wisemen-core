import { vi } from 'vitest'

vi.mock('vue-i18n', () => ({
  useI18n: (): any => ({
    d: (key: string) => key,
    t: (key: string) => key,
  }),
}))

const ResizeObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  unobserve: vi.fn(),
}))

vi.stubGlobal('ResizeObserver', ResizeObserverMock)
