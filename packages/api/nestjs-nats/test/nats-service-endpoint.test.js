import 'reflect-metadata'
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { Catch } from '@nestjs/common'
import { NatsServiceEndpoint } from '../dist/services/nats-service-endpoint.js'

class TestError extends Error {}

class ReturningFilter {
  catch (exception) {
    return {
      code: 422,
      description: exception.message,
      data: JSON.stringify({ handled: true })
    }
  }
}

class RespondingFilter {
  catch (_exception, host) {
    host
      .switchToNats()
      .getMessage()
      .respondError(409, 'handled in filter', JSON.stringify({ responded: true }))
  }
}

Catch(TestError)(ReturningFilter)
Catch(TestError)(RespondingFilter)

describe('NatsServiceEndpoint', () => {
  it('uses filter return values for request-reply errors', async () => {
    const endpoint = new NatsServiceEndpoint('TestEndpoint', createStream())
    endpoint.addFallBackHandler({
      filters: [{
        exceptions: [TestError],
        filter: new ReturningFilter()
      }],
      handlerContext: 'TestEndpoint.handle',
      handle: async () => {
        throw new TestError('boom')
      }
    })

    const replies = []
    const message = createMessage(replies)

    await endpoint.handleMessage(message)

    assert.deepEqual(replies, [
      [422, 'boom', JSON.stringify({ handled: true })]
    ])
  })

  it('does not send a fallback response when the filter already responded', async () => {
    const endpoint = new NatsServiceEndpoint('TestEndpoint', createStream())
    endpoint.addFallBackHandler({
      filters: [{
        exceptions: [TestError],
        filter: new RespondingFilter()
      }],
      handlerContext: 'TestEndpoint.handle',
      handle: async () => {
        throw new TestError('boom')
      }
    })

    const replies = []
    const message = createMessage(replies)

    await endpoint.handleMessage(message)

    assert.deepEqual(replies, [
      [409, 'handled in filter', JSON.stringify({ responded: true })]
    ])
  })
})

function createMessage (replies) {
  return {
    data: new Uint8Array(),
    respond: () => true,
    respondError: (code, description, data) => {
      replies.push([code, description, data])

      return true
    },
    subject: 'service.subject'
  }
}

function createStream () {
  return {
    async *[Symbol.asyncIterator] () {}
  }
}
