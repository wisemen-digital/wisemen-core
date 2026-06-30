import { NodePlopAPI } from 'plop'
import { BuilderAnswers } from '#src/type.js'
import { Builder } from '#src/builder/builder.js'
import { generateEntityBuilder } from '#src/generators/builders/entity-builder.generator.js'
import { generateCommandBuilder } from '#src/generators/builders/command-builder.generator.js'
import { generateQueryBuilder } from '#src/generators/builders/query-builder.generator.js'
import { generateInterfaceBuilder } from '#src/generators/builders/interface-builder.generator.js'

export function setBuilderGenerator (plop: NodePlopAPI) {
  plop.setGenerator('builder', {
    description: 'Generate a builder',
    prompts: [
      {
        type: 'input',
        name: 'inputPath',
        message: 'Input path:'
      },
      {
        type: 'input',
        name: 'outputPath',
        message: 'Output path (optional):',
        default: undefined
      },
      {
        type: 'list',
        name: 'type',
        message: 'What kind of builder do you want to generate?',
        choices: [
          { name: 'Entity', value: 'entity' },
          { name: 'Command', value: 'command' },
          { name: 'Query', value: 'query' },
          { name: 'Interface', value: 'interface' }
        ]
      }
    ],
    actions: (answers: BuilderAnswers) => {
      const builder = new Builder()

      if (answers.type === 'entity') {
        generateEntityBuilder(builder, answers.inputPath, answers.outputPath)
      } else if (answers.type === 'command') {
        generateCommandBuilder(builder, answers.inputPath, answers.outputPath)
      } else if (answers.type === 'query') {
        generateQueryBuilder(builder, answers.inputPath, answers.outputPath)
      } else if (answers.type === 'interface') {
        generateInterfaceBuilder(builder, answers.inputPath, answers.outputPath)
      }

      return builder.build()
    }
  })
}
