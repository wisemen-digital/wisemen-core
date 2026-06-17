import path from 'path'
import { GeneratorOptions } from '#src/type.js'
import { Builder } from '#src/builder/builder.js'
import { PermissionResolverRegistry } from '#src/registry/permission.registry.js'

export function addPermission (
  builder: Builder,
  { dir }: GeneratorOptions
): void {
  const permissionEnumPath = PermissionResolverRegistry.resolveImport('permissionEnum')?.path ?? path.join(dir, 'permission/permission.enum.ts')
  const permissionDecoratorPath = PermissionResolverRegistry.resolveImport('permissionDecorator')?.path ?? path.join(dir, 'permission/permission.decorator.ts')

  builder.addFile('permission-enum', {
    skipIfExists: true,
    path: permissionEnumPath,
    templateFile: '../templates/permission/permission.enum.hbs'
  })

  builder.addFile('permission-decorator', {
    skipIfExists: true,
    path: permissionDecoratorPath,
    templateFile: '../templates/permission/permission.decorator.hbs'
  })
}
