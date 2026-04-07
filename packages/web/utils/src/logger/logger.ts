/* eslint-disable node/prefer-global/process */
type LogLevel = 'debug' | 'error' | 'info' | 'warn'

interface LoggerOptions {
  /**
   * Prefix prepended to every log message. Useful for scoping logs per module.
   * @default ''
   */
  prefix?: string
}

/**
 * Determines whether the current environment is development.
 * Reads `import.meta.env.DEV` (Vite) or falls back to `process.env.NODE_ENV`.
 */
function isDevelopment(): boolean {
  try {
    // Vite / bundler environments
    if (typeof import.meta !== 'undefined' && 'env' in import.meta) {
      return (import.meta as { env?: { DEV?: boolean } }).env?.DEV === true
    }
  }
  catch {
    // ignore – not available in all environments
  }

  try {
    return (
      typeof process !== 'undefined'
      && process.env.NODE_ENV !== 'production'
    )
  }
  catch {
    return true
  }
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

  private log(level: LogLevel, message: string, ...args: unknown[]): void {
    const prefix = this.prefix.length > 0 ? `${this.prefix} ` : ''
    const fullMessage = `${prefix}${message}`

    switch (level) {
      case 'debug': {
        // eslint-disable-next-line no-console
        console.debug(fullMessage, ...args)

        break
      }
      case 'info': {
        // eslint-disable-next-line no-console
        console.info(fullMessage, ...args)

        break
      }
      case 'warn': {
        console.warn(fullMessage, ...args)

        break
      }
      case 'error': {
        console.error(fullMessage, ...args)

        break
      }
    }
  }

  /**
   * Logs a debug message. Suppressed in production.
   */
  debug(message: string, ...args: unknown[]): void {
    if (!isDevelopment()) {
      return
    }

    this.log('debug', message, ...args)
  }

  /**
   * Logs an error. Printed in both development and production.
   */
  error(message: string, ...args: unknown[]): void {
    this.log('error', message, ...args)
  }

  /**
   * Logs an informational message. Suppressed in production.
   */
  info(message: string, ...args: unknown[]): void {
    if (!isDevelopment()) {
      return
    }

    this.log('info', message, ...args)
  }

  /**
   * Logs a warning. Printed in both development and production.
   */
  warn(message: string, ...args: unknown[]): void {
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
