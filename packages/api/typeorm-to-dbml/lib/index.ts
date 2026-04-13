#!/usr/bin/env node

import * as fs from 'fs'
import * as path from 'path'
import { Project } from 'ts-morph'
import { getEntityName } from './typeorm/entity.js'
import { processEntity } from './typeorm/parser.js'
import { parseArgs } from './cli/args.js'

export function generateDbml (sourceGlob: string, outputPath: string): void {
  const project = new Project({
    skipAddingFilesFromTsConfig: true
  })

  project.addSourceFilesAtPaths(sourceGlob)

  const sourceFiles = project.getSourceFiles()

  if (sourceFiles.length === 0) {
    console.error(`No files found matching pattern: ${sourceGlob}`)
    process.exit(1)
  }

  const classToEntityMap = new Map<string, string>()

  for (const sourceFile of sourceFiles) {
    const classes = sourceFile.getClasses()

    for (const classDecl of classes) {
      if (classDecl.getDecorator('Entity')) {
        const className = classDecl.getName()
        const entityName = getEntityName(classDecl)

        if (className !== undefined) {
          classToEntityMap.set(className, entityName)
        }
      }
    }
  }

  let dbmlContent = ''

  for (const sourceFile of sourceFiles) {
    const classes = sourceFile.getClasses()

    for (const classDecl of classes) {
      if (classDecl.getDecorator('Entity')) {
        const { table, refs } = processEntity(classDecl, classToEntityMap)

        dbmlContent += table + '\n'

        if (refs.length > 0) {
          dbmlContent += refs.join('\n') + '\n\n'
        }
      }
    }
  }

  const resolvedPath = path.resolve(outputPath)

  fs.writeFileSync(resolvedPath, dbmlContent.trim(), 'utf8')

  console.log(`DBML schema generated successfully: ${resolvedPath}`)
  console.log(`Processed ${sourceFiles.length} file(s)`)
}

async function main () {
  const { sourceGlob, outputPath } = await parseArgs()

  generateDbml(sourceGlob, outputPath)
}

await main()
