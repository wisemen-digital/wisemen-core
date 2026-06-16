import { addBuilder, BuilderOptions } from './generic-builder.generator.js'
import { Builder } from '#src/builder/builder.js'

export function generateInterfaceBuilder (
  builder: Builder,
  inputPath: string,
  outputPath: string
) {
  const options: BuilderOptions = {
    inputFileSuffix: '.ts',
    outputFileSuffix: '.builder.ts',
    templateFile: '../templates/builders/generic-builder.hbs'
  }

  addBuilder(
    builder,
    inputPath,
    outputPath,
    options
  )
}
