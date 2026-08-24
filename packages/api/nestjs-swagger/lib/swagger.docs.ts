import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { HttpStatus, INestApplication, Logger } from '@nestjs/common'
import type { SwaggerControllerOptions } from './swagger.controller.js'
import { SwaggerDocsConfig } from './swagger.options.js'
import { DocumentBuilder, getSchemaPath, type OpenAPIObject, SwaggerModule } from '@nestjs/swagger'
import { captureException } from '@wisemen/opentelemetry'
import { InternalServerApiError } from '@wisemen/api-error'
import { OpenIdConnectOptions as OidcConfig } from './open-id-connect-options.js'
import { OpenApiDocument } from './open-api-document.js'
import { SWAGGER_HTTP_METHODS } from './constants.js'

export interface SwaggerWrittenJsonDocs {
  indexPath: string
  latestPath: string
  allPath: string
  indexHtmlPath: string
  latestHtmlPath: string
  allHtmlPath: string
}

export class SwaggerDocs {
  async writeJsonDocs (
    onApp: INestApplication,
    cfg: SwaggerDocsConfig,
    controllerOptions?: SwaggerControllerOptions
  ): Promise<SwaggerWrittenJsonDocs> {
    const oidcConfig = await this.fetchOidcConfig(cfg)
    const defaultScopes = oidcConfig?.scopes_supported ?? []
    const route = controllerOptions?.route === undefined
      ? '/api/docs'
      : controllerOptions.route === '/' || !controllerOptions.route.endsWith('/')
        ? controllerOptions.route
        : controllerOptions.route.slice(0, -1)
    const outputDir = resolve(controllerOptions?.staticFilesDir ?? './var/swagger')
    const documentation = this.buildApiDocumentation('1.0', cfg, oidcConfig)
    const indexDocument = SwaggerModule.createDocument(onApp, documentation, {
      operationIdFactory: this.createSwaggerOperationId,
      extraModels: [InternalServerApiError],
      include: []
    })
    const latestDocument = this.createDocument(onApp, 'latest', cfg, oidcConfig, true)
    const allDocument = this.createDocument(onApp, 'all', cfg, oidcConfig, false)
    const writtenDocs = {
      indexPath: `${outputDir}/index.json`,
      latestPath: `${outputDir}/latest.json`,
      allPath: `${outputDir}/all.json`,
      indexHtmlPath: `${outputDir}/index.html`,
      latestHtmlPath: `${outputDir}/latest.html`,
      allHtmlPath: `${outputDir}/all.html`
    }

    await mkdir(outputDir, { recursive: true })
    await Promise.all([
      writeFile(writtenDocs.indexPath, JSON.stringify(indexDocument, null, 2), 'utf8'),
      writeFile(writtenDocs.latestPath, JSON.stringify(latestDocument, null, 2), 'utf8'),
      writeFile(writtenDocs.allPath, JSON.stringify(allDocument, null, 2), 'utf8'),
      writeFile(
        writtenDocs.indexHtmlPath,
        this.buildSwaggerHtml('index', route, defaultScopes, cfg.redirectServer),
        'utf8'
      ),
      writeFile(
        writtenDocs.latestHtmlPath,
        this.buildSwaggerHtml('latest', route, defaultScopes, cfg.redirectServer),
        'utf8'
      ),
      writeFile(
        writtenDocs.allHtmlPath,
        this.buildSwaggerHtml('all', route, defaultScopes, cfg.redirectServer),
        'utf8'
      )
    ])

    return writtenDocs
  }

  private async fetchOidcConfig (cfg: SwaggerDocsConfig): Promise<OidcConfig | undefined> {
    if (cfg.oidcUrl === undefined) {
      return undefined
    }

    try {
      const response = await fetch(cfg.oidcUrl, { signal: AbortSignal.timeout(cfg.oidcTimeout) })

      if (!response.ok) {
        const body = await response.text()
        throw new Error(`OpenID Connect configuration endpoint responded with ${response.status}: ${body}`)
      }

      return await response.json() as OidcConfig
    } catch (err) {
      captureException(err)
      Logger.error('Failed to load OpenID Connect options', err)
      return undefined
    }
  }

  private createDocument (
    app: INestApplication,
    version: string,
    cfg: SwaggerDocsConfig,
    oidcConfig: OidcConfig | undefined,
    removeDeprecated: boolean
  ) {
    const documentation = this.buildApiDocumentation(version, cfg, oidcConfig)
    const document = SwaggerModule.createDocument(app, documentation, {
      operationIdFactory: this.createSwaggerOperationId,
      extraModels: [InternalServerApiError]
    })

    if (removeDeprecated) {
      this.removeDeprecatedEndpoints(document)
    }

    return document
  }

  private createSwaggerOperationId (
    this: void, 
    controller: string, 
    _method: string, 
    version?: string
  ): string {
    let opId = controller.replace('Controller', '')

    if (version !== undefined) {
      const lowerCaseVersion = version.toLowerCase()
      const versionWithoutPrefix = lowerCaseVersion.startsWith('v')
        ? lowerCaseVersion.slice(1)
        : lowerCaseVersion

      opId += `V${versionWithoutPrefix.toUpperCase()}`
    }

    return opId
  }

