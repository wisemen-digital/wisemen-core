import type {
  Attributes,
  AttributeValue,
  Exception,
  Span,
  Tracer,
} from '@opentelemetry/api'
import {
  SpanStatusCode,
  trace,
} from '@opentelemetry/api'
import type { Logger } from '@opentelemetry/api-logs'
import { SeverityNumber } from '@opentelemetry/api-logs'
import type { App } from 'vue'

import { initOpenTelemetryLogging } from './opentelemetry/logging/logger.ts'
import { initOpenTelemetryMetrics } from './opentelemetry/metrics/meter.ts'
import { createUserAttributes } from './opentelemetry/shared.ts'
import { registerDefaultAppInstrumentations } from './opentelemetry/tracing/instrumentation.ts'
import { initOpenTelemetryTracing } from './opentelemetry/tracing/tracer.ts'
import type {
  TelemetryAttributes,
  TelemetryAttributeValue,
  TelemetryLogOptions,
  TelemetryOptions,
  TelemetrySeverity,
  TelemetryUser,
} from './types.ts'

const TELEMETRY_LOG_SEVERITY: Record<TelemetrySeverity, SeverityNumber> = {
  debug: SeverityNumber.DEBUG,
  error: SeverityNumber.ERROR,
  fatal: SeverityNumber.FATAL,
  info: SeverityNumber.INFO,
  warn: SeverityNumber.WARN,
}

interface ErrorEventLike {
  colno?: number
  error?: unknown
  filename?: string
  lineno?: number
  message?: string
}

interface PromiseRejectionEventLike {
  reason?: unknown
}

export class Telemetry {
  private commonAttributes: Attributes = {}
  private readonly handleUnhandledRejection = (event: Event): void => {
    const rejectionEvent = event as PromiseRejectionEventLike

    this.recordException(rejectionEvent.reason ?? new Error('Unhandled promise rejection'), {
      'error.type': 'unhandledrejection',
    })
  }

  private readonly handleWindowError = (event: Event): void => {
    const errorEvent = event as ErrorEventLike

    this.recordException(errorEvent.error ?? new Error(errorEvent.message ?? 'Unhandled window error'), {
      'error.column': errorEvent.colno ?? 0,
      'error.line': errorEvent.lineno ?? 0,
      'error.source': errorEvent.filename ?? 'window',
      'error.type': 'window.onerror',
    })
  }

  private initialized = false
  private logger: Logger | null = null

  private traceEnabled = false

  private readonly tracer: Tracer

  constructor(private readonly options: TelemetryOptions) {
    this.tracer = trace.getTracer(options.serviceName, options.serviceVersion)
  }

