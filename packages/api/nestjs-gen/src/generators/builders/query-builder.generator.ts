import { addBuilder, BuilderOptions } from './generic-builder.generator.js'
import { Builder } from '#src/builder/builder.js'

export function generateQueryBuilder (
  builder: Builder,
  commandPath: string,
  outputPath: string
) {
  const options: BuilderOptions = {
    inputFileSuffix: '.query.ts',
    outputFileSuffix: '.query.builder.ts',
    templateFile: '../templates/builders/query-builder.hbs'
  }

  addBuilder(
    builder,
    commandPath,
    outputPath,
    options
  )
}
