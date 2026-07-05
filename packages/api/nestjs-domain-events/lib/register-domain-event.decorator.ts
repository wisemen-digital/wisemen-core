import assert from 'assert'
import type { DomainEvent } from './domain-event.js'

const DOMAIN_EVENT_TYPE_KEY = Symbol('wisemen.domain-event-type')
type DomainEventConstructor =  new (...args: unknown[]) => DomainEvent

export function RegisterDomainEvent (type: string, version: number): ClassDecorator {
  return ((target: DomainEventConstructor): DomainEventConstructor => {
    Reflect.defineMetadata(DOMAIN_EVENT_TYPE_KEY, type, target)

    return class extends target {
      public type: string = type
      public version: number = version
    }
  }) as ClassDecorator
}

export function getDomainEventType (target: DomainEventConstructor): string {
  const type = Reflect.getMetadata(DOMAIN_EVENT_TYPE_KEY, target) as unknown
  assert(type !== undefined, 'type metadata not defined on domain event')
  return type as string
}
