import {
  LoggerProvider,
  BatchLogRecordProcessor
} from '@opentelemetry/sdk-logs'
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http'
import { SeverityNumber, type Logger } from '@opentelemetry/api-logs'
import { resourceFromAttributes } from '@opentelemetry/resources'
import { getOtelServiceName } from './get-otel-service-name.js'

export interface LogRecord {
  context: string
  body: object
  attributes?: Record<string, unknown>
}

export interface OpentelemetryLoggingConfig {
  serviceName: string
  headers?: Record<string, string>
  url?: string
  env?: string
  config?: {
    concurrencyLimit?: number
    loggerName?: string
  }
  attributes?: Record<string, string>
}

export class OpenTelemetryLogger {
  private loggerProvider: LoggerProvider | null = null
  private logger: Logger | null = null
  private readonly hostname: string
  private readonly config: OpentelemetryLoggingConfig

  constructor (config: OpentelemetryLoggingConfig) {
    this.config = config
    this.hostname = getOtelServiceName()
    this.initialize()
  }

  private initialize (): void {
    if (this.config.url == null || this.config.url === '') {
      return
    }

    const logExporter = new OTLPLogExporter({
      url: this.config.url,
      headers: this.config.headers,
      concurrencyLimit: this.config.config?.concurrencyLimit ?? 1
    })

    this.loggerProvider = new LoggerProvider({
      processors: [new BatchLogRecordProcessor(logExporter)],
      resource: resourceFromAttributes({
        'service.name': this.config.serviceName,
        'deployment.environment': this.config.env,
        ...this.config.attributes
      })
    })

    this.logger = this.loggerProvider.getLogger(
      this.config.config?.loggerName ?? 'default'
    )
  }

  info (logRecord: LogRecord): void {
    this.emit(SeverityNumber.INFO, logRecord)
  }

  warn (logRecord: LogRecord): void {
    this.emit(SeverityNumber.WARN, logRecord)
  }

  error (logRecord: LogRecord): void {
    this.emit(SeverityNumber.ERROR, logRecord)
  }

  debug (logRecord: LogRecord): void {
    this.emit(SeverityNumber.DEBUG, logRecord)
  }

  trace (logRecord: LogRecord): void {
    this.emit(SeverityNumber.TRACE, logRecord)
  }

  fatal (logRecord: LogRecord): void {
    this.emit(SeverityNumber.FATAL, logRecord)
  }

  shutdown (): Promise<void> | void {
    if (this.loggerProvider != null) {
      return this.loggerProvider.shutdown()
    }
  }

  private emit (severity: SeverityNumber, record: LogRecord): void {
    if (this.logger == null) {
      return
    }

    this.logger.emit({
      severityNumber: severity,
      severityText: SeverityNumber[severity],
      timestamp: Date.now(),
      body: JSON.stringify(record.body),
      attributes: {
        env: this.config.env ?? process.env.NODE_ENV,
        host: this.hostname,
        context: record.context,
        ...record.attributes
      }
    })
  }
}
