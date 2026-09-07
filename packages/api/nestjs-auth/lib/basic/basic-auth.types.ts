// basic-auth.types.ts

export interface BasicAuthCredential {
  username: string
  password: string
}

/** A record which registers basic auth credentials to the record key.  */
export type BasicAuthDefinitions = Record<string, BasicAuthCredential>
export const BASIC_AUTH_DEFINITIONS = Symbol('BASIC_AUTH_DEFINITIONS')