import 'reflect-metadata'
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { Catch, UseFilters } from '@nestjs/common'
import { getNatsExceptionFilters } from '../dist/exception-filters/get-nats-exception-filters.js'

class TestError extends Error {}

class ClassFilter {
  catch () {}
}

class MethodFilter {
  catch () {}
}

Catch(TestError)(ClassFilter)

const methodFilter = new MethodFilter()

class Handler {
  handle () {}
}

UseFilters(ClassFilter)(Handler)
UseFilters(methodFilter)(
  Handler.prototype,
  'handle',
  Object.getOwnPropertyDescriptor(Handler.prototype, 'handle')
)

describe('getNatsExceptionFilters', () => {
  it('resolves method and class filters in execution order', () => {
    const classFilter = new ClassFilter()
    const providersExplorer = {
      getProviderInstance: (providerClass) => providerClass === ClassFilter ? classFilter : undefined
    }

    const filters = getNatsExceptionFilters(providersExplorer, Handler, 'handle')

    assert.equal(filters.length, 2)
    assert.equal(filters[0]?.filter, methodFilter)
    assert.deepEqual(filters[0]?.exceptions, [])
    assert.equal(filters[1]?.filter, classFilter)
    assert.deepEqual(filters[1]?.exceptions, [TestError])
  })
})
