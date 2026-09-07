import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { IncomingMessage, ServerResponse } from 'http'
import { Reflector } from '@nestjs/core'
import { FastifyReply, FastifyRequest } from 'fastify'
import { BasicAuthenticationRequiredError } from './basic-authentication-required.error.js'
import { BasicAuthService } from './basic-auth.service.js'

export const BASIC_AUTH_NAME = Symbol('wisemen.basic-auth-name')

@Injectable()
export class BasicAuthGuard implements CanActivate {
  constructor (
    private readonly basicAuth: BasicAuthService,
    private readonly reflector: Reflector
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

    const http = context.switchToHttp()

    const request = http.getRequest<IncomingMessage | FastifyRequest>()
    const response = http.getResponse<ServerResponse | FastifyReply>()

    if (!this.basicAuth.authenticate(request.headers.authorization, definitionName)) {
      this.basicAuth.setBasicAuthChallenge(response)

      throw new BasicAuthenticationRequiredError()
    }

    return true
  }
}