import { Inject, Injectable } from '@nestjs/common'
import { parseBasicAuthHeader } from './basic-auth.header.js'
import { BASIC_AUTH_DEFINITIONS, BasicAuthDefinitions } from './basic-auth.types.js'
import { compareBasicAuth } from './basic.auth.js'
import { FastifyReply } from 'fastify'
import { ServerResponse } from 'http'

@Injectable()
export class BasicAuthService {
  constructor (
    @Inject(BASIC_AUTH_DEFINITIONS)
    private definitions: BasicAuthDefinitions
  ) { }

  authenticate (authorization: string | undefined, definitionName: string): boolean {
    const definition = this.definitions[definitionName]

    if (definition === undefined) {
      throw new Error(`Basic Auth definition "${definitionName}" is not registered`)
    }

    const input = parseBasicAuthHeader(authorization)

    return input !== null && compareBasicAuth(input, definition)
  }

  setBasicAuthChallenge (response: ServerResponse | FastifyReply): void {
    if ('header' in response) {
      response.header('WWW-Authenticate', 'Basic realm="Restricted"')
    } else {
      response.setHeader('WWW-Authenticate', 'Basic realm="Restricted"')
    }
  }
}