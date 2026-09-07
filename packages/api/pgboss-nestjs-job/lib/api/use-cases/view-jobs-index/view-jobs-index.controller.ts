import { applyDecorators, Controller, Get, Query, Version, type Type } from '@nestjs/common'
import { ApiOAuth2, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import type { ResolvedJobsApiControllerOptions } from '../../jobs-api.module-options.js'
import type { ViewJobsIndexQuery } from './view-jobs-index.query.js'
import type { ViewJobsIndexResponse } from './view-jobs-index.response.js'
import { ViewJobsIndexUseCase } from './view-jobs-index.use-case.js'

export function createViewJobsIndexController (
  options: ResolvedJobsApiControllerOptions,
  query: Type<ViewJobsIndexQuery>,
  response: Type<ViewJobsIndexResponse>
): Type<unknown> {
  @applyDecorators(...(options.classDecorators ?? [ApiOAuth2([])]))
  @ApiTags(options.swaggerTag)
  @Controller()
  class ViewJobsIndexController {
    constructor (
      private useCase: ViewJobsIndexUseCase
    ) {}

    @Get(options.route)
    @Version(options.versioning)
    @applyDecorators(...(options.handlerDecorators ?? []))
    @ApiOkResponse({ type: response })
    async getJobs (
      @Query() input: ViewJobsIndexQuery
    ): Promise<ViewJobsIndexResponse> {
      return new response(await this.useCase.execute(input))
    }
  }

  Reflect.defineMetadata('design:paramtypes', [query], ViewJobsIndexController.prototype, 'getJobs')

  return ViewJobsIndexController
}
