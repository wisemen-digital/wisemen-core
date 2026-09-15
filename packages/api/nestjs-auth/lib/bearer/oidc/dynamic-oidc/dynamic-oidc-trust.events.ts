import { DomainEvent, RegisterDomainEvent } from '@wisemen/nestjs-domain-events'
import type { OidcTrustUuid } from '../oidc-trust.uuid.js'

export class DynamicOidcTrustEventContent {
  constructor (readonly oidcTrustId: OidcTrustUuid) {}
}

@RegisterDomainEvent('dynamic-oidc-trust.created', 1)
export class DynamicOidcTrustCreatedEvent extends DomainEvent<DynamicOidcTrustEventContent> {
  constructor (oidcTrustId: OidcTrustUuid) {
    super({
      subjectType: 'dynamic-oidc-trust',
      subjectId: oidcTrustId,
      content: new DynamicOidcTrustEventContent(oidcTrustId)
    })
  }
}

@RegisterDomainEvent('dynamic-oidc-trust.updated', 1)
export class DynamicOidcTrustUpdatedEvent extends DomainEvent<DynamicOidcTrustEventContent> {
  constructor (oidcTrustId: OidcTrustUuid) {
    super({
      subjectType: 'dynamic-oidc-trust',
      subjectId: oidcTrustId,
      content: new DynamicOidcTrustEventContent(oidcTrustId)
    })
  }
}

@RegisterDomainEvent('dynamic-oidc-trust.deleted', 1)
export class DynamicOidcTrustDeletedEvent extends DomainEvent<DynamicOidcTrustEventContent> {
  constructor (oidcTrustId: OidcTrustUuid) {
    super({
      subjectType: 'dynamic-oidc-trust',
      subjectId: oidcTrustId,
      content: new DynamicOidcTrustEventContent(oidcTrustId)
    })
  }
}
