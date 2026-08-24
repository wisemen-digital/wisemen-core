import fs from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Controller, Get, Res, ServiceUnavailableException, Type, VERSION_NEUTRAL, Version } from '@nestjs/common'
import type { VersionValue } from '@nestjs/common/interfaces/version-options.interface.js'
import { ApiExcludeController } from '@nestjs/swagger'
import { BasicAuth, Public } from '@wisemen/nestjs-auth'
import type { FastifyReply } from 'fastify'

export interface SwaggerControllerOptions {
  /**
   * Applies a `@wisemen/nestjs-auth` basic auth definition to the swagger routes.
   * Defaults to no basic auth.
   */
  basicAuth?: string

  /**
   * The base route to attach the swagger routes on.
   * Defaults to `/docs`
   */
  route?: string

  /**
   * Marks the docs routes as public when no basic auth is configured.
   * Defaults to `true`.
   */
  isPublic?: boolean

  /**
   * Version of the swagger routes, `VERSION_NEUTRAL` by default.
   */
  version?: VersionValue

  /**
   * Directory that contains the generated static swagger files.
   * Defaults to `./var/swagger`.
   */
  staticFilesDir?: string
}

const oauth2RedirectHtmlPath = fileURLToPath(new URL('./oauth2-redirect.html', import.meta.url))
const swaggerCssPath = fileURLToPath(new URL('./swagger-ui/swagger-ui.css', import.meta.url))
const swaggerBundlePath = fileURLToPath(new URL('./swagger-ui/swagger-ui-bundle.js', import.meta.url))
const swaggerStandalonePresetPath = fileURLToPath(new URL('./swagger-ui/swagger-ui-standalone-preset.js', import.meta.url))
const favicon16Path = fileURLToPath(new URL('./favicon-16x16.png', import.meta.url))
const favicon32Path = fileURLToPath(new URL('./favicon-32x32.png', import.meta.url))

export function createSwaggerController (
  options?: SwaggerControllerOptions
): Type<unknown> {
  const route = options?.route === undefined
    ? '/docs'
    : options.route === '/' || !options.route.endsWith('/')
      ? options.route
      : options.route.slice(0, -1)
  const nestRoute = route.startsWith('/') ? route.slice(1) : route
  const routeJson = `${nestRoute}-json`
  const routeLatest = `${nestRoute}/latest`
  const routeAll = `${nestRoute}/all`
  const routeLatestJson = `${nestRoute}/latest-json`
  const routeAllJson = `${nestRoute}/all-json`
  const routeCss = `${nestRoute}/swagger-ui.css`
  const routeBundle = `${nestRoute}/swagger-ui-bundle.js`
  const routeStandalonePreset = `${nestRoute}/swagger-ui-standalone-preset.js`
  const routeFavicon16 = `${nestRoute}/favicon-16x16.png`
  const routeFavicon32 = `${nestRoute}/favicon-32x32.png`
  const outputDir = resolve(options?.staticFilesDir ?? './var/swagger')

  @ApiExcludeController()
  @Controller()
  class SwaggerController {
    @Get('oauth2-redirect')
    @Public(true)
    @Version(options?.version ?? VERSION_NEUTRAL)
    handleRedirect (@Res() response: FastifyReply) {
      return this.sendFile(response, oauth2RedirectHtmlPath, 'text/html; charset=utf-8')
    }

    @Get(nestRoute)
    @Public(options?.isPublic)
    @Version(options?.version ?? VERSION_NEUTRAL)
    handleIndex (@Res() response: FastifyReply) {
      return this.sendHtml(response, 'index')
    }

    @Get(routeLatest)
    @Public(options?.isPublic)
    @Version(options?.version ?? VERSION_NEUTRAL)
    handleLatest (@Res() response: FastifyReply) {
      return this.sendHtml(response, 'latest')
    }

    @Get(routeAll)
    @Public(options?.isPublic)
    @Version(options?.version ?? VERSION_NEUTRAL)
    handleAll (@Res() response: FastifyReply) {
      return this.sendHtml(response, 'all')
    }

    @Get(routeJson)
    @Public(options?.isPublic)
    @Version(options?.version ?? VERSION_NEUTRAL)
    handleIndexJson (@Res() response: FastifyReply) {
      return this.sendJson(response, 'index')
    }

    @Get(routeLatestJson)
    @Public(options?.isPublic)
    @Version(options?.version ?? VERSION_NEUTRAL)
    handleLatestJson (@Res() response: FastifyReply) {
      return this.sendJson(response, 'latest')
    }

    @Get(routeAllJson)
    @Public(options?.isPublic)
    @Version(options?.version ?? VERSION_NEUTRAL)
    handleAllJson (@Res() response: FastifyReply) {
      return this.sendJson(response, 'all')
    }

    @Get(routeCss)
    @Public(options?.isPublic)
    @Version(options?.version ?? VERSION_NEUTRAL)
    handleCss (@Res() response: FastifyReply) {
      return this.sendFile(response, swaggerCssPath, 'text/css; charset=utf-8')
    }

    @Get(routeBundle)
    @Public(options?.isPublic)
    @Version(options?.version ?? VERSION_NEUTRAL)
    handleBundle (@Res() response: FastifyReply) {
      return this.sendFile(response, swaggerBundlePath, 'application/javascript; charset=utf-8')
    }

    @Get(routeStandalonePreset)
    @Public(options?.isPublic)
    @Version(options?.version ?? VERSION_NEUTRAL)
    handleStandalonePreset (@Res() response: FastifyReply) {
      return this.sendFile(response, swaggerStandalonePresetPath, 'application/javascript; charset=utf-8')
    }

    @Get(routeFavicon16)
    @Public(options?.isPublic)
    @Version(options?.version ?? VERSION_NEUTRAL)
    handleFavicon16 (@Res() response: FastifyReply) {
      return this.sendFile(response, favicon16Path, 'image/png')
    }

    @Get(routeFavicon32)
    @Public(options?.isPublic)
    @Version(options?.version ?? VERSION_NEUTRAL)
    handleFavicon32 (@Res() response: FastifyReply) {
      return this.sendFile(response, favicon32Path, 'image/png')
    }

    private sendHtml (response: FastifyReply, view: 'index' | 'latest' | 'all') {
      return this.sendGeneratedFile(response, `${outputDir}/${view}.html`, 'text/html; charset=utf-8')
    }

    private sendJson (response: FastifyReply, view: 'index' | 'latest' | 'all') {
      return this.sendGeneratedFile(response, `${outputDir}/${view}.json`, 'application/json; charset=utf-8')
    }

    private sendGeneratedFile (
      response: FastifyReply,
      path: string,
      contentType: string
    ) {
      if (!fs.existsSync(path)) {
        throw new ServiceUnavailableException('Swagger docs have not been generated yet')
      }

      return this.sendFile(response, path, contentType)
    }

    private sendFile (
      response: FastifyReply,
      path: string,
      contentType: string
    ) {
      return response.type(contentType).send(fs.createReadStream(path))
    }
  }

  if (options?.basicAuth !== undefined) {
    for (const handlerName of [
      'handleIndex',
      'handleLatest',
      'handleAll',
      'handleIndexJson',
      'handleLatestJson',
      'handleAllJson',
      'handleCss',
      'handleBundle',
      'handleStandalonePreset',
      'handleFavicon16',
      'handleFavicon32'
    ] as const) {
      BasicAuth(options.basicAuth)(
        SwaggerController.prototype,
        handlerName,
        Object.getOwnPropertyDescriptor(SwaggerController.prototype, handlerName)!
      )
    }
  }

  return SwaggerController
}
