import * as tsutils from 'ts-api-utils'
import * as ts from 'typescript'

import { getValueOfLiteralType } from './getValueOfLiteralType'

// Truthiness utilities
function isTruthyLiteral(type: ts.Type): boolean {
  return tsutils.isTrueLiteralType(type)
    || (type.isLiteral() && Boolean(getValueOfLiteralType(type)))
}

export function isPossiblyFalsy(type: ts.Type): boolean {
  return tsutils
    .unionConstituents(type)
    // Intersections like `string & {}` can also be possibly falsy,
    // requiring us to look into the intersection.
    .flatMap((type) => tsutils.intersectionConstituents(type))
    // PossiblyFalsy flag includes literal values, so exclude ones that
    // are definitely truthy
    .filter((t) => !isTruthyLiteral(t))
    .some((type) => tsutils.isTypeFlagSet(type, ts.TypeFlags.PossiblyFalsy))
}

export function isPossiblyTruthy(type: ts.Type): boolean {
  return tsutils
    .unionConstituents(type)
    .map((type) => tsutils.intersectionConstituents(type))
    .some((intersectionParts) =>
      // It is possible to define intersections that are always falsy,
      // like `"" & { __brand: string }`.
      intersectionParts.every((type) => !tsutils.isFalsyType(type)))
}
