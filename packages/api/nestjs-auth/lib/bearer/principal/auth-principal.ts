import { ApiKey } from '../api-key/api-key.entity.js'
import { Identity } from '../oidc/identity/identity.entity.js'

export interface AuthenticatedIdentity<TClaims extends object = object> extends Identity<TClaims> {
  type: 'identity'
  oidcTrustId: string
}

export interface AuthenticatedApiKey extends ApiKey {
  type: 'api-key'
}

export type AuthenticatedPrincipal<TClaims extends object = object> =
  | AuthenticatedIdentity<TClaims>
  | AuthenticatedApiKey
