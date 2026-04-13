import type * as ts from 'typescript'

function valueIsPseudoBigInt(value: number | string | ts.PseudoBigInt): value is ts.PseudoBigInt {
  return typeof value === 'object'
}

function pseudoBigIntToBigInt(value: ts.PseudoBigInt): bigint {
  return BigInt((value.negative ? '-' : '') + value.base10Value)
}

export function getValueOfLiteralType(type: ts.LiteralType): bigint | number | string {
  if (valueIsPseudoBigInt(type.value)) {
    return pseudoBigIntToBigInt(type.value)
  }

  return type.value
}
