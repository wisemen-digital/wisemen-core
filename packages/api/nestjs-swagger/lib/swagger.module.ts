import { type DynamicModule, type INestApplication, Module, type ModuleMetadata } from '@nestjs/common'
import type { OpenAPIObject } from '@nestjs/swagger'
import { BasicAuthService, createBasicAuthRequestHandler } from '@wisemen/nestjs-auth'
import { createSwaggerOauth2RedirectController, SwaggerOauth2RedirectControllerOptions } from './oauth2-redirect.controller.js'
import { SwaggerConfig, type SwaggerDocsOptions, type SwaggerDocumentOptions } from './swagger.options.js'
import { SwaggerDocs } from './swagger.docs.js'

export interface SwaggerModuleOptions extends Pick<ModuleMetadata, 'imports'> {
  /** 
   * Options to configure the oauth2 attached controller 
   */
  oauth2RedirectController?: SwaggerOauth2RedirectControllerOptions
}

@Module({})
export class SwaggerModule {
  static forRoot (options?: SwaggerModuleOptions): DynamicModule {
    return {
      module: SwaggerModule,
      imports: options?.imports ?? [],
      controllers: [
        createSwaggerOauth2RedirectController(options?.oauth2RedirectController)
      ]
    }
  }

  static createDocument (
    app: INestApplication<unknown>,
    cfg: SwaggerDocsOptions,
    options?: SwaggerDocumentOptions
  ): OpenAPIObject {
    const docs = new SwaggerDocs()

    return docs.createDocument(app, new SwaggerConfig(cfg), options)
  }

  static async attachSwaggerEndpoints (
    app: INestApplication<unknown>,
    cfg: SwaggerDocsOptions
  ): Promise<void> {
    const swaggerConfig = new SwaggerConfig(cfg)

    if (cfg.basicAuth !== undefined) {
      const basicAuthService = app.get(BasicAuthService, { strict: false })
      const basicAuthHandler = createBasicAuthRequestHandler(cfg.basicAuth, basicAuthService)

      for (const route of getSwaggerProtectedRoutes(swaggerConfig.route)) {
        app.use(route, basicAuthHandler)
      }
    }

    const docs = new SwaggerDocs()
    await docs.register(app, swaggerConfig)
  }
}

function getSwaggerProtectedRoutes (route: string): string[] {
  const normalizedRoute = route.endsWith('/') && route !== '/'
    ? route.slice(0, -1)
    : route

  return [
    normalizedRoute,
    `${normalizedRoute}-json`,
    `${normalizedRoute}-yaml`,
    `${normalizedRoute}/latest`,
    `${normalizedRoute}/all`,
    `${normalizedRoute}/latest-json`,
    `${normalizedRoute}/latest-yaml`,
    `${normalizedRoute}/all-json`,
    `${normalizedRoute}/all-yaml`
  ]
}
