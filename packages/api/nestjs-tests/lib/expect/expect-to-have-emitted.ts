// oxlint-disable typescript-eslint(no-unsafe-member-access), typescript-eslint(no-unsafe-call)
import { DomainEvent, DomainEventEmitter } from '@wisemen/nestjs-domain-events'
import type { ExpectationResult, MatcherFunction } from 'expect'
import { expect } from 'expect'
import type { SinonStubbedInstance } from 'sinon'

export const toHaveEmitted: MatcherFunction<[DomainEvent]> = function (
  received: SinonStubbedInstance<DomainEventEmitter>,
  ...events: DomainEvent[]
): ExpectationResult {
  const expectedEvents = events.map(event => expect.objectContaining({
    content: event.content,
    source: event.source,
    type: event.type,
    version: event.version
  }))

  const calls = [...received.emit.getCalls(), ...received.emitOne.getCalls()]
  const originalEmits = calls.flatMap(
    call => call?.firstArg as DomainEvent[] | DomainEvent | undefined
  )

  const emittedEvents = Array.from(originalEmits)
  const foundEvents: unknown[] = []
  for (const expectedEvent of expectedEvents) {
    const emittedIndex = emittedEvents.findIndex(emit => this.equals(emit, expectedEvent))
    if (emittedIndex >= 0) {
      foundEvents.push(expectedEvent)
      emittedEvents.splice(emittedIndex, 1)
    }
  }

  const missingEvents = expectedEvents.filter(event => !foundEvents.some(e => e === event))

  if (missingEvents.length === 0) {
    const stringifiedActual = this.utils.printReceived(emittedEvents)
    const stringifiedExpected = this.utils.printExpected(expectedEvents)

    return {
      pass: true,
      message: () => `expected ${stringifiedActual} not to be ${stringifiedExpected}`
    }
  } else {
    return {
      pass: false,
      message: () => {
        return `\n Expected ${expectedEvents.length} event(s), missing ${missingEvents.length}`
          + `\n Emitted ${originalEmits.length} event(s)`
          + '\n' + this.utils.printDiffOrStringify(
          missingEvents.length === 1 ? missingEvents[0] : missingEvents,
          originalEmits.length === 1 ? originalEmits[0] : originalEmits,
          'Expected event(s)',
          'Emitted event(s)',
          true
        )
      }
    }
  }
}

declare module 'expect' {
  interface AsymmetricMatchers {
    toHaveEmitted: (...events: DomainEvent[]) => ExpectationResult
  }
  interface Matchers<R> {
    toHaveEmitted: (...event: DomainEvent[]) => R
  }
}
