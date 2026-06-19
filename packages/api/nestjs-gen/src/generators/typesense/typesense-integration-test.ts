import path from 'path'
import { constantCase, kebabCase, pascalCase } from 'change-case'
import { Builder } from '#src/builder/builder.js'
import { ResolvedImport } from '#src/registry/helpers/resolver-registry.js'
import { TypesenseOptions } from '#src/type.js'

export function addTypesenseIntegrationTest (
  builder: Builder,
  options: TypesenseOptions
): ResolvedImport {
  const integrationTestPath = path.join(
    options.dir,
    options.subdir,
    kebabCase(options.name),
    'typesense',
    'tests',
    `typesense-${kebabCase(options.name)}.integration.test.ts`
  )

  builder.addFile(`${kebabCase(options.name)}-typesense-integration-test`, {
    path: integrationTestPath,
    skipIfExists: true,
    templateFile: '../templates/typesense/typesense-integration-test.hbs',
    data: {
      collectionName: constantCase(options.name),
      describeName: `${pascalCase(options.name)} typesense integration test`,
      migrateTestName: `migrates the ${options.name} collection`,
      importTestName: `imports a ${options.name} to typesense`
    }
  })

  return {
    name: `Typesense${pascalCase(options.name)}IntegrationTest`,
    path: integrationTestPath
  }
}
