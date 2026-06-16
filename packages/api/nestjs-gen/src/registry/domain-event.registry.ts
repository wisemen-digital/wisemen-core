import { ResolverRegistry } from './helpers/resolver-registry.js'

const domainEventResolvers = {
  domainEvent: {
    glob: 'src/**/domain-event.ts',
    type: 'class',
    name: 'DomainEvent'
  },
  domainEventSubjectType: {
    glob: 'src/**/domain-event-subject-type.enum.ts',
    type: 'enum',
    name: 'DomainEventSubjectType'
  },
  domainEventLog: {
    glob: 'src/**/domain-event-log.entity.ts',
    type: 'class',
    name: 'DomainEventLog'
  },
  domainEventType: {
    glob: 'src/**/domain-event-type.ts',
    type: 'enum',
    name: 'DomainEventType'
  },
  registerDomainEventDecorator: {
    glob: 'src/**/register-domain-event.decorator.ts',
    type: 'function',
    name: 'RegisterDomainEvent'
  },
  domainEventEmitter: {
    glob: 'src/**/domain-event-emitter.ts',
    type: 'class',
    name: 'DomainEventEmitter'
  },
  subjectedEventOptions: {
    glob: 'src/**/domain-event.ts',
    type: 'alias',
    name: 'SubjectedEventOptions'
  },
  domainEventSubscribersModule: {
    glob: 'src/**/domain-event-subscribers.module.ts',
    type: 'class',
    name: 'DomainEventSubscribersModule'
  }
} as const

export const DomainEventResolverRegistry = new ResolverRegistry(domainEventResolvers)
