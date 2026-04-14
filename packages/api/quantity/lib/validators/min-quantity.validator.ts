import { ValidatorConstraintInterface, ValidationArguments } from 'class-validator'
import { QuantityDto } from '../quantity.dto.js'
import { Quantity } from '../quantity.js'

export class MinQuantityValidator<U extends string, Q extends Quantity<U, Q>>
implements ValidatorConstraintInterface {
  constructor (
    private min: Q
  ) {}

  validate (q: unknown, _args: ValidationArguments): boolean {
    if (!(q instanceof QuantityDto)) {
      return false
    }

    const value = q.parse() as Q

    return this.min.isLessThanOrEqualTo(value)
  }

  defaultMessage (args: ValidationArguments): string {
    return `${args.property} must be >= ${this.min.toString()}`
  }
}
