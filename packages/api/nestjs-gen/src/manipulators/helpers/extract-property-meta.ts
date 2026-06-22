import { PropertyDeclaration, PropertySignature } from 'ts-morph'
import { pascalCase } from 'change-case'

export interface PropertyMeta {
  name: string
  capitalizedName: string
  type: string
  isNullable: boolean
  isUndefined: boolean
}

export function extractPropertyMeta (
  property: PropertyDeclaration | PropertySignature
): PropertyMeta {
  const type = property.getType().getNonNullableType()

  let typeName: string
  let propertyName: string

  if (type.isArray()) {
    const elementType = type.getArrayElementTypeOrThrow()
    const elementTypeSymbol = elementType.getSymbol() ?? elementType.getAliasSymbol()

    typeName = elementTypeSymbol?.getName() ?? elementType.getText()
    typeName += '[]'

    propertyName = property.getSymbolOrThrow().getName()
  } else {
    const typeSymbol = type.getSymbol() ?? type.getAliasSymbol()

    typeName = typeSymbol?.getName() ?? type.getText()
    propertyName = property.getName()
  }

  const capitalizedName = pascalCase(propertyName)
  const isNullable = property.getType().getText().includes('| null')

  return {
    name: propertyName,
    capitalizedName,
    type: typeName,
    isNullable,
    isUndefined: property.hasQuestionToken()
  }
}
