import { generateUuid } from '@wisemen/nestjs-common'
import { Identity } from './identity.entity.js'
import type { IdentityUuid } from './identity.uuid.js'

export class IdentityBuilder<TClaims extends object = object> {
  private readonly identity: Identity<TClaims>

  constructor () {
    this.identity = new Identity<TClaims>()
    this.identity.uuid = generateUuid<IdentityUuid>()
    this.identity.createdAt = new Date()
    this.identity.updatedAt = new Date()
    this.identity.issuer = 'https://auth.example.test'
    this.identity.subject = generateUuid()
    this.identity.claims = {} as TClaims
  }

  withUuid (uuid: IdentityUuid): this {
    this.identity.uuid = uuid
    return this
  }

  withCreatedAt (createdAt: Date): this {
    this.identity.createdAt = createdAt
    return this
  }

  withUpdatedAt (updatedAt: Date): this {
    this.identity.updatedAt = updatedAt
    return this
  }

  withIssuer (issuer: string): this {
    this.identity.issuer = issuer
    return this
  }

  withSubject (subject: string): this {
    this.identity.subject = subject
    return this
  }

  withClaims (claims: TClaims): this {
    this.identity.claims = claims
    return this
  }

  build (): Identity<TClaims> {
    return this.identity
  }
}
