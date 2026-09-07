import 'reflect-metadata'
import { describe, it } from 'node:test'
import { expect } from 'expect'
import { IS_PUBLIC_KEY } from '@wisemen/nestjs-auth'
import { createApiStatusController } from './api-status.controller.js'

const VERSION_METADATA = '__version__'

describe('createApiStatusController', () => {
  it('applies dynamic controller metadata', () => {
    const controller = createApiStatusController({
      route: 'status',
      swaggerTag: 'Health',
      versioning: '1',
      isPublic: true
    })

    const descriptor = Object.getOwnPropertyDescriptor(controller.prototype, 'getApiInfo')
    const handler = descriptor?.value as object | undefined

    expect(descriptor).toBeDefined()
    expect(handler).toBeDefined()
    expect(Reflect.getMetadata(VERSION_METADATA, handler!)).toBe('1')
    expect(Reflect.getMetadata(IS_PUBLIC_KEY, handler!)).toBe(true)
  })
})
