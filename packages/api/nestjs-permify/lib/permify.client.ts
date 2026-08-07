import { grpc } from '@permify/permify-node'

export const PermifyClient = class PermifyClient {}
export type PermifyClient = ReturnType<typeof grpc.newClient>