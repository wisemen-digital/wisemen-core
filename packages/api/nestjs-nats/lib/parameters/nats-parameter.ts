import type { JsMsg } from '@nats-io/jetstream'
import type { Msg } from '@nats-io/transport-node'
import type { ClassConstructor } from 'class-transformer'

export interface NatsParameterContext {
  subject: string
}

export interface NatsParameter {
  index: number
  setContext(context: NatsParameterContext): void
  value(message: Msg | JsMsg): unknown
}

export type MethodName = string | symbol
export type NatsParameters = Map<MethodName, NatsParameter[]>

export const NATS_PARAMETERS_KEY = Symbol('wisemen.nats-parameters')

export function addNatsParameter (
  toTarget: object,
  toMethod: MethodName,
  parameter: NatsParameter
): void {
  let methods = Reflect.getMetadata(NATS_PARAMETERS_KEY, toTarget) as NatsParameters | undefined

  methods ??= new Map()

  const methodParams = methods.get(toMethod) ?? []

  methodParams.push(parameter)
  methods.set(toMethod, methodParams)

  Reflect.defineMetadata(NATS_PARAMETERS_KEY, methods, toTarget)
}

export function getNatsParameters (
  target: ClassConstructor<unknown>,
  method: MethodName
): NatsParameter[] {
  const parameters = Reflect.getMetadata(
    NATS_PARAMETERS_KEY,
    target.prototype as object
  ) as NatsParameters | undefined

  return parameters?.get(method) ?? []
}
