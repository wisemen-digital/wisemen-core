import { addBuilder, BuilderOptions } from './generic-builder.generator.js'
import { Builder } from '#src/builder/builder.js'

export function generateCommandBuilder (
  builder: Builder,
  inputPath: string,
  outputPath: string
) {
  const options: BuilderOptions = {
    inputFileSuffix: '.command.ts',
    outputFileSuffix: '.command.builder.ts',
    templateFile: '../templates/builders/command-builder.hbs'
  }

  addBuilder(
    builder,
    inputPath,
    outputPath,
    options
  )
}
