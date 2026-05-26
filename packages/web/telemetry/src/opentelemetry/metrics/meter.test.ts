import {
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import { initOpenTelemetryMetrics } from './meter.ts'

describe('initOpenTelemetryMetrics', () => {
  it('returns false when no metrics endpoint is configured', async () => {
    const metricsEnabled = await initOpenTelemetryMetrics({
      accessTokenFn: (): Promise<string> => Promise.resolve('token'),
      serviceName: 'telemetry-web',
    })

    expect(metricsEnabled).toBeFalsy()
  })

  it('does not resolve the access token during initialization', async () => {
    const accessTokenFn = vi.fn((): Promise<string> => Promise.resolve('token'))

    await initOpenTelemetryMetrics({
      accessTokenFn,
      metricsEndpoint: 'https://collector.example/metrics',
      serviceName: 'telemetry-web',
    })

    expect(accessTokenFn).not.toHaveBeenCalled()
  })
})
