import { Controller, Get, Inject, Version } from '@nestjs/common'
import type { Type } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { Public } from '@wisemen/nestjs-auth'
import { API_STATUS_MODULE_OPTIONS } from './api-status.constants.js'
import type { ApiStatusModuleOptions, ResolvedApiStatusControllerOptions } from './api-status.module-options.js'
import { GetApiInfoResponse } from './get-api-info.response.js'

export function createApiStatusController (options: ResolvedApiStatusControllerOptions): Type<unknown> {
  @ApiTags(options.swaggerTag)
  @Controller(options.route)
  class ApiStatusController {
    constructor (
      @Inject(API_STATUS_MODULE_OPTIONS)
      private readonly options: ApiStatusModuleOptions
    ) {}

    @Get()
    @Public(options.isPublic)
    @Version(options.versioning)
    @ApiOkResponse({
      description: 'API info retrieved',
      type: GetApiInfoResponse
    })
    getApiInfo (): GetApiInfoResponse {
      return new GetApiInfoResponse(
        this.options.environment,
        this.options.commit,
        this.options.version,
        this.options.timestamp
      )
    }
  }

  return ApiStatusController
}
