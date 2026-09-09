import { DomainEvent, RegisterDomainEvent } from '@wisemen/nestjs-domain-events'
import type { ApiKeyUuid } from './api-key.uuid.js'

export class ApiKeyEventContent {
  constructor (readonly apiKeyUuid: ApiKeyUuid) {}
}

@RegisterDomainEvent('api-key.created', 1)
export class ApiKeyCreatedEvent extends DomainEvent<ApiKeyEventContent> {
  constructor (apiKeyUuid: ApiKeyUuid) {
    super({
      subjectType: 'api-key',
      subjectId: apiKeyUuid,
      content: new ApiKeyEventContent(apiKeyUuid)
    })
  }
}

@RegisterDomainEvent('api-key.deleted', 1)
export class ApiKeyDeletedEvent extends DomainEvent<ApiKeyEventContent> {
  constructor (apiKeyUuid: ApiKeyUuid) {
    super({
      subjectType: 'api-key',
      subjectId: apiKeyUuid,
      content: new ApiKeyEventContent(apiKeyUuid)
    })
  }
}
