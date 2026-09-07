import { applyDecorators, Controller, Get, Version, type Type } from '@nestjs/common'
import { ApiErrorResponse } from '@wisemen/api-error'
import { UuidParam } from '@wisemen/decorators'
import { ApiOAuth2, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import type { ResolvedJobsApiControllerOptions } from '../../jobs-api.module-options.js'
import { JobNotFoundError } from './job-not-found.api-error.js'
import type { ViewJobDetailResponse } from './view-job-detail.response.js'
import { ViewJobDetailUseCase } from './view-job-detail.use-case.js'

export function createViewJobDetailController (
  options: ResolvedJobsApiControllerOptions,
  response: Type<ViewJobDetailResponse>
): Type<unknown> {
  @applyDecorators(...(options.classDecorators ?? [ApiOAuth2([])]))
  @ApiTags(options.swaggerTag)
  @Controller()
  class ViewJobDetailController {
    constructor (
      private useCase: ViewJobDetailUseCase
    ) {}

    @Get(options.route)
    @Version(options.versioning)
    @applyDecorators(...(options.handlerDecorators ?? []))
    @ApiOkResponse({ type: response })
    @ApiErrorResponse(JobNotFoundError)
    async getJob (
      @UuidParam('jobId') jobId: string
    ): Promise<ViewJobDetailResponse> {
      return new response(await this.useCase.execute(jobId))
    }
  }

  return ViewJobDetailController
}
