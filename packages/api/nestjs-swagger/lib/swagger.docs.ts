import { HttpStatus, INestApplication, Logger } from '@nestjs/common'
import { SwaggerConfig } from './swagger.options.js'
import { DocumentBuilder, getSchemaPath, OpenAPIObject, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger'
import { captureException } from '@wisemen/opentelemetry'
import { error } from 'console'
import { InternalServerApiError } from '@wisemen/api-error'
import { OpenIdConnectOptions as OidcConfig } from './open-id-connect-options.js'
import { OpenApiDocument } from './open-api-document.js'
import { SWAGGER_HTTP_METHODS } from './constants.js'

export class SwaggerDocs {
  async register (onApp: INestApplication, cfg: SwaggerConfig): Promise<void> {
    try {
      await this.tryRegister(onApp, cfg)
    } catch (err) {
      this.addErrorPage(onApp, cfg, err)
    }
  }

  private async tryRegister (onApp: INestApplication, cfg: SwaggerConfig): Promise<void> {
    const oidcConfig = await this.fetchOidcConfig(cfg)
    const defaultScopes = oidcConfig?.scopes_supported ?? []

    this.registerDocs(onApp, `${cfg.route}/latest`, 'latest', cfg, oidcConfig, true)
    this.registerDocs(onApp, `${cfg.route}/all`, 'all', cfg, oidcConfig, false)

    const urls = [
      { url: `${cfg.route}/latest-json`, name: 'Latest' },
      { url: `${cfg.route}/all-json`, name: 'All' }
    ]

    const document = this.buildApiDocumentation('1.0', cfg, oidcConfig)
    const customOptions = this.buildSwaggerCustomOptions(defaultScopes, `${cfg.route}-json`, cfg, urls)

    const swaggerDoc = SwaggerModule.createDocument(onApp, document, {
      operationIdFactory: this.createSwaggerOperationId,
      extraModels: [InternalServerApiError],
      include: []
    })

    SwaggerModule.setup(cfg.route, onApp, swaggerDoc, customOptions)
  }


  private async fetchOidcConfig (cfg: SwaggerConfig): Promise<OidcConfig | undefined> {
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

  private registerDocs (
    app: INestApplication,
    path: string,
    version: string,
    cfg: SwaggerConfig,
    oidcConfig: OidcConfig | undefined,
    removeDeprecated: boolean
  ) {
    const defaultScopes = oidcConfig?.scopes_supported ?? []
    const customOptions = this.buildSwaggerCustomOptions(defaultScopes, `${path}-json`, cfg)
    const documentation = this.buildApiDocumentation(version, cfg, oidcConfig)
    const document = SwaggerModule.createDocument(app, documentation, {
      operationIdFactory: this.createSwaggerOperationId,
      extraModels: [InternalServerApiError]
    })

    if (removeDeprecated) {
      this.removeDeprecatedEndpoints(document)
    }

    SwaggerModule.setup(path, app, document, customOptions)
  }


  private addErrorPage (onApp: INestApplication, cfg: SwaggerConfig, err: unknown): void {
    captureException(err)
    Logger.error(err)

    const errorMessage = error as { message?: string } ?? 'Unknown error'
    const document: OpenAPIObject = {
      info: {
        title: 'Something went wrong',
        version: '',
        description: `An error occurred while generating the documentation:\n${errorMessage.message}`
      },
      openapi: '3.1.0',
      paths: {}
    }

    SwaggerModule.setup(cfg.route, onApp, document)
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

  private buildSwaggerCustomOptions (
    defaultScopes: string[],
    documentUrl: string,
    cfg: SwaggerConfig,
    urls?: object[]
  ): SwaggerCustomOptions {
    return {
      explorer: urls != undefined,
      jsonDocumentUrl: documentUrl,
      swaggerOptions: {
        urls,
        tagsSorter: 'alpha',
        persistAuthorization: true,
        oauth2RedirectUrl: cfg.redirectServer !== undefined
          ? `${cfg.redirectServer}/api/oauth2-redirect`
          : undefined,
        initOAuth: {
          scopes: defaultScopes,
          usePkceWithAuthorizationCodeGrant: true,
          additionalQueryStringParams: {
            prompt: 'login'
          }
        }
      }
    }
  }

  private buildApiDocumentation (
    version: string,
    cfg: SwaggerConfig,
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
    cfg: SwaggerConfig,
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
}