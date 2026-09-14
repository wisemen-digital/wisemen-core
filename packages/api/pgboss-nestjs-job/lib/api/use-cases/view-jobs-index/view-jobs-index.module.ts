import { type DynamicModule, Module, type Type } from '@nestjs/common'
import { ViewJobsIndexUseCase } from './view-jobs-index.use-case.js'

@Module({})
export class ViewJobsIndexModule {
  static register (
    controller: Type<unknown>,
    jobsApiOptionsModule: DynamicModule
  ): DynamicModule {
    return {
      module: ViewJobsIndexModule,
      imports: [jobsApiOptionsModule],
      controllers: [controller],
      providers: [ViewJobsIndexUseCase]
    }
  }
}
