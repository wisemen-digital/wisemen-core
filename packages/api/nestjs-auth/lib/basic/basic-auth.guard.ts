import { Injectable, CanActivate, Inject, ExecutionContext } from '@nestjs/common'
import { IncomingMessage, ServerResponse } from 'http'
import { BASIC_AUTH_DEFINITIONS, BasicAuthDefinitions } from './basic-auth.types.js'
import { compareBasicAuth } from './basic.auth.js'
import { Reflector } from '@nestjs/core'
import { parseBasicAuthHeader } from './basic-auth.header.js'
import { FastifyReply, FastifyRequest } from 'fastify'
import { BasicAuthenticationRequiredError } from './basic-authentication-required.error.js'

export const BASIC_AUTH_NAME = Symbol('wisemen.basic-auth-name')

@Injectable()
export class BasicAuthGuard implements CanActivate {
  constructor (
    @Inject(BASIC_AUTH_DEFINITIONS) private definitions: BasicAuthDefinitions,
    private reflector: Reflector
  ) { }

  canActivate (context: ExecutionContext): boolean {
    const definitionName = this.reflector.getAllAndOverride<string>(
      BASIC_AUTH_NAME,
      [
        context.getHandler(),
        context.getClass()
      ]
    )

    if (definitionName === undefined) {
      throw new Error('BasicAuthGuard was used without @UseBasicAuth(name)')
    }

    const definition = this.definitions[definitionName]
    if (definition === undefined) {
      throw new Error(`Basic Auth definition "${definitionName}" is not registered`)
    }

    const http = context.switchToHttp()
    const request = http.getRequest<IncomingMessage | FastifyRequest>()
    const response = http.getResponse<ServerResponse | FastifyReply>()

    const input = parseBasicAuthHeader(request.headers.authorization)

    if (input === null || !compareBasicAuth(input, definition)) {
      if ('header' in response) {
        response.header('WWW-Authenticate', `Basic realm="Restricted"`)
      } else {
        response.setHeader('WWW-Authenticate', `Basic realm="Restricted"`)
      }

      throw new BasicAuthenticationRequiredError()
    }

    return true
  }
}
