import { kebabCase, pascalCase } from 'change-case'
import { addController } from './shared/controller.generator.js'
import { addUseCaseModule } from './shared/module.generator.js'
import { addUseCase } from './shared/use-case.generator.js'
import { addEvent } from './shared/event.generator.js'
import { addEndToEndTest, EndToEndTestOptions } from './shared/controller-e2e-test.generator.js'
import { addUseCaseUnitTest, UseCaseUnitTestOptions } from './shared/use-case-unit-test.generator.js'
import { ErrorOptions, EventOptions, GeneratorOptions } from '#src/type.js'
import { Builder } from '#src/builder/builder.js'

export function addDeleteUseCaseModule (
  builder: Builder,
  options: GeneratorOptions
): void {
  const useCaseName = `delete ${options.module}`
  const permissionName = `${options.module} delete`
  const controllerTemplate = '../templates/use-case/delete/delete-controller.hbs'
  const useCaseTemplate = '../templates/use-case/delete/delete-use-case.hbs'

  const action = `${pascalCase(options.module)}Deleted`
  const eventPath = addEvent(builder, options, useCaseName, action)

  const eventOptions: EventOptions = {
    name: `${action}Event`,
    path: eventPath
  }

  const errorOptions: ErrorOptions = {
    notFoundErrorKey: options.module
  }

  addUseCaseModule(builder, options, useCaseName)
  addUseCase(builder, options, useCaseName, useCaseTemplate, eventOptions, errorOptions)
  addController(builder, options, useCaseName, permissionName, controllerTemplate, errorOptions)

  const e2eOptions: EndToEndTestOptions = {
    testDescriptionName: `Delete ${options.module} e2e tests`,
    testCaseName: `Deletes a ${options.module} successfully`,
    routePath: `/api/v1/${kebabCase(options.modulePlural)}/\${randomUUID()}`,
    permissionName: permissionName
  }

  addEndToEndTest(builder, options, '../templates/use-case/delete/delete-controller-e2e-test.hbs', useCaseName, e2eOptions)

  const unitTestOptions: UseCaseUnitTestOptions = {
    useCaseName: `${pascalCase(useCaseName)}UseCase`,
    evenOptions: eventOptions,
    importNotFoundError: true,
    importUuidType: true
  }

  addUseCaseUnitTest(builder, options, '../templates/use-case/delete/delete-use-case-unit-test.hbs', useCaseName, unitTestOptions)
}
