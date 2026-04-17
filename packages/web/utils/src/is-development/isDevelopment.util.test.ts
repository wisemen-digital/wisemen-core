import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

describe('isDevelopment', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns true when DEV is enabled', async () => {
    vi.stubEnv('ENVIRONMENT', 'development')

    const {
      isDevelopment,
    } = await import('./isDevelopment.util')

    expect(isDevelopment()).toBeTruthy()
  })

  it('returns false when DEV is disabled', async () => {
    vi.stubEnv('ENVIRONMENT', 'production')

    const {
      isDevelopment,
    } = await import('./isDevelopment.util')

    expect(isDevelopment()).toBeFalsy()
  })
})
