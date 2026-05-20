/* eslint-disable ts/no-empty-object-type */
export interface Register {}

export type RegisteredPermission = Register extends { permission: infer T extends string } ? T : string
