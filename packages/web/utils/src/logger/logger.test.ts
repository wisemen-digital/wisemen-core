import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import { Logger } from './logger'

describe('logger', () => {
  let infoSpy: ReturnType<typeof vi.spyOn>
  let warnSpy: ReturnType<typeof vi.spyOn>
  let errorSpy: ReturnType<typeof vi.spyOn>
  let debugSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    debugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('warn', () => {
    it('calls console.warn with the message', () => {
      const log = new Logger()

      log.warn('something fishy')
      expect(warnSpy).toHaveBeenCalledWith('something fishy')
    })

    it('keeps object messages structured', () => {
      const log = new Logger({
        prefix: '[MyModule]',
      })
      const payload = {
        count: 42,
      }

      log.warn(payload)
      expect(warnSpy).toHaveBeenCalledWith('[MyModule]', payload)
    })

    it('includes extra arguments', () => {
      const log = new Logger()
      const extra = {
        key: 'value',
      }

      log.warn('with extra', extra)
      expect(warnSpy).toHaveBeenCalledWith('with extra', extra)
    })
  })

  describe('error', () => {
    it('calls console.error with the message', () => {
      const log = new Logger()

      log.error('something broke')
      expect(errorSpy).toHaveBeenCalledWith('something broke')
    })
  })

  describe('prefix', () => {
    it('prepends the prefix to every message', () => {
      const log = new Logger({
        prefix: '[MyModule]',
      })

      log.warn('hello')
      expect(warnSpy).toHaveBeenCalledWith('[MyModule] hello')
    })
  })

  describe('info and debug in development', () => {
    it('calls console.info when not suppressed', () => {
      const log = new Logger()

      // In vitest the environment is treated as development
      log.info('informational message')
      expect(infoSpy).toHaveBeenCalledWith('informational message')
    })

    it('calls console.debug when not suppressed', () => {
      const log = new Logger()

      log.debug('debug message')
      expect(debugSpy).toHaveBeenCalledWith('debug message')
    })
  })
})
