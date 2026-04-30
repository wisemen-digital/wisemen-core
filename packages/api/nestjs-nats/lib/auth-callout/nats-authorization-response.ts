import type { Permission } from '@nats-io/jwt'
import { encodeUser, encodeAuthorizationResponse } from '@nats-io/jwt'
import type { KeyPair } from '@nats-io/nkeys'
import { fromPublic } from '@nats-io/nkeys'
import type { ParsedAuthorizationRequest } from './parsed-nats-authorization-request.type.js'

export class NatsAuthorizationResponseBuilder {
  private authorizationRequest: ParsedAuthorizationRequest | undefined
  private userName: string | undefined
  private issuerKeys: KeyPair | undefined
  private audience: string | undefined
  private dataLimit: number
  private maxSubscriptions: number
  private publishPermissions: Partial<Permission>
  private subPermissions: Partial<Permission>
  private expiresAt: number | undefined
  private xKeyPair: KeyPair | undefined

  constructor () {
    this.dataLimit = 1000000
    this.maxSubscriptions = 1000000
    this.publishPermissions = { allow: [] }
    this.subPermissions = { allow: [] }
  }

  withRequest (request: ParsedAuthorizationRequest): this {
    this.authorizationRequest = request

    return this
  }

  withUserName (name: string): this {
    this.userName = name

    return this
  }

  withIssuerKeys (keys: KeyPair): this {
    this.issuerKeys = keys

    return this
  }

  withAudience (audience: string): this {
    this.audience = audience

    return this
  }

  withDataLimit (bytes: number): this {
    this.dataLimit = bytes

    return this
  }

  withMaxSubscriptions (amount: number): this {
    this.maxSubscriptions = amount

    return this
  }

  withPublishPermissions (permissions: Partial<Permission>): this {
    this.publishPermissions = permissions

    return this
  }

  withSubPermissions (permissions: Partial<Permission>): this {
    this.subPermissions = permissions

    return this
  }

  withExpiresAt (at: Date): this {
    this.expiresAt = Math.floor(at.getTime() / 1000)

    return this
  }

  withXKeyPair (xKeyPair: KeyPair): this {
    this.xKeyPair = xKeyPair

    return this
  }

  async build (): Promise<Uint8Array> {
    if (this.authorizationRequest === undefined) {
      throw new Error('no request set')
    }

    if (this.userName === undefined) {
      throw new Error('no user name set')
    }

    if (this.issuerKeys === undefined) {
      throw new Error('no issuer keys set')
    }

    if (this.audience === undefined) {
      throw new Error('no audience set')
    }

    const user = fromPublic(this.authorizationRequest.userNkey)

    const jwt = await encodeUser(
      this.userName,
      user,
      this.issuerKeys,
      {
        pub: this.publishPermissions,
        sub: this.subPermissions,
        locale: Intl.DateTimeFormat().resolvedOptions().timeZone,
        data: this.dataLimit,
        subs: this.maxSubscriptions
      },
      {
        aud: this.audience,
        exp: this.expiresAt
      }
    )

    const authorizationResponse = await encodeAuthorizationResponse(
      user,
      fromPublic(this.authorizationRequest.serverNkey),
      this.issuerKeys,
      { jwt },
      {
        aud: this.audience,
        exp: this.expiresAt
      }
    )

    const encodedResponse = new TextEncoder().encode(authorizationResponse)

    if (this.xKeyPair !== undefined) {
      if (this.authorizationRequest.xKey === undefined) {
        throw new Error('Expected authorization request to be encrypted')
      }

      return this.xKeyPair.seal(encodedResponse, this.authorizationRequest.xKey)
    }

    return encodedResponse
  }
}
