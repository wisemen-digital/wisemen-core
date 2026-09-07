import 'reflect-metadata'
import { describe, it } from 'node:test'
import { expect } from 'expect'
import type { ExecutionContext } from '@nestjs/common'
import { IS_PUBLIC_KEY, isPublicContext, Public } from './public.decorator.js'

describe('Public', () => {
  it('stores public metadata with a default value of true', () => {
    class Controller {}

    Public()(Controller)

    expect(Reflect.getMetadata(IS_PUBLIC_KEY, Controller)).toBe(true)
  })

  it('stores the provided boolean value', () => {
    class Controller {}

    Public(false)(Controller)

    expect(Reflect.getMetadata(IS_PUBLIC_KEY, Controller)).toBe(false)
  })
})

describe('isPublicContext', () => {
  it('returns true when the handler is public', () => {
    class Controller {
      handler (): void {}
    }

    const context = createExecutionContext(Controller, Controller.prototype.handler)

    Public()(Controller.prototype, 'handler', Object.getOwnPropertyDescriptor(Controller.prototype, 'handler')!)

    expect(isPublicContext(context)).toBe(true)
  })

  it('falls back to controller metadata when the handler has no public metadata', () => {
    @Public()
    class Controller {
      handler (): void {}
    }

    const context = createExecutionContext(Controller, Controller.prototype.handler)

    expect(isPublicContext(context)).toBe(true)
  })

  it('lets handler metadata override controller metadata', () => {
    @Public()
    class Controller {
      @Public(false)
      handler (): void {}
    }

    const context = createExecutionContext(Controller, Controller.prototype.handler)

    expect(isPublicContext(context)).toBe(false)
  })

  it('returns false when no public metadata exists', () => {
    class Controller {
      handler (): void {}
    }

    const context = createExecutionContext(Controller, Controller.prototype.handler)

    expect(isPublicContext(context)).toBe(false)
  })
})

function createExecutionContext (
  controller: object,
  handler: object
): ExecutionContext {
  return {
    getClass: () => controller,
    getHandler: () => handler
  } as ExecutionContext
}
