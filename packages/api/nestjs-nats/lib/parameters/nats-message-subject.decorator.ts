import assert from 'node:assert'
import type { JsMsg } from '@nats-io/jetstream'
import type { Msg } from '@nats-io/transport-node'
import type { NatsParameter, NatsParameterContext } from './nats-parameter.js'
import { addNatsParameter } from './nats-parameter.js'

class NatsMessageSubjectParameter implements NatsParameter {
  constructor (readonly index: number) {}

  setContext (_context: NatsParameterContext) {
    // no need for context in this param
  }

  value (message: Msg | JsMsg): string {
    return message.subject
  }
}

/** Injects the subject of the message */
export function NatsMessageSubject (): ParameterDecorator {
  return (target: object, methodName: string | symbol | undefined, index: number): void => {
    assert(methodName !== undefined)
    addNatsParameter(target, methodName, new NatsMessageSubjectParameter(index))
  }
}