  private decorateSpanWithException(
    span: Span,
    exception: unknown,
    attributes: Attributes,
  ): void {
    span.setAttributes(attributes)
    span.recordException(exception as Exception)
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: this.getExceptionMessage(exception),
    })

    const exceptionAttributes = this.getExceptionAttributes(exception)

    if (Object.keys(exceptionAttributes).length > 0) {
      span.setAttributes(exceptionAttributes)
    }
  }

  private emitExceptionLog(
    exception: unknown,
    attributes: Attributes,
  ): void {
    if (this.logger == null) {
      return
    }

    this.logger.emit({
      attributes: {
        ...attributes,
        ...this.getExceptionAttributes(exception),
      },
      body: this.getExceptionMessage(exception),
      eventName: 'exception',
      exception,
      severityNumber: SeverityNumber.ERROR,
      severityText: 'ERROR',
      timestamp: Date.now(),
    })
  }

  private getExceptionAttributes(exception: unknown): Attributes {
    if (exception instanceof Error) {
      return {
        'exception.message': exception.message,
        'exception.stacktrace': exception.stack ?? '',
        'exception.type': exception.name,
        'exceptions.captured': true,
      }
    }

    return {
      'exception.message': this.getExceptionMessage(exception),
      'exception.type': this.getExceptionType(exception),
      'exceptions.captured': true,
    }
  }

  private getExceptionMessage(exception: unknown): string {
    if (exception instanceof Error) {
      return exception.message
    }

    if (typeof exception === 'string') {
      return exception
    }

    if (typeof exception === 'object' && exception !== null && 'message' in exception) {
      const {
        message,
      } = exception as { message?: unknown }

      if (typeof message === 'string' && message !== '') {
        return message
      }
    }

    const serializedException = this.serializeException(exception)

    if (serializedException !== null) {
      return serializedException
    }

    return 'Unknown exception'
  }

  private getExceptionType(exception: unknown): string {
    if (exception instanceof Error) {
      return exception.name
    }

    if (exception === null) {
      return 'null'
    }

    if (typeof exception !== 'object') {
      return typeof exception
    }

    const constructor = Object.getPrototypeOf(exception) as { constructor?: { name?: string } } | null
    const constructorName = constructor?.constructor?.name

    return constructorName ?? 'object'
  }

  private installBrowserErrorHandlers(): void {
    if (typeof window === 'undefined') {
      return
    }

    window.addEventListener('error', this.handleWindowError)
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection)
  }

  private installVueErrorHandler(app: App): void {
    const originalErrorHandler = app.config.errorHandler

    app.config.errorHandler = (error, instance, info): void => {
      const component = instance as { $options?: { name?: string } } | null
      const componentName = typeof component?.$options?.name === 'string'
        ? component.$options.name
        : 'anonymous'

      this.recordException(error, {
        'vue.component.name': componentName,
        'vue.error.info': info,
      })

      originalErrorHandler?.(error, instance, info)
    }
  }

  private mergeAttributes(
    attributes: TelemetryAttributes = {},
  ): Attributes {
    return {
      ...this.commonAttributes,
      ...attributes,
    }
  }

  private recordSpanEvent(
    message: string,
    severity: TelemetrySeverity,
    attributes: Attributes,
    eventName?: string,
  ): void {
    const activeSpan = trace.getActiveSpan()
    const eventAttributes: Record<string, AttributeValue> = {
      ...attributes,
      'log.message': message,
      'log.severity': severity,
    }

    if (activeSpan != null) {
      activeSpan.addEvent(eventName ?? 'log', eventAttributes)

      return
    }

    if (!this.traceEnabled) {
      return
    }

    this.tracer.startActiveSpan(eventName ?? 'log', (span) => {
      span.addEvent(eventName ?? 'log', eventAttributes)
      span.end()
    })
  }

  private serializeException(exception: unknown): string | null {
    if (exception == null) {
      return null
    }

    try {
      if (typeof exception === 'object') {
        return JSON.stringify(exception)
      }

      return String(exception)
    }
    catch {
      return null
    }
  }

  async init(app: App): Promise<void> {
    if (this.initialized || this.options.enabled === false) {
      return
    }

    registerDefaultAppInstrumentations()
    this.traceEnabled = await initOpenTelemetryTracing(this.options)
    await initOpenTelemetryMetrics(this.options)
    this.logger = await initOpenTelemetryLogging(this.options)

    this.installVueErrorHandler(app)
    this.installBrowserErrorHandlers()
    this.initialized = true
  }

  log(message: string, options: TelemetryLogOptions = {}): void {
    const severity = options.severity ?? 'info'
    const attributes = this.mergeAttributes(options.attributes)

    if (this.logger != null) {
      this.logger.emit({
        attributes,
        body: message,
        eventName: options.eventName ?? 'log',
        severityNumber: TELEMETRY_LOG_SEVERITY[severity],
        severityText: severity.toUpperCase(),
        timestamp: Date.now(),
      })

      return
    }

    this.recordSpanEvent(message, severity, attributes, options.eventName)
  }

  recordException(
    exception: unknown,
    attributes: TelemetryAttributes = {},
  ): void {
    const mergedAttributes = this.mergeAttributes(attributes)
    const activeSpan = trace.getActiveSpan()

    if (activeSpan != null) {
      this.decorateSpanWithException(activeSpan, exception, mergedAttributes)
    }
    else if (this.traceEnabled) {
      this.tracer.startActiveSpan('recordException', (span) => {
        this.decorateSpanWithException(span, exception, mergedAttributes)
        span.end()
      })
    }

    this.emitExceptionLog(exception, mergedAttributes)
  }

  setAttribute(key: string, value: TelemetryAttributeValue): void {
    this.commonAttributes[key] = value
  }

  setAttributes(attributes: TelemetryAttributes): void {
    this.commonAttributes = {
      ...this.commonAttributes,
      ...attributes,
    }
  }

  setUser(user: TelemetryUser): void {
    this.setAttributes(createUserAttributes(user))
  }
}

export { registerAppInstrumentations } from './opentelemetry/tracing/instrumentation.ts'
export type {
  TelemetryAttributes,
  TelemetryAttributeValue,
  TelemetryLogOptions,
  TelemetryOptions,
  TelemetrySeverity,
  TelemetryUser,
} from './types.ts'
