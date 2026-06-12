import { kebabCase } from 'change-case'
import { addController } from './shared/controller.generator.js'
import { addUseCaseModule } from './shared/module.generator.js'
import { addUseCase } from './shared/use-case.generator.js'
import { addIndexResponse } from './shared/index-response.generator.js'
import { addPaginationQuery } from './shared/query.generator.js'
import { addEndToEndTest, EndToEndTestOptions } from './shared/controller-e2e-test.generator.js'
import { GeneratorOptions } from '#src/type.js'
import { Builder } from '#src/builder/builder.js'

export function addIndexUseCaseModule (
  builder: Builder,
  options: GeneratorOptions
): void {
  const useCaseName = `view ${options.module} index`
  const permissionName = `${options.module} read`
  const controllerTemplate = '../templates/use-case/index/index-controller.hbs'
  const useCaseTemplate = '../templates/use-case/index/index-use-case.hbs'

  addUseCaseModule(builder, options, useCaseName)
  addPaginationQuery(builder, options, useCaseName)
  addIndexResponse(builder, options, useCaseName)
  addUseCase(builder, options, useCaseName, useCaseTemplate)
  addController(builder, options, useCaseName, permissionName, controllerTemplate)

  const e2eOptions: EndToEndTestOptions = {
    testDescriptionName: `View ${options.module} index e2e tests`,
    testCaseName: `Retrieve ${options.modulePlural} successfully`,
    routePath: `/api/v1/${kebabCase(options.modulePlural)}`,
    permissionName: permissionName
  }

  addEndToEndTest(builder, options, '../templates/use-case/index/index-controller-e2e-test.hbs', useCaseName, e2eOptions)
}
