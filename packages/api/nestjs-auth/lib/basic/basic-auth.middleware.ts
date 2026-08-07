import { HttpStatus } from '@nestjs/common'
import { IncomingMessage, ServerResponse } from 'http'
import { BasicAuthCredential } from './basic-auth.types.js'
import { compareBasicAuth } from './basic.auth.js'
import { parseBasicAuthHeader } from './basic-auth.header.js'
 
/**
 * Creates Nestjs middleware which stops any unauthorized request.
 * A 403 unauthorized is returned for any unauthorized request.
 * 
 * @param credential the credentials to compare against
 */
export function createBasicAuthMiddleware (credential: BasicAuthCredential) {
  // note: use node-style middleware here to avoid bringing in fastify
  return (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const basicAuth = parseBasicAuthHeader(req.headers.authorization)

    if (basicAuth === null || !compareBasicAuth(basicAuth, credential)) {
      res.statusCode = HttpStatus.UNAUTHORIZED
      res.setHeader('WWW-Authenticate', 'Basic realm="Restricted"')
      res.end('Authentication required')
      return
    }

    next()
  }
}