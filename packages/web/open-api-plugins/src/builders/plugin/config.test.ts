import {
  describe,
  expect,
  it,
} from 'vitest'

import {
  defaultConfig,
  defineConfig,
} from './config'

describe('config', () => {
  describe('defaultConfig', () => {
    it('should have correct name', () => {
      expect(defaultConfig.name).toBe('builders')
    })

    it('should have correct output', () => {
      expect(defaultConfig.output).toBe('builders')
    })

    it('should have required dependencies', () => {
      expect(defaultConfig.dependencies).toEqual([
        '@hey-api/schemas',
        '@hey-api/typescript',
      ])
    })

    it('should have handler function', () => {
      expect(typeof defaultConfig.handler).toBe('function')
    })

    it('should have empty config by default', () => {
      expect(defaultConfig.config).toEqual({})
    })
  })

  describe('defineConfig', () => {
    it('should return config with custom options', () => {
      const config = defineConfig({
        generateZod: true,
        mockStrategy: 'static',
      })

      expect(config).toBeDefined()
    })

    it('should return config with mockStrategy zod', () => {
      const config = defineConfig({
        mockStrategy: 'zod',
      })

      expect(config).toBeDefined()
    })

    it('should return config with mockStrategy runtime', () => {
      const config = defineConfig({
        mockStrategy: 'runtime',
      })

      expect(config).toBeDefined()
    })

    it('should return config with no options', () => {
      const config = defineConfig({})

      expect(config).toBeDefined()
    })
  })
})
