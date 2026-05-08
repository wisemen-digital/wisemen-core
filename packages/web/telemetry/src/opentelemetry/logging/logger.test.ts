import {
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import { initOpenTelemetryLogging } from './logger.ts'

describe('initOpenTelemetryLogging', () => {
  it('returns null when no log endpoint is configured', async () => {
    const runtime = await initOpenTelemetryLogging({
      accessTokenFn: (): Promise<string> => Promise.resolve('token'),
      serviceName: 'telemetry-web',
    })

    expect(runtime).toBeNull()
  })

  it('does not resolve the access token during initialization', async () => {
    const accessTokenFn = vi.fn((): Promise<string> => Promise.resolve('token'))

    await initOpenTelemetryLogging({
      accessTokenFn,
      logEndpoint: 'https://collector.example/logs',
      serviceName: 'telemetry-web',
    })

    expect(accessTokenFn).not.toHaveBeenCalled()
  })
})
