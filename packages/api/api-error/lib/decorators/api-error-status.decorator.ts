import { applyDecorators, HttpStatus } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

const API_ERROR_STATUS_KEY = 'wisemen.api-error-status'

export function ApiErrorStatus (status: HttpStatus): PropertyDecorator {
    return applyDecorators(
      ApiProperty({ required: true, enum: [String(status)], example: status.toString() }),
      (target: object, _propertyKey: string | symbol): void =>  {
        Reflect.defineMetadata(API_ERROR_STATUS_KEY, status, target)
      }
  )
}

export function getApiErrorStatusMetadata(target: object): HttpStatus {
  const status = Reflect.getMetadata(API_ERROR_STATUS_KEY, target) as HttpStatus | undefined
  if(status === undefined) {
    throw new Error(`missing ${API_ERROR_STATUS_KEY} metadata on ${target}`)
  }
  return status
}
