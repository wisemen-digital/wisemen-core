import type { ValidationArguments, ValidationError, ValidationOptions } from 'class-validator'
import { registerDecorator, validate } from 'class-validator'

type ConditionFunction = (object: object, value: unknown) => boolean

interface ValidateWhenConstraint {
  condition: ConditionFunction
  validationTarget: new () => Record<string, unknown>
}

const validationMessages = new WeakMap<object, Map<string, string>>()

export function ValidateWhen (
  decorators: readonly PropertyDecorator[],
  condition: ConditionFunction,
  validationOptions?: ValidationOptions
): PropertyDecorator {
  return function (object: object, propertyName: string | symbol) {
    const propertyKey = propertyName.toString()
    const validationTarget = createValidationTarget(propertyKey, decorators)

    registerDecorator({
      name: 'validateWhen',
      target: object.constructor,
      propertyName: propertyKey,
      constraints: [{ condition, validationTarget }],
      options: validationOptions,
      validator: {
        async validate (value: unknown, args: ValidationArguments): Promise<boolean> {
          const { condition, validationTarget } = args.constraints[0] as ValidateWhenConstraint

          if (!condition(args.object, value)) {
            clearValidationMessage(args.object, args.property)

            return true
          }

          const validationInstance = new validationTarget()

          Object.assign(validationInstance, args.object)
          validationInstance[args.property] = value

          const errors = await validate(validationInstance, {
            forbidUnknownValues: false,
            validationError: {
              target: false,
              value: false
            }
          })

          const messages = errors.flatMap(getValidationMessages)

          if (messages.length === 0) {
            clearValidationMessage(args.object, args.property)

            return true
          }

          setValidationMessage(args.object, args.property, messages.join(', '))

          return false
        },
        defaultMessage (args: ValidationArguments): string {
          return getValidationMessage(args.object, args.property) ?? `${args.property} is invalid`
        }
      }
    })
  }
}

function createValidationTarget (
  propertyName: string,
  decorators: readonly PropertyDecorator[]
): new () => Record<string, unknown> {
  class ValidateWhenTarget {}

  for (const decorator of decorators) {
    decorator(ValidateWhenTarget.prototype, propertyName)
  }

  return ValidateWhenTarget as new () => Record<string, unknown>
}

function getValidationMessages (error: ValidationError): string[] {
  const messages = Object.values(error.constraints ?? {})

  if (error.children === undefined || error.children.length === 0) {
    return messages
  }

  return [...messages, ...error.children.flatMap(getValidationMessages)]
}

function clearValidationMessage (object: object, propertyName: string): void {
  validationMessages.get(object)?.delete(propertyName)
}

function getValidationMessage (object: object, propertyName: string): string | undefined {
  return validationMessages.get(object)?.get(propertyName)
}

function setValidationMessage (object: object, propertyName: string, message: string): void {
  const propertyMessages = validationMessages.get(object) ?? new Map<string, string>()

  propertyMessages.set(propertyName, message)
  validationMessages.set(object, propertyMessages)
}
