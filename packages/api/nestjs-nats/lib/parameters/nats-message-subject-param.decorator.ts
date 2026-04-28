import assert from 'node:assert'
import type { JsMsg } from '@nats-io/jetstream'
import type { Msg } from '@nats-io/transport-node'
import type { ClassConstructor } from 'class-transformer'
import type { Type } from '@nestjs/common'
import type { NatsParameter, NatsParameterContext } from './nats-parameter.js'
import { addNatsParameter } from './nats-parameter.js'
import type { NatsPipeTransform } from './pipes/nats-pipe-transform.js'
import type { NatsParameterMetadata } from './nats-parameter-metadata.js'
import { NatsSubjectParamUuidValidationPipe } from './pipes/nats-subject-param-uuid-validation.pipe.js'

class NatsMessageSubjectParamParameter implements NatsParameter {
  readonly index: number
  private paramName: string
  private paramIndex: number = -1
  private pipes: NatsPipeTransform[]
  private paramMeta: NatsParameterMetadata

  constructor (
    index: number,
    paramName: string,
    pipes: NatsPipeTransform[],
    meta: NatsParameterMetadata
  ) {
    this.index = index
    this.paramName = `:${paramName}`
    this.pipes = pipes
    this.paramMeta = meta
  }

  setContext (context: NatsParameterContext) {
    const subjects = context.subject.split('.')

    this.paramIndex = subjects.findIndex(s => s === this.paramName)
  }

  async value (message: Msg | JsMsg): Promise<unknown> {
    if (this.paramIndex === -1) {
      return undefined
    }

    let subjectParam: unknown = message.subject.split('.').at(this.paramIndex)

    for (const pipe of this.pipes) {
      subjectParam = await pipe.transform(subjectParam, this.paramMeta)
    }

    return subjectParam
  }
}

/**
 * Injects a parameterized segment from the subject hierarchy.
 * Pipes receive a string, or `undefined` if the segment is missing.
*/
export function NatsMessageSubjectParam (
  paramName: string,
  ...pipes: ClassConstructor<NatsPipeTransform>[]
): ParameterDecorator {
  return (target: object, methodName: string | symbol | undefined, index: number): void => {
    assert(methodName !== undefined)

    const types = Reflect.getMetadata('design:paramtypes', target, methodName) as Type<unknown>[]
    const pipeInstances = pipes.map(pipe => new pipe())
    const meta = { metaType: types[index] }
    const parameter = new NatsMessageSubjectParamParameter(index, paramName, pipeInstances, meta)

    addNatsParameter(target, methodName, parameter)
  }
}

/**
 * Injects a parameterized subject segment and validates it is a UUID.
 */
export function NatsMessageSubjectUuidParam (paramName: string): ParameterDecorator {
  return NatsMessageSubjectParam(paramName, NatsSubjectParamUuidValidationPipe)
}
