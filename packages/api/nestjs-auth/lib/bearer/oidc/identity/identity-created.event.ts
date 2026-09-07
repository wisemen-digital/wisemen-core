import { DomainEvent, RegisterDomainEvent } from '@wisemen/nestjs-domain-events'
import type { IdentityUuid } from './identity.uuid.js'

export class IdentityCreatedEventContent {
  constructor (readonly identityUuid: IdentityUuid) { }
}

@RegisterDomainEvent('identity.created', 1)
export class IdentityCreatedEvent extends DomainEvent<IdentityCreatedEventContent> {
  constructor (identityUuid: IdentityUuid) {
    super({
      subjectType: 'identity',
      subjectId: identityUuid,
      content: new IdentityCreatedEventContent(identityUuid)
    })
  }
}
