#!/usr/bin/env node
/* eslint-disable node/prefer-global/process,no-console */

import path from 'node:path'
import { fileURLToPath } from 'node:url'

import chalk from 'chalk'
import * as changeCase from 'change-case'
import ejs from 'ejs'
import fs from 'fs-extra'

// Define __dirname manually for ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const templatesDir = path.resolve(__dirname, '../templates')

interface FileTemplate {
  filename: string
  outputFolder: string
  templatePath: string
}

export enum TemplateType {
  MODEL = 'model',
  MUTATION = 'mutation',
  QUERY = 'query',
  SERVICE = 'service',
}

function getOutputFolder(type: string, kebabCase: string, folder: string): string {
  if (type === TemplateType.MODEL) {
    return path.resolve(process.cwd(), `src/models/${kebabCase}/${folder}`)
  }

  if (type === TemplateType.SERVICE) {
    return path.resolve(process.cwd(), `src/modules/${kebabCase}/${folder}`)
  }

  if (type === TemplateType.QUERY) {
    return path.resolve(process.cwd(), `src/modules/${kebabCase}/${folder}`)
  }

  if (type === TemplateType.MUTATION) {
    return path.resolve(process.cwd(), `src/modules/${kebabCase}/${folder}`)
  }

  throw new Error(`Unknown type: ${type}`)
}

const fileTemplates: Record<TemplateType, FileTemplate[]> = {
  model: [
    {
      filename: 'Index.model.ts.ejs',
      outputFolder: 'index',
      templatePath: 'models/index',
    },
    {
      filename: 'IndexDto.model.ts.ejs',
      outputFolder: 'index',
      templatePath: 'models/index',
    },
    {
      filename: 'IndexDto.builder.ts.ejs',
      outputFolder: 'index',
      templatePath: 'models/index',
    },
    {
      filename: 'IndexPaginationDto.model.ts.ejs',
      outputFolder: 'pagination',
      templatePath: 'models/pagination',
    },
    {
      filename: 'IndexPagination.model.ts.ejs',
      outputFolder: 'pagination',
      templatePath: 'models/pagination',
    },
    {
      filename: 'Detail.model.ts.ejs',
      outputFolder: 'detail',
      templatePath: 'models/detail',
    },
    {
      filename: 'DetailDto.model.ts.ejs',
      outputFolder: 'detail',
      templatePath: 'models/detail',
    },
    {
      filename: 'DetailDto.builder.ts.ejs',
      outputFolder: 'detail',
      templatePath: 'models/detail',
    },
    {
      filename: 'UpdateDto.model.ts.ejs',
      outputFolder: 'update',
      templatePath: 'models/update',
    },
    {
      filename: 'UpdateForm.model.ts.ejs',
      outputFolder: 'update',
      templatePath: 'models/update',
    },
    {
      filename: 'CreateForm.model.ts.ejs',
      outputFolder: 'create',
      templatePath: 'models/create',
    },
    {
      filename: 'CreateDto.model.ts.ejs',
      outputFolder: 'create',
      templatePath: 'models/create',
    },
    {
      filename: 'Uuid.model.ts.ejs',
      outputFolder: '',
      templatePath: 'models',
    },
    {
      filename: '.transformer.ts.ejs',
      outputFolder: '',
      templatePath: 'models',
    },
  ],
  mutation: [
    {
      filename: 'Create.mutation.ts.ejs',
      outputFolder: 'api/mutations',
      templatePath: 'mutations',
    },
    {
      filename: 'Update.mutation.ts.ejs',
      outputFolder: 'api/mutations',
      templatePath: 'mutations',
    },
    {
      filename: 'Delete.mutation.ts.ejs',
      outputFolder: 'api/mutations',
      templatePath: 'mutations',
    },
  ],
  query: [
    {
      filename: 'Index.query.ts.ejs',
      outputFolder: 'api/queries',
      templatePath: 'queries',
    },
    {
      filename: 'IndexInfinite.query.ts.ejs',
      outputFolder: 'api/queries',
      templatePath: 'queries',
    },
    {
      filename: 'Detail.query.ts.ejs',
      outputFolder: 'api/queries',
      templatePath: 'queries',
    },
  ],
  service: [
    {
      filename: '.service.ts.ejs',
      outputFolder: 'api/services',
      templatePath: 'services',
    },
  ],
}

export function generateFiles(type: TemplateType, moduleName: string): void {
  const pascalCase = changeCase.pascalCase(moduleName)
  const camelCase = changeCase.camelCase(moduleName)
  const kebabCase = changeCase.kebabCase(moduleName)
  const snakeCase = changeCase.snakeCase(moduleName)

  const replacements = {
    camelCase,
    kebabCase,
    pascalCase,
    snakeCase,
  }

  for (const template of fileTemplates[type] || []) {
    const templatePath = path.join(templatesDir, template.templatePath, template.filename)

    const outputFolder = getOutputFolder(type, kebabCase, template.outputFolder)
    const outputPath = path.join(outputFolder, `${camelCase}${template.filename.replace('.ejs', '')}`)

    try {
      const templateContent = fs.readFileSync(templatePath, 'utf8')
      const outputContent = ejs.render(templateContent, replacements)

      fs.ensureDirSync(outputFolder)
      fs.writeFileSync(outputPath, outputContent)
      console.log(chalk.green(`✅ Created: ${outputPath}`))
    }
    catch (error) {
      console.error(chalk.red(`❌ Error generating ${outputPath}:`, error))
    }
  }
}
