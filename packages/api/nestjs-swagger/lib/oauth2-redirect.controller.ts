import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { Controller, Get, Res, Type, Version, VERSION_NEUTRAL } from '@nestjs/common'
import { ApiExcludeController } from '@nestjs/swagger'
import { Public } from '@wisemen/nestjs-auth'
import type { FastifyReply } from 'fastify'
import { VersionValue } from '@nestjs/common/interfaces/version-options.interface.js'

export interface SwaggerOauth2RedirectControllerOptions {
  /**
   * Marks the route as public, true by default
   */
  isPublic?: boolean

  /**
   * Version of the route, VERSION_NEUTRAL by default
   */
  version?: VersionValue

}

const oauth2RedirectHtmlPath = fileURLToPath(new URL('./oauth2-redirect.html', import.meta.url))

export function createSwaggerOauth2RedirectController (
  options?: SwaggerOauth2RedirectControllerOptions
): Type<unknown> {

  @ApiExcludeController()
  @Controller()
  class SwaggerOAuth2RedirectController {
    @Get('oauth2-redirect')
    @Public(options?.isPublic ?? true)
    @Version(options?.version ?? VERSION_NEUTRAL)
    handleRedirect (@Res() response: FastifyReply) {
      const stream = fs.createReadStream(oauth2RedirectHtmlPath)
      return response.type('text/html; charset=utf-8').send(stream)
    }
  }

  return SwaggerOAuth2RedirectController
}