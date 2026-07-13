import { Inject, Injectable, type LoggerService, type LogLevel } from '@nestjs/common'
import { LogRecord, OpenTelemetryLogger } from '../logging.js'
import { MODULE_OPTIONS_TOKEN } from './otel-logger.module-definitions.js'
import { OtelLoggerModuleOptions } from './otel-logger.module-options.js'

const DEFAULT_LOG_LEVELS: LogLevel[] = [
  'log',
  'error',
  'warn',
  'debug',
  'fatal'
]
@Injectable()
export class NestjsOtelLogger implements LoggerService {
  private _logger: OpenTelemetryLogger | undefined
  private _logLevels: LogLevel[]

  constructor (
    @Inject(MODULE_OPTIONS_TOKEN) private config: OtelLoggerModuleOptions
  ) {
    this._logger = new OpenTelemetryLogger(this.config)
    this._logLevels = this.config.logLevels ?? DEFAULT_LOG_LEVELS
  }

  private get logger (): OpenTelemetryLogger {
    if (this._logger === undefined) {
      throw new Error('Logger is not initialized')
    }

    return this._logger
  }

  private get logLevels (): LogLevel[] {
    return this._logLevels
  }

  log (message: unknown, context?: string, attributes?: Record<string, unknown>) {
    if (!this.logLevels.includes('log')) {
      return
    }

    const logRecord = this.toLogRecord(message,context, attributes)
    this.logger.info(logRecord)
  }

  error (message: unknown, context?: string, attributes?: Record<string, unknown>) {
    if (!this.logLevels.includes('error')) {
      return
    }

    const logRecord = this.toLogRecord(message,context, attributes)
    this.logger.error(logRecord)
  }

  warn (message: unknown, context?: string, attributes?: Record<string, unknown>) {
    if (!this.logLevels.includes('warn')) {
      return
    }

    const logRecord = this.toLogRecord(message,context, attributes)
    this.logger.warn(logRecord)
  }

  debug (message: unknown, context?: string, attributes?: Record<string, unknown>) {
    if (!this.logLevels.includes('debug')) {
      return
    }
    
    const logRecord = this.toLogRecord(message,context, attributes)
    this.logger.debug(logRecord)
  }

  fatal (message: unknown, context?: string, attributes?: Record<string, unknown>) {
    if (!this.logLevels.includes('fatal')) {
      return
    }

    const logRecord = this.toLogRecord(message,context, attributes)
    this.logger.fatal(logRecord)
  }

  setLogLevels (logLevels: LogLevel[]): void {
    this._logLevels = logLevels
  }

  private toLogRecord (message: unknown, context?: string, attributes?: Record<string, unknown>): LogRecord {
    return {
      body: message as object,
      context: context ?? 'undefined',
      attributes
    }
  }
}
