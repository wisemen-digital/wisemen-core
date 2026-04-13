import { Check } from 'typeorm'
import { snakeCase } from 'typeorm/util/StringUtils.js'

export function FiniteDateRangeCheck (): PropertyDecorator {
  return function (target: object, propertyKey: string | symbol) {
    const name = snakeCase(propertyKey.toString())

    return Check(
      `chk_${name}_finite`,
      `lower("${name}") != '-infinity' AND upper("${name}") != 'infinity'`
    )(target.constructor)
  }
}
