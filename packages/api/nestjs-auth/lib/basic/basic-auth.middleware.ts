import { HttpStatus, Injectable, NestMiddleware, Type } from '@nestjs/common'
import { IncomingMessage, ServerResponse } from 'http'
import { BasicAuthService } from './basic-auth.service.js'

/**
 * Creates Nestjs middleware which stops any unauthorized request.
 * A 403 unauthorized is returned for any unauthorized request.
 * 
 * @param credential the credentials to compare against
 */
export function createBasicAuthMiddleware (
  definitionName: string
): Type<NestMiddleware> {
  @Injectable()
  class ConfiguredBasicAuthMiddleware implements NestMiddleware {
    constructor (
      private readonly basicAuth: BasicAuthService
    ) { }

    use (req: IncomingMessage, res: ServerResponse, next: () => void): void {
      if (!this.basicAuth.authenticate(req.headers.authorization, definitionName)) {
        res.statusCode = HttpStatus.UNAUTHORIZED
        this.basicAuth.setBasicAuthChallenge(res)
        res.end('Authentication required')
        return
      }

      next()
    }
  }

  return ConfiguredBasicAuthMiddleware
}