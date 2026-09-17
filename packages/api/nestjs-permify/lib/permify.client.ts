import { grpc } from '@permify/permify-node'

export const PermifyClient = class PermifyClient {}
export type PermifyClient = ReturnType<typeof grpc.newClient>

export function createPermifyAccessTokenInterceptor(
  token: string
): ReturnType<typeof grpc.newAccessTokenInterceptor> {
  return grpc.newAccessTokenInterceptor(token)
}