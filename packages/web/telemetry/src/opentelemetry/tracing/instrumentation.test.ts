import type { Instrumentation } from '@opentelemetry/instrumentation'
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

const mocks = vi.hoisted(() => {
  const FetchInstrumentationConstructor = vi.fn()
  const UserInteractionInstrumentationConstructor = vi.fn()

  return {
    FetchInstrumentation: class FetchInstrumentation {
      constructor(config: unknown) {
        FetchInstrumentationConstructor(config)
      }
    },
    FetchInstrumentationConstructor,
    registerInstrumentations: vi.fn(),
    UserInteractionInstrumentation: class UserInteractionInstrumentation {
      constructor(config: unknown) {
        UserInteractionInstrumentationConstructor(config)
      }
    },
    UserInteractionInstrumentationConstructor,
  }
})

const CUSTOM_API_MATCHER_REGEX = /^https:\/\/api\.example\.com\/v2/

vi.mock('@opentelemetry/instrumentation', () => {
  return {
    registerInstrumentations: mocks.registerInstrumentations,
  }
})

vi.mock('@opentelemetry/instrumentation-fetch', () => {
  return {
    FetchInstrumentation: mocks.FetchInstrumentation,
  }
})

vi.mock('@opentelemetry/instrumentation-user-interaction', () => {
  return {
    UserInteractionInstrumentation: mocks.UserInteractionInstrumentation,
  }
})

describe('telemetry instrumentation', () => {
  beforeEach(() => {
    vi.resetModules()
    mocks.FetchInstrumentationConstructor.mockClear()
    mocks.registerInstrumentations.mockClear()
    mocks.UserInteractionInstrumentationConstructor.mockClear()
  })

  it('creates prefix matchers for configured string URLs', async () => {
    const {
      createTracePropagationMatchers,
    } = await import('./instrumentation.ts')

    const [
      matcher,
    ] = createTracePropagationMatchers([
      'https://api.example.com',
    ])

    expect(matcher).toBeInstanceOf(RegExp)
    expect('https://api.example.com').toMatch(matcher as RegExp)
    expect('https://api.example.com/users').toMatch(matcher as RegExp)
    expect('https://api.example.com?filter=active').toMatch(matcher as RegExp)
    expect('https://api.example.com.evil/users').not.toMatch(matcher as RegExp)
  })

  it('preserves regexp matchers and removes empty string matchers', async () => {
    const {
      createTracePropagationMatchers,
    } = await import('./instrumentation.ts')

    const matchers = createTracePropagationMatchers([
      '',
      CUSTOM_API_MATCHER_REGEX,
    ])

    expect(matchers).toEqual([
      CUSTOM_API_MATCHER_REGEX,
    ])
  })

  it('registers fetch instrumentation with configured propagation URLs', async () => {
    const {
      registerDefaultAppInstrumentations,
    } = await import('./instrumentation.ts')

    registerDefaultAppInstrumentations([
      'https://api.example.com',
    ])

    expect(mocks.FetchInstrumentationConstructor).toHaveBeenCalledWith({
      propagateTraceHeaderCorsUrls: [
        expect.any(RegExp),
      ],
    })

    const fetchConfig = mocks.FetchInstrumentationConstructor.mock.calls[0]?.[0] as {
      propagateTraceHeaderCorsUrls: RegExp[]
    }

    expect(String(fetchConfig.propagateTraceHeaderCorsUrls[0])).not.toBe('/.*/')
    expect(mocks.registerInstrumentations).toHaveBeenCalledTimes(1)
  })

  it('requires propagation URLs when registering extra instrumentations', async () => {
    const {
      registerAppInstrumentations,
    } = await import('./instrumentation.ts')
    const extraInstrumentation = {
      instrumentationName: 'extra',
    } as unknown as Instrumentation

    registerAppInstrumentations({
      instrumentations: [
        extraInstrumentation,
      ],
      tracePropagationUrls: [],
    })

    expect(mocks.FetchInstrumentationConstructor).toHaveBeenCalledWith({
      propagateTraceHeaderCorsUrls: [],
    })
    expect(mocks.registerInstrumentations).toHaveBeenNthCalledWith(2, {
      instrumentations: [
        extraInstrumentation,
      ],
    })
  })
})
