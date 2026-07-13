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

  constructor (
    @Inject(MODULE_OPTIONS_TOKEN) private config: OtelLoggerModuleOptions
  ) {
    this._logger = new OpenTelemetryLogger(this.config)
  }

  private get logger (): OpenTelemetryLogger {
    if (this._logger === undefined) {
      throw new Error('Logger is not initialized')
    }

    return this._logger
  }

  private get logLevels (): LogLevel[] {
    return this.config.logLevels ?? DEFAULT_LOG_LEVELS
  }

  log (logRecord: LogRecord) {
    if (!this.logLevels.includes('log')) {
      return
    }

    this.logger.info(logRecord)
  }

  error (logRecord: LogRecord) {
    if (!this.logLevels.includes('error')) {
      return
    }

    this.logger.error(logRecord)
  }

  warn (logRecord: LogRecord) {
    if (!this.logLevels.includes('warn')) {
      return
    }

    this.logger.warn(logRecord)
  }

  debug (logRecord: LogRecord) {
    if (!this.logLevels.includes('debug')) {
      return
    }
    
    this.logger.debug(logRecord)
  }

  fatal (logRecord: LogRecord) {
    if (!this.logLevels.includes('fatal')) {
      return
    }

    this.logger.fatal(logRecord)
  }
}
