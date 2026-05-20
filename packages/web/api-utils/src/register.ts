import type { UseMutationOptions } from './composables/mutation/mutation.composable'

export interface Register {}

export type RegisteredQueryKeys = Register extends { queryKeys: infer T }
  ? T extends object ? T : object
  : object

export type RegisteredErrorCodes = Register extends { errorCodes: infer T }
  ? T extends string ? T : string
  : string

export type RegisteredApiUseMutationOptions<TReqData, TResData, TParams = void>
  = UseMutationOptions<TReqData, TResData, TParams, RegisteredErrorCodes>

export type RegisteredQueryKeyInput = {
  [K in keyof RegisteredQueryKeys]?: RegisteredQueryKeys[K] extends { params: infer P } ? P : unknown
}

export type RegisteredQueryKeyConfig<TKey extends PropertyKey>
  = RegisteredQueryKeys extends Record<TKey, infer V> ? V : unknown

export type RegisteredQueryKeyEntity<TKey extends PropertyKey>
  = RegisteredQueryKeyConfig<TKey> extends { entity: infer E } ? E : unknown

export type RegisteredQueryKeyParams<TKey extends PropertyKey>
  = RegisteredQueryKeyConfig<TKey> extends { params: infer P } ? P : undefined
