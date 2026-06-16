import { kebabCase } from 'change-case'
import { addController } from './shared/controller.generator.js'
import { addUseCaseModule } from './shared/module.generator.js'
import { addUseCase } from './shared/use-case.generator.js'
import { addResponse } from './shared/response.generator.js'
import { addEndToEndTest, EndToEndTestOptions } from './shared/controller-e2e-test.generator.js'
import { ErrorOptions, GeneratorOptions } from '#src/type.js'
import { Builder } from '#src/builder/builder.js'

export function addDetailUseCaseModule (
  builder: Builder,
  options: GeneratorOptions
): void {
  const useCaseName = `view ${options.module} detail`
  const permissionName = `${options.module} read`
  const controllerTemplate = '../templates/use-case/detail/detail-controller.hbs'
  const useCaseTemplate = '../templates/use-case/detail/detail-use-case.hbs'

  const errorOptions: ErrorOptions = {
    notFoundErrorKey: options.module
  }

  addUseCaseModule(builder, options, useCaseName)
  addResponse(builder, options, useCaseName)
  addUseCase(builder, options, useCaseName, useCaseTemplate, undefined, errorOptions)
  addController(builder, options, useCaseName, permissionName, controllerTemplate, errorOptions)

  const e2eOptions: EndToEndTestOptions = {
    testDescriptionName: `view ${options.module} detail e2e tests`,
    testCaseName: `Retrieve a ${options.module} successfully`,
    routePath: `/api/v1/${kebabCase(options.modulePlural)}/\${randomUUID()}`,
    permissionName: permissionName
  }

  addEndToEndTest(builder, options, '../templates/use-case/detail/detail-controller-e2e-test.hbs', useCaseName, e2eOptions)
}
