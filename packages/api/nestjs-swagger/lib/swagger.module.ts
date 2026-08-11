import { DynamicModule, type INestApplication, Module, ModuleMetadata } from '@nestjs/common'
import { createBasicAuthMiddleware } from '@wisemen/nestjs-auth'
import { SWAGGER_DOC_ROUTES } from './constants.js'
import { createSwaggerOauth2RedirectController, SwaggerOauth2RedirectControllerOptions } from './oauth2-redirect.controller.js'
import { SwaggerConfig, SwaggerDocsOptions } from './swagger.options.js'
import { SwaggerDocs } from './swagger.docs.js'

export interface SwaggerModuleOptions extends Pick<ModuleMetadata, 'imports'> {
  /** Options to configure the oauth2 attached controller */
  oauth2RedirectController?: SwaggerOauth2RedirectControllerOptions
}

@Module({})
export class SwaggerModule {
  static forRoot (options?: SwaggerModuleOptions): DynamicModule {
    return {
      module: SwaggerModule,
      controllers: [
        createSwaggerOauth2RedirectController(options?.oauth2RedirectController)
      ]
    }
  }

  static async attachSwaggerEndpoints (
    app: INestApplication<unknown>, 
    cfg: SwaggerDocsOptions
  ): Promise<void> {

    if (cfg.basicAuth !== undefined) {
      const basicAuthMiddleware = createBasicAuthMiddleware(cfg.basicAuth)

      for (const route of SWAGGER_DOC_ROUTES) {
        app.use(route, basicAuthMiddleware)
      }
    }

    const docs = new SwaggerDocs()
    await docs.register(app, new SwaggerConfig(cfg))
  }
}
