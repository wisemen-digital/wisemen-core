import type { ApiUseMutationOptions } from './factory/createApiUtils.types'

export interface Register {}

export type RegisteredQueryKeys = Register extends { queryKeys: infer T }
  ? T extends object ? T : object
  : object

export type RegisteredErrorCodes = Register extends { errorCodes: infer T }
  ? T extends string ? T : string
  : string

export type RegisteredApiUseMutationOptions<TReqData, TResData, TParams = void>
  = ApiUseMutationOptions<RegisteredQueryKeys, TReqData, TResData, TParams, RegisteredErrorCodes>
