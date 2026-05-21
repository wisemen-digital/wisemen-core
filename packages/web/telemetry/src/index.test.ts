/* eslint-disable import/first */

import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import type { App } from 'vue'

const mocks = vi.hoisted(() => {
  return {
    getActiveSpan: vi.fn(),
    getTracer: vi.fn(),
    initOpenTelemetryLogging: vi.fn(),
    initOpenTelemetryMetrics: vi.fn(),
    initOpenTelemetryTracing: vi.fn(),
    registerDefaultAppInstrumentations: vi.fn(),
    startActiveSpan: vi.fn(),
  }
})

vi.mock('@opentelemetry/api', () => {
  return {
    SpanStatusCode: {
      ERROR: 2,
    },
    trace: {
      getActiveSpan: mocks.getActiveSpan,
      getTracer: mocks.getTracer,
    },
  }
})

vi.mock('./opentelemetry/logging/logger.ts', () => {
  return {
    initOpenTelemetryLogging: mocks.initOpenTelemetryLogging,
  }
})

vi.mock('./opentelemetry/metrics/meter.ts', () => {
  return {
    initOpenTelemetryMetrics: mocks.initOpenTelemetryMetrics,
  }
})

vi.mock('./opentelemetry/tracing/tracer.ts', () => {
  return {
    initOpenTelemetryTracing: mocks.initOpenTelemetryTracing,
  }
})

vi.mock('./opentelemetry/tracing/instrumentation.ts', () => {
  return {
    registerAppInstrumentations: vi.fn(),
    registerDefaultAppInstrumentations: mocks.registerDefaultAppInstrumentations,
  }
})

import { Telemetry } from './index.ts'

function createApp(errorHandler = vi.fn()): App {
  return {
    config: {
      errorHandler,
    },
  } as unknown as App
}

function createOptions(
  overrides: Partial<ConstructorParameters<typeof Telemetry>[0]> = {},
): ConstructorParameters<typeof Telemetry>[0] {
  return {
    accessTokenFn: (): Promise<string> => Promise.resolve('token'),
    serviceName: 'telemetry-web',
    traceEndpoint: 'https://collector.example/traces',
    ...overrides,
  }
}

function createSpan(): {
  addEvent: ReturnType<typeof vi.fn>
  end: ReturnType<typeof vi.fn>
  recordException: ReturnType<typeof vi.fn>
  setAttributes: ReturnType<typeof vi.fn>
  setStatus: ReturnType<typeof vi.fn>
} {
  return {
    addEvent: vi.fn(),
    end: vi.fn(),
    recordException: vi.fn(),
    setAttributes: vi.fn(),
    setStatus: vi.fn(),
  }
}

