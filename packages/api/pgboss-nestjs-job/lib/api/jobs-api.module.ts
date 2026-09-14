import { type DynamicModule, Module } from '@nestjs/common'
import type { JobsApiModuleAsyncOptions } from './jobs-api.module-options.js'
import { resolveViewJobDetailControllerOptions, resolveViewJobsIndexControllerOptions } from './jobs-api.module-options.js'
import { createViewJobDetailController } from './use-cases/view-job-detail/view-job-detail.controller.js'
import { ViewJobDetailModule } from './use-cases/view-job-detail/view-job-detail.module.js'
import { createViewJobDetailResponse } from './use-cases/view-job-detail/view-job-detail.response.js'
import { createViewJobsIndexController } from './use-cases/view-jobs-index/view-jobs-index.controller.js'
import { ViewJobsIndexModule } from './use-cases/view-jobs-index/view-jobs-index.module.js'
import { createViewJobsIndexQuery } from './use-cases/view-jobs-index/view-jobs-index.query.js'
import { createViewJobsIndexResponse } from './use-cases/view-jobs-index/view-jobs-index.response.js'
import { JobsApiOptionsModule } from './jobs-api-options.module.js'

@Module({})
export class JobsApiModule {
  static forRootAsync (options: JobsApiModuleAsyncOptions): DynamicModule {
    const viewJobsIndexControllerOptions = resolveViewJobsIndexControllerOptions(options.controllers?.index)
    const viewJobDetailControllerOptions = resolveViewJobDetailControllerOptions(options.controllers?.detail)
    const queueNames = [...options.queueNames]

    const jobsApiOptionsModule = JobsApiOptionsModule.forRootAsync(options, queueNames)

    const imports: DynamicModule['imports'] = [jobsApiOptionsModule]

    if (viewJobsIndexControllerOptions !== undefined) {
      const query = createViewJobsIndexQuery(queueNames)
      const response = createViewJobsIndexResponse(queueNames)
      const viewJobsIndexModule = ViewJobsIndexModule.register(
        createViewJobsIndexController(viewJobsIndexControllerOptions, query, response),
        jobsApiOptionsModule
      )

      imports.push(viewJobsIndexModule)
    }

    if (viewJobDetailControllerOptions !== undefined) {
      const response = createViewJobDetailResponse(queueNames)
      const viewJobDetailModule = ViewJobDetailModule.register(
        createViewJobDetailController(viewJobDetailControllerOptions, response),
        jobsApiOptionsModule
      )
      
      imports.push(viewJobDetailModule)
    } 


    return { module: JobsApiModule, imports }
  }
}
