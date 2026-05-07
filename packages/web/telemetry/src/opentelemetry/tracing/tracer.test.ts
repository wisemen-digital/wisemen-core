import {
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import { initOpenTelemetryTracing } from './tracer.ts'

describe('initOpenTelemetryTracing', () => {
  it('returns false when no trace endpoint is configured', async () => {
    const traceEnabled = await initOpenTelemetryTracing({
      accessTokenFn: (): Promise<string> => Promise.resolve('token'),
      serviceName: 'telemetry-web',
    })

    expect(traceEnabled).toBeFalsy()
  })

  it('does not resolve the access token during initialization', async () => {
    const accessTokenFn = vi.fn((): Promise<string> => Promise.resolve('token'))

    await initOpenTelemetryTracing({
      accessTokenFn,
      serviceName: 'telemetry-web',
      traceEndpoint: 'https://collector.example/traces',
    })

    expect(accessTokenFn).not.toHaveBeenCalled()
  })
})
