import { DynamicModule, type INestApplication, Module, type ModuleMetadata } from '@nestjs/common'
import { SWAGGER_CONTROLLER_OPTIONS } from './constants.js'
import { createSwaggerController, type SwaggerControllerOptions } from './swagger.controller.js'
import { SwaggerDocs, type SwaggerWrittenJsonDocs } from './swagger.docs.js'
import { SwaggerDocsConfig, type SwaggerDocsOptions } from './swagger.options.js'

export interface SwaggerModuleOptions extends Pick<ModuleMetadata, 'imports'> {
  controller?: SwaggerControllerOptions
}

@Module({})
export class SwaggerModule {
  static forRoot (options?: SwaggerModuleOptions): DynamicModule {
    return {
      module: SwaggerModule,
      imports: options?.imports ?? [],
      providers: [
        {
          provide: SWAGGER_CONTROLLER_OPTIONS,
          useValue: options?.controller ?? {}
        }
      ],
      controllers: [
        createSwaggerController(options?.controller)
      ]
    }
  }

  static async generateStaticDocs (
    app: INestApplication<unknown>,
    cfg: SwaggerDocsOptions
  ): Promise<SwaggerWrittenJsonDocs> {
    const docs = new SwaggerDocs()
    let controllerOptions: SwaggerControllerOptions | undefined

    try {
      controllerOptions = app.get<SwaggerControllerOptions>(
        SWAGGER_CONTROLLER_OPTIONS,
        { strict: false }
      )
    } catch {
      controllerOptions = undefined
    }

    return await docs.writeJsonDocs(
      app,
      new SwaggerDocsConfig(cfg),
      controllerOptions
    )
  }
}
