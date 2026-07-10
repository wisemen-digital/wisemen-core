export interface Register {}

export type RegisteredPermission = Register extends { permission: infer T extends string } ? T : string
