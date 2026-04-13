import { Param, ParseUUIDPipe } from '@nestjs/common'
import { ApiParam } from '@nestjs/swagger'

export function UuidParam (parameterName: string) {
  return (target: object, propertyKey: string | symbol, parameterIndex: number) => {
    Param(parameterName, ParseUUIDPipe)(target, propertyKey, parameterIndex)

    const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey)

    if (descriptor) {
      const apiParam = ApiParam({ name: parameterName, type: 'string', format: 'uuid' })

      apiParam(target, propertyKey, descriptor)
    }
  }
}
