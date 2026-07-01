import { PropertyDeclaration, PropertySignature } from 'ts-morph'

export function isCustomSymbol (property: PropertyDeclaration | PropertySignature): boolean {
  const type = property.getType().getNonNullableType()
  const symbol = type.getSymbol() ?? type.getAliasSymbol()

  if (symbol == null) {
    return false
  }

  const symbolName = symbol.getName()
  const builtInTypes = ['string', 'number', 'boolean', 'object', 'undefined', 'null', 'Date']

  if (builtInTypes.includes(symbolName)) {
    return false
  }

  return true
}
