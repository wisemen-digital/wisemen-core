import { NestMiddleware } from '@nestjs/common'
import { Authenticator } from '../authenticator/authenticator.js'
import { FastifyReply, FastifyRequest } from 'fastify'
import { BearerAuthContext } from '../bearer-auth.context.js'
import { UnauthorizedApiError } from '@wisemen/api-error'

export class BearerAuthMiddleware implements NestMiddleware {
  constructor(
    private authenticator: Authenticator,
    private bearerAuthContext: BearerAuthContext
  ) {}

  async use (req: FastifyRequest, _res: FastifyReply, next: (error?: unknown) => void): Promise<void> {
    try {
      const authHeader = req.headers.authorization
      const principal = await this.authenticator.authenticate(authHeader)

      this.bearerAuthContext.run(principal, next)
    } catch (error) {
      if (error instanceof UnauthorizedApiError) {
        this.bearerAuthContext.runWithError(error, next)
      } else {
        throw error
      }
    }
  }
}