describe('telemetry', () => {
  beforeEach(() => {
    mocks.getActiveSpan.mockReset()
    mocks.getTracer.mockReset()
    mocks.initOpenTelemetryLogging.mockReset()
    mocks.initOpenTelemetryMetrics.mockReset()
    mocks.initOpenTelemetryTracing.mockReset()
    mocks.registerDefaultAppInstrumentations.mockReset()
    mocks.startActiveSpan.mockReset()

    mocks.getTracer.mockReturnValue({
      startActiveSpan: mocks.startActiveSpan,
    })
    mocks.initOpenTelemetryTracing.mockResolvedValue(true)
    mocks.initOpenTelemetryMetrics.mockResolvedValue(true)
    mocks.initOpenTelemetryLogging.mockResolvedValue(null)

    vi.unstubAllGlobals()
  })

  it('installs browser handlers only once', async () => {
    const addEventListener = vi.fn()

    vi.stubGlobal('window', {
      addEventListener,
    })

    const telemetry = new Telemetry(createOptions({
      logEndpoint: 'https://collector.example/logs',
    }))

    await telemetry.init(createApp())
    await telemetry.init(createApp())

    expect(addEventListener).toHaveBeenCalledTimes(2)
    expect(addEventListener).toHaveBeenNthCalledWith(1, 'error', expect.any(Function))
    expect(addEventListener).toHaveBeenNthCalledWith(2, 'unhandledrejection', expect.any(Function))
    expect(mocks.registerDefaultAppInstrumentations).toHaveBeenCalledTimes(1)
    expect(mocks.initOpenTelemetryMetrics).toHaveBeenCalledTimes(1)
  })

  it('records exceptions on the active span and emits an error log', async () => {
    const span = createSpan()
    const logger = {
      emit: vi.fn(),
    }

    mocks.getActiveSpan.mockReturnValue(span)
    mocks.initOpenTelemetryLogging.mockResolvedValue(logger)

    const telemetry = new Telemetry(createOptions({
      logEndpoint: 'https://collector.example/logs',
    }))

    await telemetry.init(createApp())

    telemetry.recordException(new Error('checkout failed'), {
      feature: 'checkout',
    })

    expect(span.recordException).toHaveBeenCalledTimes(1)
    expect(span.setStatus).toHaveBeenCalledWith({
      code: 2,
      message: 'checkout failed',
    })
    expect(logger.emit).toHaveBeenCalledWith(expect.objectContaining({
      attributes: expect.objectContaining({
        'exception.message': 'checkout failed',
        'feature': 'checkout',
      }),
      body: 'checkout failed',
      eventName: 'exception',
    }))
  })

  it('preserves non-error exception payloads on spans and logs', async () => {
    const span = createSpan()
    const logger = {
      emit: vi.fn(),
    }
    const rejectionPayload = {
      code: 'PAYLOAD_ERROR',
      message: 'payload exploded',
    }

    mocks.getActiveSpan.mockReturnValue(span)
    mocks.initOpenTelemetryLogging.mockResolvedValue(logger)

    const telemetry = new Telemetry(createOptions({
      logEndpoint: 'https://collector.example/logs',
    }))

    await telemetry.init(createApp())
    telemetry.recordException(rejectionPayload)

    expect(span.recordException).toHaveBeenCalledWith(rejectionPayload)
    expect(span.setStatus).toHaveBeenCalledWith({
      code: 2,
      message: 'payload exploded',
    })
    expect(logger.emit).toHaveBeenCalledWith(expect.objectContaining({
      attributes: expect.objectContaining({
        'exception.message': 'payload exploded',
        'exception.type': 'Object',
      }),
      body: 'payload exploded',
    }))
  })

  it('creates a fallback span for exceptions when no active span exists', async () => {
    const span = createSpan()

    mocks.startActiveSpan.mockImplementation((_name, callback) => {
      callback(span)
    })

    const telemetry = new Telemetry(createOptions())

    await telemetry.init(createApp())
    telemetry.recordException(new Error('background failure'))

    expect(mocks.startActiveSpan).toHaveBeenCalledWith('recordException', expect.any(Function))
    expect(span.recordException).toHaveBeenCalledTimes(1)
    expect(span.end).toHaveBeenCalledTimes(1)
  })

  it('uses OTEL logs for messages and merges shared attributes', async () => {
    const logger = {
      emit: vi.fn(),
    }

    mocks.initOpenTelemetryLogging.mockResolvedValue(logger)

    const telemetry = new Telemetry(createOptions({
      logEndpoint: 'https://collector.example/logs',
    }))

    await telemetry.init(createApp())

    telemetry.setAttribute('locale', 'en-GB')
    telemetry.setUser({
      id: 'user-1',
      email: 'test@example.com',
    })
    telemetry.log('checkout started', {
      attributes: {
        step: 'confirm',
      },
      severity: 'warn',
    })

    expect(logger.emit).toHaveBeenCalledWith(expect.objectContaining({
      attributes: expect.objectContaining({
        'enduser.id': 'user-1',
        'locale': 'en-GB',
        'step': 'confirm',
        'user.email': 'test@example.com',
      }),
      body: 'checkout started',
      severityText: 'WARN',
    }))
  })

  it('falls back to span events when no logger is configured', async () => {
    const span = createSpan()

    mocks.getActiveSpan.mockReturnValue(span)

    const telemetry = new Telemetry(createOptions())

    await telemetry.init(createApp())
    telemetry.log('checkout started', {
      severity: 'info',
    })

    expect(span.addEvent).toHaveBeenCalledWith('log', expect.objectContaining({
      'log.message': 'checkout started',
      'log.severity': 'info',
    }))
  })

  it('wraps the Vue error handler and preserves the original handler', async () => {
    const originalErrorHandler = vi.fn()
    const telemetry = new Telemetry(createOptions())

    const app = createApp(originalErrorHandler)
    const span = createSpan()

    mocks.getActiveSpan.mockReturnValue(span)

    await telemetry.init(app)

    const error = new Error('render failed')
    const componentInstance = {
      $options: {
        name: 'CheckoutForm',
      },
    }

    app.config.errorHandler?.(error, componentInstance as never, 'render function')

    expect(span.recordException).toHaveBeenCalledWith(error)
    expect(originalErrorHandler).toHaveBeenCalledWith(error, componentInstance, 'render function')
  })
})
