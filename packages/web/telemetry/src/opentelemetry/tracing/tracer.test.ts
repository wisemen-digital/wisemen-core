/* eslint-disable import/first */

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

const mocks = vi.hoisted(() => {
  return {
    batchSpanProcessor: vi.fn(),
    otlpTraceExporter: vi.fn(),
    webTracerProvider: vi.fn(),
    zoneContextManager: vi.fn(),
  }
})

vi.mock('@opentelemetry/context-zone', () => {
  return {
    ZoneContextManager: mocks.zoneContextManager,
  }
})

vi.mock('@opentelemetry/exporter-trace-otlp-http', () => {
  return {
    OTLPTraceExporter: mocks.otlpTraceExporter,
  }
})

vi.mock('@opentelemetry/sdk-trace-web', () => {
  return {
    BatchSpanProcessor: mocks.batchSpanProcessor,
    WebTracerProvider: class {
      register = vi.fn()

      constructor(config: unknown) {
        mocks.webTracerProvider(config)
      }
    },
  }
})

import { initOpenTelemetryTracing } from './tracer.ts'

describe('initOpenTelemetryTracing', () => {
  beforeEach(() => {
    mocks.batchSpanProcessor.mockReset()
    mocks.otlpTraceExporter.mockReset()
    mocks.webTracerProvider.mockReset()
    mocks.zoneContextManager.mockReset()
  })

  it('returns false when no trace endpoint is configured', async () => {
    const traceEnabled = await initOpenTelemetryTracing({
      accessTokenFn: (): Promise<string> => Promise.resolve('token'),
      serviceName: 'telemetry-web',
      tracePropagationUrls: [],
    })

    expect(traceEnabled).toBeFalsy()
  })

  it('does not resolve the access token during initialization', async () => {
    const accessTokenFn = vi.fn((): Promise<string> => Promise.resolve('token'))

    await initOpenTelemetryTracing({
      accessTokenFn,
      serviceName: 'telemetry-web',
      traceEndpoint: 'https://collector.example/traces',
      tracePropagationUrls: [
        'https://api.example',
      ],
    })

    expect(accessTokenFn).not.toHaveBeenCalled()
  })

  it('defaults the trace sample rate to all traces', async () => {
    await initOpenTelemetryTracing({
      accessTokenFn: (): Promise<string> => Promise.resolve('token'),
      serviceName: 'telemetry-web',
      traceEndpoint: 'https://collector.example/traces',
      tracePropagationUrls: [],
    })

    expect(mocks.webTracerProvider).toHaveBeenCalledWith(expect.objectContaining({
      sampler: expect.objectContaining({
        _root: expect.objectContaining({
          _ratio: 1,
        }),
      }),
    }))
  })

  it('uses the configured trace sample rate for root traces', async () => {
    await initOpenTelemetryTracing({
      accessTokenFn: (): Promise<string> => Promise.resolve('token'),
      serviceName: 'telemetry-web',
      traceEndpoint: 'https://collector.example/traces',
      tracePropagationUrls: [],
      traceSampleRate: 0.25,
    })

    expect(mocks.webTracerProvider).toHaveBeenCalledWith(expect.objectContaining({
      sampler: expect.objectContaining({
        _root: expect.objectContaining({
          _ratio: 0.25,
        }),
      }),
    }))
  })

  it('falls back to all traces when the trace sample rate is invalid', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    await initOpenTelemetryTracing({
      accessTokenFn: (): Promise<string> => Promise.resolve('token'),
      debug: true,
      serviceName: 'telemetry-web',
      traceEndpoint: 'https://collector.example/traces',
      tracePropagationUrls: [],
      traceSampleRate: 2,
    })

    expect(mocks.webTracerProvider).toHaveBeenCalledWith(expect.objectContaining({
      sampler: expect.objectContaining({
        _root: expect.objectContaining({
          _ratio: 1,
        }),
      }),
    }))
    expect(warn).toHaveBeenCalledWith('[Telemetry] Invalid traceSampleRate "2". Falling back to 1.')

    warn.mockRestore()
  })
})
