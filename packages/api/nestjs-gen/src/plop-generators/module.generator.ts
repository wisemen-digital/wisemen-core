import { NodePlopAPI } from 'plop'
import pluralize from 'pluralize'
import { GeneratorOptions, ModuleAnswers } from '#src/type.js'
import { Builder } from '#src/builder/builder.js'
import { addPermission } from '#src/generators/decorators/permission.generator.js'
import { addUuid } from '#src/generators/decorators/uuid.generator.js'
import { addModule } from '#src/generators/module/module.generator.js'
import { addModuleEntity } from '#src/generators/module/entity.generator.js'
import { addEntityBaseEvent } from '#src/generators/module/event.generator.js'
import { addCreateUseCaseModule } from '#src/generators/use-case/create-use-case.js'
import { addUpdateUseCaseModule } from '#src/generators/use-case/update-use-case.js'
import { addDeleteUseCaseModule } from '#src/generators/use-case/delete-use-case.js'
import { addDetailUseCaseModule } from '#src/generators/use-case/view-detail-use-case.js'
import { addIndexUseCaseModule } from '#src/generators/use-case/view-index-use-case.js'
import { addCustomUseCaseModule } from '#src/generators/use-case/custom-use-case.js'
import { addEntityNotFoundError } from '#src/generators/module/entity-not-found-error.generator.js'

export function setModuleGenerator (plop: NodePlopAPI) {
  plop.setGenerator('module / useCase', {
    description: 'Generate a module or useCase',
    prompts: [
      {
        type: 'input',
        name: 'dir',
        message: 'App directory:',
        default: 'src/app/'
      },
      {
        type: 'input',
        name: 'subdir',
        message: 'Subdirectory:',
        default: '/'
      },
      {
        type: 'input',
        name: 'module',
        message: 'Module (singular):'
      },
      {
        type: 'boolean',
        name: 'createEntity',
        default: true,
        message: 'Create entity?'
      },
      {
        type: 'checkbox',
        name: 'type',
        message: 'What do you want to create?',
        choices: [
          { name: 'Custom', value: 'custom', checked: false },
          { name: 'Create', value: 'create', checked: false },
          { name: 'Index', value: 'index', checked: false },
          { name: 'Detail', value: 'detail', checked: false },
          { name: 'Update', value: 'update', checked: false },
          { name: 'Delete', value: 'delete', checked: false }
        ]
      },
      {
        type: 'input',
        name: 'custom',
        message: 'Custom use case module name:',
        when: (answers: ModuleAnswers) => answers.type.includes('custom')
      },
      {
        type: 'checkbox',
        name: 'custom_addons',
        message: 'What do you want to add?',
        when: (answers: ModuleAnswers) => answers.type.includes('custom'),
        choices: [
          { name: 'Response', value: 'response', checked: true },
          { name: 'Command', value: 'command', checked: true },
          { name: 'Query', value: 'query', checked: true },
          { name: 'Event', value: 'domain_event', checked: true }
        ]
      },
      {
        type: 'input',
        name: 'domain_event_name',
        message: 'Domain event name:',
        when: (answers: ModuleAnswers) => answers.custom_addons?.includes('domain_event') ?? false
      }
    ],
    actions: (answers: ModuleAnswers) => {
      const builder = new Builder()

      const generatorOptions: GeneratorOptions = {
        dir: answers.dir,
        subdir: answers.subdir,
        module: answers.module,
        modulePlural: pluralize(answers.module)
      }

      addPermission(builder, generatorOptions)
      addUuid(builder)
      addModule(builder, generatorOptions)

      if (answers.createEntity) {
        addModuleEntity(builder, generatorOptions)
      }

      const typeRequiresBaseEvent = answers.type.some(type => ['create', 'update', 'delete'].includes(type))
      const customRequiresBaseEvent = answers.type.includes('custom')
        && answers.custom_addons != null
        && answers.custom_addons.includes('domain_event')

      if (typeRequiresBaseEvent || customRequiresBaseEvent) {
        addEntityBaseEvent(builder, generatorOptions)
      }

      if (answers.type.some(type => ['detail', 'update', 'delete'].includes(type))) {
        addEntityNotFoundError(builder, generatorOptions)
      }

      if (answers.type.includes('create')) {
        addCreateUseCaseModule(builder, generatorOptions)
      }

      if (answers.type.includes('update')) {
        addUpdateUseCaseModule(builder, generatorOptions)
      }

      if (answers.type.includes('delete')) {
        addDeleteUseCaseModule(builder, generatorOptions)
      }

      if (answers.type.includes('detail')) {
        addDetailUseCaseModule(builder, generatorOptions)
      }

      if (answers.type.includes('index')) {
        addIndexUseCaseModule(builder, generatorOptions)
      }

      if (answers.custom != null && answers.custom_addons != null) {
        addCustomUseCaseModule(
          builder,
          generatorOptions,
          answers.custom,
          answers.custom_addons,
          answers.domain_event_name
        )
      }

      return builder.build()
    }
  })
}
