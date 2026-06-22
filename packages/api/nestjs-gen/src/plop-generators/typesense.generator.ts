import { NodePlopAPI } from 'plop'
import { TypesenseOptions } from '#src/type.js'
import { Builder } from '#src/builder/builder.js'
import { addTypesense } from '#src/generators/typesense/typesense.generator.js'

export function setTypesenseGenerator (plop: NodePlopAPI) {
  plop.setGenerator('typesense', {
    description: 'Generate a typesense module',
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
        name: 'name',
        message: 'Entity (singular):'
      },
      {
        type: 'confirm',
        name: 'includeSubscriber',
        default: false,
        message: 'Create subscriber module:'
      }
    ],
    actions: (answers: TypesenseOptions) => {
      const builder = new Builder()

      addTypesense(builder, answers)

      return builder.build()
    }
  })
}
