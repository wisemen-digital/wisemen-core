/* eslint-disable node/prefer-global/process */

import { program } from 'commander'

import {
  generateFiles,
  TemplateType,
} from './generateFiles'
import { generateStylesheets } from './generateStylesheet'

program
  .command('generate <type> <moduleName>')
  .description('Generate models, services, queries, or mutations')
  .action(generateFiles)

program
  .command('generate-all <moduleName>')
  .description('Generate all files for a module')
  .action((moduleName) => {
    const types: TemplateType[] = Object.values(TemplateType)

    for (const type of types) {
      generateFiles(type, moduleName)
    }
  })

program.command('generate-styles')
  .description('Generate a stylesheet for every theme')
  .action(generateStylesheets)

program.parse(process.argv)
