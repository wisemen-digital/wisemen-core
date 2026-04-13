import assert from 'node:assert'
import type { JsMsg } from '@nats-io/jetstream'
import type { Msg } from '@nats-io/transport-node'
import type { NatsParameter, NatsParameterContext } from './nats-parameter.js'
import { addNatsParameter } from './nats-parameter.js'

class NatsMessageParameter implements NatsParameter {
  index: number

  constructor (index: number) {
    this.index = index
  }

  setContext (_context: NatsParameterContext) {
    // no need for context in this param
  }

  value (message: Msg | JsMsg): unknown {
    return message
  }
}

/** Injects the raw `Msg` or `JsMsg` */
export function NatsMessage (): ParameterDecorator {
  return (target: object, methodName: string | symbol | undefined, index: number): void => {
    assert(methodName !== undefined)
    addNatsParameter(target, methodName, new NatsMessageParameter(index))
  }
}