  private buildApiDocumentation (
    version: string,
    cfg: SwaggerDocsConfig,
    oidcConfig?: OidcConfig
  ): OpenApiDocument {
    const builder = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('The API documentation description')
      .setVersion(version)
      .addGlobalResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        schema: {
          properties: {
            traceId: { type: 'string', nullable: true },
            errors: {
              type: 'array',
              items: {
                oneOf: [
                  { $ref: getSchemaPath(InternalServerApiError) }
                ]
              }
            }
          }
        }
      })

    for (const server of cfg.servers) {
      builder.addServer(server)
    }

    if (oidcConfig !== undefined) {
      builder.addOAuth2(this.buildOauth2Scheme(cfg, oidcConfig))
    }

    return builder.build()
  }

  private buildOauth2Scheme (
    cfg: SwaggerDocsConfig,
    oidcConfig: OidcConfig
  ): Parameters<DocumentBuilder['addOAuth2']>[0] {
    const supportedScopes = oidcConfig.scopes_supported ?? []
    const scopes: Record<string, string> = Object.fromEntries(supportedScopes.map(s => [s, s]))

    for (const [scope, description] of Object.entries(cfg.additionalScopes ?? {})) {
      scopes[scope] = description
    }


    return {
      type: 'oauth2',
      flows: {
        authorizationCode: {
          authorizationUrl: oidcConfig.authorization_endpoint,
          tokenUrl: oidcConfig.token_endpoint,
          refreshUrl: oidcConfig.token_endpoint,
          scopes: scopes
        }
      }
    }
  }

  private removeDeprecatedEndpoints (document: OpenAPIObject) {
    for (const path in document.paths) {
      const pathItem = document.paths[path]

      for (const method of SWAGGER_HTTP_METHODS) {
        const operation = pathItem[method] as undefined | { deprecated?: boolean }

        if (operation?.deprecated === true) {
          delete pathItem[method]
        }
      }
    }
  }

  private buildSwaggerHtml (
    view: SwaggerView,
    route: string,
    defaultScopes: string[],
    redirectServer?: string
  ): string {
    const documentUrls = {
      index: `${route}-json`,
      latest: `${route}/latest-json`,
      all: `${route}/all-json`
    }
    const swaggerOptions = this.buildSwaggerOptions(view, documentUrls, redirectServer)
    const initOAuth = this.buildInitOAuthOptions(defaultScopes)
    const serializedSwaggerOptions = this.serializeForInlineScript(swaggerOptions)
    const serializedInitOAuth = initOAuth === undefined
      ? 'undefined'
      : this.serializeForInlineScript(initOAuth)

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>API Documentation</title>
  <link rel="stylesheet" type="text/css" href="${route}/swagger-ui.css">
  <link rel="icon" type="image/png" href="${route}/favicon-32x32.png" sizes="32x32" />
  <link rel="icon" type="image/png" href="${route}/favicon-16x16.png" sizes="16x16" />
  <style>
    html {
      box-sizing: border-box;
      overflow-y: scroll;
    }

    *, *:before, *:after {
      box-sizing: inherit;
    }

    body {
      margin: 0;
      background: #fafafa;
    }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>

  <script src="${route}/swagger-ui-bundle.js"></script>
  <script src="${route}/swagger-ui-standalone-preset.js"></script>
  <script>
    const swaggerOptions = ${serializedSwaggerOptions}
    const initOAuth = ${serializedInitOAuth}
    const ui = SwaggerUIBundle(swaggerOptions)

    if (initOAuth !== undefined) {
      ui.initOAuth(initOAuth)
    }

    window.ui = ui
  </script>
</body>
</html>`
  }

  private buildSwaggerOptions (
    view: SwaggerView,
    documentUrls: Record<SwaggerView, string>,
    redirectServer?: string
  ): Record<string, unknown> {
    const baseOptions: Record<string, unknown> = {
      dom_id: '#swagger-ui',
      deepLinking: true,
      presets: [
        'SwaggerUIBundle.presets.apis',
        'SwaggerUIStandalonePreset'
      ],
      plugins: [
        'SwaggerUIBundle.plugins.DownloadUrl'
      ],
      layout: 'StandaloneLayout',
      tagsSorter: 'alpha',
      persistAuthorization: true
    }

    if (redirectServer !== undefined) {
      baseOptions.oauth2RedirectUrl = `${redirectServer}/api/oauth2-redirect`
    }

    if (view === 'index') {
      baseOptions.urls = [
        { url: documentUrls.latest, name: 'Latest' },
        { url: documentUrls.all, name: 'All' }
      ]
      baseOptions['urls.primaryName'] = 'Latest'
      return baseOptions
    }

    baseOptions.url = documentUrls[view]
    return baseOptions
  }

  private buildInitOAuthOptions (defaultScopes: string[]): Record<string, unknown> | undefined {
    if (defaultScopes.length === 0) {
      return undefined
    }

    return {
      scopes: defaultScopes,
      usePkceWithAuthorizationCodeGrant: true,
      additionalQueryStringParams: {
        prompt: 'login'
      }
    }
  }

  private serializeForInlineScript (value: unknown): string {
    return JSON.stringify(value, null, 2)
      .replaceAll('"SwaggerUIBundle.presets.apis"', 'SwaggerUIBundle.presets.apis')
      .replaceAll('"SwaggerUIStandalonePreset"', 'SwaggerUIStandalonePreset')
      .replaceAll('"SwaggerUIBundle.plugins.DownloadUrl"', 'SwaggerUIBundle.plugins.DownloadUrl')
      .replaceAll('</script>', '<\\/script>')
      .replaceAll('<', '\\u003c')
  }
}

type SwaggerView = 'index' | 'latest' | 'all'
