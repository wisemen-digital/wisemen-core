import { addUseCaseModule } from './shared/module.generator.js'
import { addResponse } from './shared/response.generator.js'
import { addCommand } from './shared/command.generator.js'
import { addUseCase } from './shared/use-case.generator.js'
import { addController } from './shared/controller.generator.js'
import { addEvent } from './shared/event.generator.js'
import { addUseCaseCommand } from '#src/manipulators/add-use-case-command.js'
import { addControllerCommand } from '#src/manipulators/add-controller-command.js'
import { addControllerHttpMethod } from '#src/manipulators/add-controller-http-method.js'
import { addControllerResponse } from '#src/manipulators/add-controller-response.js'
import { addUseCaseResponse } from '#src/manipulators/add-use-case-response.js'
import { Builder } from '#src/builder/builder.js'
import { EventOptions, GeneratorOptions } from '#src/type.js'

export function addCustomUseCaseModule (
  builder: Builder,
  options: GeneratorOptions,
  useCaseAction: string,
  addOns: ('response' | 'command' | 'query' | 'domain_event')[],
  domainEventName?: string
): void {
  const useCaseName = `${useCaseAction} ${options.module}`
  const permissionName = `${options.module} ${useCaseAction}`
  const controllerTemplate = '../templates/use-case/custom/custom-controller.hbs'
  const useCaseTemplate = '../templates/use-case/custom/custom-use-case.hbs'

  let eventOptions: EventOptions | undefined = undefined

  if (addOns.includes('domain_event') && domainEventName !== undefined) {
    const eventPath = addEvent(builder, options, useCaseName, domainEventName)

    eventOptions = { name: `${domainEventName}Event`, path: eventPath }
  }

  addUseCaseModule(builder, options, useCaseName)
  addUseCase(builder, options, useCaseName, useCaseTemplate, eventOptions)
  addController(builder, options, useCaseName, permissionName, controllerTemplate)

  const useCasePath = builder.getPathOrThrow(`${useCaseName}-use-case`)
  const controllerPath = builder.getPathOrThrow(`${useCaseName}-controller`)

  builder.addManipulation((): string => {
    addControllerHttpMethod(controllerPath, 'Post', `${options.modulePlural}/${useCaseAction}`)

    return 'Added controller method'
  })

  if (addOns.includes('response')) {
    addResponse(builder, options, useCaseName)

    builder.addManipulation((): string => {
      const responsePath = builder.getPathOrThrow(`${useCaseName}-response`)

      addControllerResponse(controllerPath, responsePath)
      addUseCaseResponse(useCasePath, responsePath)

      return 'Add response to use-case & controller'
    })
  }

  if (addOns.includes('command')) {
    addCommand(builder, options, useCaseName)

    builder.addManipulation((): string => {
      const commandPath = builder.getPathOrThrow(`${useCaseName}-command`)

      addUseCaseCommand(useCasePath, commandPath)
      addControllerCommand(controllerPath, commandPath)

      return 'Add command to use-case & controller'
    })
  }
}
