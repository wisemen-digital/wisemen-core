import { HttpStatus, Injectable, NestMiddleware, Type } from '@nestjs/common'
import { IncomingMessage, ServerResponse } from 'http'
import { BasicAuthService } from './basic-auth.service.js'



export function createBasicAuthRequestHandler (
  definitionName: string,
  basicAuth: BasicAuthService
): (req: IncomingMessage, res: ServerResponse, next: () => void) => void {
  return (req, res, next) => authenticateRequest(basicAuth, definitionName, req, res, next)
}

/**
 * Creates Nestjs middleware which stops any unauthorized request.
 * A 403 unauthorized is returned for any unauthorized request.
 * 
 * @param definitionName the basic auth definition to compare against
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
      authenticateRequest(this.basicAuth, definitionName, req, res, next)
    }
  }

  return ConfiguredBasicAuthMiddleware
}

function authenticateRequest (
  basicAuth: BasicAuthService,
  definitionName: string,
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void
): void {
  if (!basicAuth.authenticate(req.headers.authorization, definitionName)) {
    res.statusCode = HttpStatus.UNAUTHORIZED
    basicAuth.setBasicAuthChallenge(res)
    res.end('Authentication required')
    return
  }

  next()
}