import { applyDecorators } from '@nestjs/common'
import { Trace } from '@wisemen/opentelemetry'
import type { DomainEvent } from './domain-event.js'
import { getDomainEventType } from './register-domain-event.decorator.js'

export const SUBSCRIBE_KEY = 'wisemen.subscribe'

type SubScribingMethodName = string
export type EventsMap = Map<string, SubScribingMethodName[]>

/** Subscribe to Domain Event */
export function Subscribe (event: new (...args: unknown[]) => DomainEvent): MethodDecorator {
  return applyDecorators(
    Trace(),
    (target: object, methodName: string, _descriptor: PropertyDescriptor) => {
      const observedEventsMap = Reflect.getMetadata(SUBSCRIBE_KEY, target) as EventsMap | undefined
        ?? new Map<string, SubScribingMethodName[]>()

      const eventType = getDomainEventType(event)
      const observingMethods = observedEventsMap.get(eventType) ?? []

      observingMethods.push(methodName)

      observedEventsMap.set(eventType, observingMethods)
      Reflect.defineMetadata(SUBSCRIBE_KEY, observedEventsMap, target)
    }
  )
}
