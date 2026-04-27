import { isDevelopment } from '@/is-development/isDevelopment.util'

type LogLevel = 'debug' | 'error' | 'info' | 'warn'

interface LoggerOptions {
  /**
   * Prefix prepended to every log message. Useful for scoping logs per module.
   * @default ''
   */
  prefix?: string
}

/**
 * Environment-aware logger class.
 *
 * - **Development**: all levels (debug, info, warn, error) are printed with full detail.
 * - **Production**: `debug` and `info` calls are suppressed; only `warn` and `error` are shown.
 *
 * Usage:
 * ```ts
 * const logger = new Logger({ prefix: '[MyModule]' })
 * logger.info('Loaded', { count: 42 })
 * logger.warn('Slow response', { ms: 1500 })
 * logger.error('Request failed', new Error('Network error'))
 * ```
 *
 * You can also use the singleton `logger` export for quick ad-hoc logging:
 * ```ts
 * import { logger } from '@wisemen/vue-core-utils'
 * logger.debug('raw value', value)
 * ```
 */
export class Logger {
  private readonly prefix: string

  constructor(options: LoggerOptions = {}) {
    this.prefix = options.prefix ?? ''
  }

  private buildArgs(message: any, args: unknown[]): unknown[] {
    if (typeof message === 'string') {
      const prefix = this.prefix.length > 0 ? `${this.prefix} ` : ''

      return [
        `${prefix}${message}`,
        ...args,
      ]
    }

    if (this.prefix.length > 0) {
      return [
        this.prefix,
        message,
        ...args,
      ]
    }

    return [
      message,
      ...args,
    ]
  }

  private log(level: LogLevel, message: any, ...args: unknown[]): void {
    const consoleArgs = this.buildArgs(message, args)

    switch (level) {
      case 'debug': {
        // eslint-disable-next-line no-console
        console.debug(...consoleArgs)

        break
      }
      case 'info': {
        // eslint-disable-next-line no-console
        console.info(...consoleArgs)

        break
      }
      case 'warn': {
        console.warn(...consoleArgs)

        break
      }
      case 'error': {
        console.error(...consoleArgs)

        break
      }
    }
  }

  /**
   * Logs a debug message. Suppressed in production.
   */
  debug(message: any, ...args: unknown[]): void {
    if (!isDevelopment()) {
      return
    }

    this.log('debug', message, ...args)
  }

  /**
   * Logs an error. Printed in both development and production.
   */
  error(message: any, ...args: unknown[]): void {
    this.log('error', message, ...args)
  }

  /**
   * Logs an informational message. Suppressed in production.
   */
  info(message: any, ...args: unknown[]): void {
    if (!isDevelopment()) {
      return
    }

    this.log('info', message, ...args)
  }

  /**
   * Logs a warning. Printed in both development and production.
   */
  warn(message: any, ...args: unknown[]): void {
    this.log('warn', message, ...args)
  }
}

/**
 * Shared default logger instance for quick usage without instantiation.
 *
 * @example
 * import { logger } from '@wisemen/vue-core-utils'
 * logger.info('App started')
 */
export const logger = new Logger()
