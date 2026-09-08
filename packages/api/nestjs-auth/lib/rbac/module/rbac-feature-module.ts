import { Module, type Type } from '@nestjs/common'

const featureModules = new WeakMap<object, Map<string, Type<unknown>>>()

export function getRbacFeatureModule (role: Type<unknown>, feature: string): Type<unknown> {
  const modules = featureModules.get(role) ?? new Map<string, Type<unknown>>()
  featureModules.set(role, modules)

  const existing = modules.get(feature)
  if (existing !== undefined) return existing

  @Module({})
  class RegisteredRbacFeatureModule {}

  Object.defineProperty(RegisteredRbacFeatureModule, 'name', {
    value: `${role.name}${toPascalCase(feature)}RbacModule`
  })
  modules.set(feature, RegisteredRbacFeatureModule)
  return RegisteredRbacFeatureModule
}

function toPascalCase (value: string): string {
  return value.replaceAll(/(^|[-_])(\w)/g, (_match, _prefix, character: string) => character.toUpperCase())
}
