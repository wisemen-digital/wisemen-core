import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { BASIC_AUTH_NAME, BasicAuthGuard } from './basic-auth.guard.js'

export function BasicAuth(name: string) {
  return applyDecorators(
    SetMetadata(BASIC_AUTH_NAME, name),
    UseGuards(BasicAuthGuard)
  )
}