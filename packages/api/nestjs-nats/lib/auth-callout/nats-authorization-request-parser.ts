import { Injectable } from '@nestjs/common'
import type { ServiceMsg } from '@nats-io/services'
import { decode } from '@nats-io/jwt'
import type { KeyPair } from '@nats-io/nkeys'
import type { ParsedAuthorizationRequest } from './parsed-nats-authorization-request.type.js'
import type { NatsAuthorizationRequest } from './nats-authorization-request.type.js'

@Injectable()
export class NatsAuthorizationRequestParser {
  parse (msg: ServiceMsg, xKeyPair?: KeyPair): ParsedAuthorizationRequest {
    const data = this.extractMessageData(msg, xKeyPair)

    if (data === null) {
      throw new Error('No payload in NATS authorization request')
    }

    const authorizationRequest = new TextDecoder('utf-8').decode(data)
    const requestClaim = decode<NatsAuthorizationRequest>(authorizationRequest)

    if (requestClaim.nats.user_nkey === undefined) {
      throw new Error('Missing user nkey')
    }

    if (requestClaim.nats.server_id?.name === undefined) {
      throw new Error('Missing server id name')
    }

    if (requestClaim.nats.connect_opts?.auth_token === undefined) {
      throw new Error('Missing auth token')
    }

    return {
      userNkey: requestClaim.nats.user_nkey,
      serverNkey: requestClaim.nats.server_id.name,
      authToken: requestClaim.nats.connect_opts.auth_token,
      clientName: requestClaim.nats.client_info?.name ?? 'unknown',
      xKey: msg.headers?.get('Nats-Server-Xkey')
    }
  }

  private extractMessageData (msg: ServiceMsg, xKeyPair?: KeyPair): Uint8Array | null {
    const xKey = msg.headers?.get('Nats-Server-Xkey')

    if (xKey === undefined) {
      if (xKeyPair !== undefined) {
        throw new Error('Expected an encrypted message, but received a plain message')
      }

      return msg.data
    }

    if (xKeyPair === undefined) {
      throw new Error('Received encrypted message, but no xKeyPair has been set to decrypt')
    }

    return xKeyPair.open(msg.data, xKey)
  }
}
