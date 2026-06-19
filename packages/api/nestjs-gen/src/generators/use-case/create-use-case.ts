import { kebabCase, pascalCase } from 'change-case'
import { addCommand } from './shared/command.generator.js'
import { addController } from './shared/controller.generator.js'
import { addUseCaseModule } from './shared/module.generator.js'
import { addResponse } from './shared/response.generator.js'
import { addUseCase } from './shared/use-case.generator.js'
import { addEvent } from './shared/event.generator.js'
import { addEndToEndTest, EndToEndTestOptions } from './shared/controller-e2e-test.generator.js'
import { addUseCaseUnitTest, UseCaseUnitTestOptions } from './shared/use-case-unit-test.generator.js'
import { addCommandBuilderPlaceholder } from './shared/builder.generator.js'
import { EventOptions, GeneratorOptions } from '#src/type.js'
import { Builder } from '#src/builder/builder.js'

export function addCreateUseCaseModule (
  builder: Builder,
  options: GeneratorOptions
): void {
  const useCaseName = `create ${options.module}`
  const permissionName = `${options.module} create`
  const controllerTemplate = '../templates/use-case/create/create-controller.hbs'
  const useCaseTemplate = '../templates/use-case/create/create-use-case.hbs'

  const action = `${pascalCase(options.module)}Created`
  const eventPath = addEvent(builder, options, useCaseName, action)

  const eventOptions: EventOptions = {
    name: `${action}Event`,
    path: eventPath
  }

  addUseCaseModule(builder, options, useCaseName)
  addResponse(builder, options, useCaseName)

  const commandImport = addCommand(builder, options, useCaseName)
  const commandBuilderImport = addCommandBuilderPlaceholder(builder, commandImport)

  addUseCase(builder, options, useCaseName, useCaseTemplate, eventOptions)
  addController(builder, options, useCaseName, permissionName, controllerTemplate)

  const e2eOptions: EndToEndTestOptions = {
    testDescriptionName: `Create ${options.module} e2e tests`,
    testCaseName: `Creates a new ${options.module} successfully`,
    routePath: `/api/v1/${kebabCase(options.modulePlural)}`,
    permissionName: permissionName,
    commandBuilderImport: commandBuilderImport
  }

  addEndToEndTest(builder, options, '../templates/use-case/create/create-controller-e2e-test.hbs', useCaseName, e2eOptions)

  const unitTestOptions: UseCaseUnitTestOptions = {
    useCaseName: `${pascalCase(useCaseName)}UseCase`,
    commandBuilderImport: commandBuilderImport,
    evenOptions: eventOptions
  }

  addUseCaseUnitTest(builder, options, '../templates/use-case/create/create-use-case-unit-test.hbs', useCaseName, unitTestOptions)
}
