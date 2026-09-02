import { kebabCase, pascalCase } from 'change-case'
import { addCommand } from './shared/command.generator.js'
import { addController } from './shared/controller.generator.js'
import { addUseCaseModule } from './shared/module.generator.js'
import { addUseCase } from './shared/use-case.generator.js'
import { addEvent } from './shared/event.generator.js'
import { addEndToEndTest, EndToEndTestOptions } from './shared/controller-e2e-test.generator.js'
import { addUseCaseUnitTest, UseCaseUnitTestOptions } from './shared/use-case-unit-test.generator.js'
import { addCommandBuilderPlaceholder } from './shared/builder.generator.js'
import { ErrorOptions, EventOptions, GeneratorOptions } from '#src/type.js'
import { Builder } from '#src/builder/builder.js'

export function addUpdateUseCaseModule (
  builder: Builder,
  options: GeneratorOptions
): void {
  const useCaseName = `update ${options.module}`
  const permissionName = `${options.module} update`
  const controllerTemplate = '../templates/use-case/update/update-controller.hbs'
  const useCaseTemplate = '../templates/use-case/update/update-use-case.hbs'

  const action = `${pascalCase(options.module)}Updated`
  const eventPath = addEvent(builder, options, useCaseName, action)

  const eventOptions: EventOptions = {
    name: `${action}Event`,
    path: eventPath
  }

  const errorOptions: ErrorOptions = {
    notFoundErrorKey: options.module
  }

  addUseCaseModule(builder, options, useCaseName)

  const commandImport = addCommand(builder, options, useCaseName)
  const commandBuilderImport = addCommandBuilderPlaceholder(builder, commandImport)

  addUseCase(builder, options, useCaseName, useCaseTemplate, eventOptions, errorOptions)
  addController(builder, options, useCaseName, permissionName, controllerTemplate, errorOptions)

  const e2eOptions: EndToEndTestOptions = {
    testDescriptionName: `Update ${options.module} e2e tests`,
    testCaseName: `Updates a ${options.module} successfully`,
    routePath: `/api/v1/${kebabCase(options.modulePlural)}/\${randomUUID()}`,
    permissionName: permissionName,
    commandBuilderImport: commandBuilderImport
  }

  addEndToEndTest(builder, options, '../templates/use-case/update/update-controller-e2e-test.hbs', useCaseName, e2eOptions)

  const unitTestOptions: UseCaseUnitTestOptions = {
    useCaseName: `${pascalCase(useCaseName)}UseCase`,
    evenOptions: eventOptions,
    commandBuilderImport: commandBuilderImport,
    importNotFoundError: true,
    importUuidType: true
  }

  addUseCaseUnitTest(builder, options, '../templates/use-case/update/update-use-case-unit-test.hbs', useCaseName, unitTestOptions)
}
