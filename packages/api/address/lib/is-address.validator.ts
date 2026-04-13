import { Validate, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, IsObject, ValidateNested } from 'class-validator'
import { applyDecorators } from '@nestjs/common'
import { Type } from 'class-transformer'
import { AddressCommand } from './address-command.js'

export interface IsAddressValidationOptions extends ValidationOptions {
  countryRequired?: boolean
  countryCodeRequired?: boolean
  cityRequired?: boolean
  postalCodeRequired?: boolean
  streetNameRequired?: boolean
  streetNumberRequired?: boolean
  unitRequired?: boolean
  coordinatesRequired?: boolean
  placeIdRequired?: boolean
  placeNameRequired?: boolean
}

export function IsAddress (
  validationOptions?: IsAddressValidationOptions
): PropertyDecorator {
  return applyDecorators(
    ValidateNested(validationOptions),
    Type(() => AddressCommand),
    IsObject(validationOptions),
    Validate(
      IsAddressValidator,
      [{
        countryRequired: validationOptions?.countryRequired ?? false,
        countryCodeRequired: validationOptions?.countryCodeRequired ?? false,
        cityRequired: validationOptions?.cityRequired ?? false,
        postalCodeRequired: validationOptions?.postalCodeRequired ?? false,
        streetNameRequired: validationOptions?.streetNameRequired ?? false,
        streetNumberRequired: validationOptions?.streetNumberRequired ?? false,
        unitRequired: validationOptions?.unitRequired ?? false,
        coordinatesRequired: validationOptions?.coordinatesRequired ?? false,
        placeIdRequired: validationOptions?.placeIdRequired ?? false,
        placeNameRequired: validationOptions?.placeNameRequired ?? false
      }],
      validationOptions
    )
  )
}

interface ValidatorConstraints {
  countryRequired: boolean
  countryCodeRequired: boolean
  cityRequired: boolean
  postalCodeRequired: boolean
  streetNameRequired: boolean
  streetNumberRequired: boolean
  unitRequired: boolean
  coordinatesRequired: boolean
  placeIdRequired: boolean
  placeNameRequired: boolean
}

@ValidatorConstraint({ name: 'isAddress', async: false })
class IsAddressValidator implements ValidatorConstraintInterface {
  validate (address: unknown, args: ValidationArguments): boolean {
    if (!(address instanceof AddressCommand)) {
      return false
    }

    const constraints = args.constraints[0] as ValidatorConstraints

    return this.isAddressValid(address, constraints)
  }

  private isAddressValid (address: AddressCommand, constraints: ValidatorConstraints): boolean {
    return (!constraints.countryRequired || address.country != null)
      && (!constraints.countryCodeRequired || address.countryCode != null)
      && (!constraints.cityRequired || address.city != null)
      && (!constraints.postalCodeRequired || address.postalCode != null)
      && (!constraints.streetNameRequired || address.streetName != null)
      && (!constraints.streetNumberRequired || address.streetNumber != null)
      && (!constraints.unitRequired || address.unit != null)
      && (!constraints.placeIdRequired || address.placeId != null)
      && (!constraints.placeNameRequired || address.placeName != null)
  }

  defaultMessage (args: ValidationArguments): string {
    const constraints = args.constraints[0] as ValidatorConstraints
    const requiredProperties: string[] = []

    for (const key of Object.keys(constraints)) {
      if (constraints[key] === true) {
        requiredProperties.push(key)
      }
    }

    return `${args.property}: missing ${requiredProperties.join(', ')}`
  }
}
