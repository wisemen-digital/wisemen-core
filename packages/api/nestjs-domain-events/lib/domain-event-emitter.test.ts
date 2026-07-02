import { describe, it } from 'node:test'
import { expect } from 'expect'
import { DomainEvent } from './domain-event.js'
import { DomainEventEmitter } from './domain-event-emitter.js'

class TestEvent extends DomainEvent<{ value: string }> {
  readonly type = 'test.event'
  readonly version = 1
}

describe('DomainEventEmitter', () => {
  it('wraps emission in the configured middleware', async () => {
    const calls: string[] = []
    const emitter = new DomainEventEmitter(async (emit) => {
      calls.push('before')
      await emit()
      calls.push('after')
    })

    emitter.addSubscriber('test.event', async (events) => {
      calls.push(`subscriber:${events.length}`)
    })

    await emitter.emit([
      new TestEvent({ content: { value: 'one' } }),
      new TestEvent({ content: { value: 'two' } })
    ])

    expect(calls).toEqual(['before', 'subscriber:2', 'after'])
  })

  it('emits directly when no middleware is configured', async () => {
    const calls: string[] = []
    const emitter = new DomainEventEmitter()

    emitter.addSubscriber('test.event', async (events) => {
      calls.push(`subscriber:${events.length}`)
    })

    await emitter.emit([new TestEvent({ content: { value: 'one' } })])

    expect(calls).toEqual(['subscriber:1'])
  })
})
