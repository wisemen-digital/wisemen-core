import 'reflect-metadata'
import { SetMetadata, type ExecutionContext } from '@nestjs/common'

export const IS_PUBLIC_KEY = 'isPublic'

export function Public (isPublic = true): MethodDecorator & ClassDecorator {
  return SetMetadata(IS_PUBLIC_KEY, isPublic)
}

export function isPublicContext (context: ExecutionContext): boolean {
  return getPublicMetadata(context.getHandler())
    ?? getPublicMetadata(context.getClass())
    ?? false
}

function getPublicMetadata (target: object): boolean | undefined {
  const value = Reflect.getMetadata(IS_PUBLIC_KEY, target) as unknown

  if (typeof value !== 'boolean') {
    return undefined
  }

  return value
}
