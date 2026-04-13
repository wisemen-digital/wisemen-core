import { validate, ValidationError } from 'class-validator'
import { ClassConstructor, plainToInstance } from 'class-transformer'
import { CustomError } from '../errors/custom-error.js'

export abstract class Dto {}

export async function validateDto<T extends Dto> (
  data: unknown,
  dtoConstructor?: ClassConstructor<T>,
  groups?: string[]
): Promise<T | undefined> {
  if (dtoConstructor == null) {
    return undefined
  }

  if (data == null) {
    const error = new ValidationError()

    error.value = undefined
    error.constraints = {
      ['No DTO provided']: 'Expected a dto, none was provided'
    }

    throw new CustomError([error])
  }

  const dto = plainToInstance(dtoConstructor, data)

  const errors = await validate(dto, {
    whitelist: true,
    forbidNonWhitelisted: true,
    always: true,
    strictGroups: false,
    groups
  })

  if (errors.length > 0) {
    throw new CustomError(errors)
  }

  return dto
}
