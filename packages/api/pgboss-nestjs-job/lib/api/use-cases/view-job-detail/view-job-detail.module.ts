import { type DynamicModule, Module, type Type } from '@nestjs/common'
import { ViewJobDetailUseCase } from './view-job-detail.use-case.js'

@Module({})
export class ViewJobDetailModule {
  static register (
    controller: Type<unknown>,
    jobsApiOptionsModule: DynamicModule
  ): DynamicModule {
    return {
      module: ViewJobDetailModule,
      imports: [jobsApiOptionsModule],
      controllers: [controller],
      providers: [ViewJobDetailUseCase]
    }
  }
}
