import { ResolverRegistry } from './helpers/resolver-registry.js'

const permissionResolvers = {
  permissionEnum: {
    glob: 'src/**/permission.enum.ts',
    type: 'enum',
    name: 'Permission'
  },
  permissionDecorator: {
    glob: 'src/**/permission.decorator.ts',
    type: 'function',
    name: 'Permissions'
  }
} as const

export const PermissionResolverRegistry = new ResolverRegistry(permissionResolvers)
