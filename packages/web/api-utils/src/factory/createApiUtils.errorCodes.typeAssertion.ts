/**
 * Type-level tests to verify error codes are correctly typed in query functions
 * These tests are not executed at runtime - they're purely for TypeScript verification
 */

import { computed } from 'vue'

import type {
  ApiError,
  ApiResult,
} from '@/types/apiError.type'

import type {
  ApiUseMutationOptions,
  ApiUseQueryOptions,
} from './createApiUtils.types'

interface TestData {
  id: string
  name: string
}

type TestErrorCodes = 'NOT_FOUND' | 'UNAUTHORIZED' | 'VALIDATION_ERROR'

interface QueryKeysConfig {
  userDetail: {
    entity: TestData
    params: { userId: string }
  }
  users: {
    entity: TestData[]
    params: void
  }
}

// Helper to verify that a value has a specific type
type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false
type AssertEquals<X extends true> = X

/**
 * Test 1: useQuery options accept TErrorCode generic parameter
 */
export function testUseQueryOptionsAcceptsErrorCodes(): void {
  type UseQueryOptions = ApiUseQueryOptions<
    QueryKeysConfig,
    'userDetail',
    TestErrorCodes
  >

  // Verify the queryFn is typed correctly
  type QueryFnType = UseQueryOptions['queryFn']
  type QueryFnReturnType = Awaited<ReturnType<QueryFnType>>
  type _ShouldBeApiResult = AssertEquals<Equals<QueryFnReturnType, ApiResult<TestData, TestErrorCodes>>>
}

/**
 * Test 2: useMutation options accept TErrorCode generic parameter
 */
export function testUseMutationOptionsAcceptsErrorCodes(): void {
  type UseMutationOptions = ApiUseMutationOptions<
    QueryKeysConfig,
    { name: string },
    TestData,
    void,
    TestErrorCodes
  >

  // Verify the queryFn is typed correctly
  type QueryFnType = UseMutationOptions['queryFn']
  type QueryFnReturnType = Awaited<ReturnType<QueryFnType>>
  type _ShouldBeApiResult = AssertEquals<Equals<QueryFnReturnType, ApiResult<TestData, TestErrorCodes>>>
}

/**
 * Test 3: ApiResult with specific error codes types TCode parameter
 */
export function testApiResultErrorCodeParameter(): void {
  type ResultWithCodes = ApiResult<TestData, TestErrorCodes>

  // The result type should be properly parameterized
  type _CheckType = ResultWithCodes

  // This is correct - should accept the type
  const _typeCheck: ResultWithCodes = null as any
}

/**
 * Test 4: ApiError with specific error codes types TCode parameter
 */
export function testApiErrorErrorCodeParameter(): void {
  type ErrorWithCodes = ApiError<TestErrorCodes>

  // The error type should be properly parameterized
  type _CheckType = ErrorWithCodes

  // This is correct - should accept the type
  const _typeCheck: ErrorWithCodes = null as any
}

/**
 * Test 5: Default error code (string) works when not specified
 */
export function testDefaultErrorCodeParameter(): void {
  type UseQueryOptions = ApiUseQueryOptions<QueryKeysConfig, 'userDetail'>

  // Without specifying TErrorCode, it should default to string
  type QueryFnType = UseQueryOptions['queryFn']
  type QueryFnReturnType = Awaited<ReturnType<QueryFnType>>
  type _ShouldBeStringErrorCodes = AssertEquals<Equals<QueryFnReturnType, ApiResult<TestData, string>>>
}

/**
 * Test 6: WRONG PATH - Mutation with mismatched error codes
 */
export function testWrongPathMutationMismatchedErrorCodes(): void {
  type UseMutationOptions = ApiUseMutationOptions<
    QueryKeysConfig,
    { name: string },
    TestData,
    void,
    TestErrorCodes
  >

  const _options: UseMutationOptions = {
  // @ts-expect-error - ApiResult<TestData, 'OTHER_ERROR'> is not assignable to ApiResult<TestData, TestErrorCodes>
    queryFn: () => {
      return null as any as Promise<ApiResult<TestData, 'OTHER_ERROR'>>
    },
  }
}

/**
 * Test 7: WRONG PATH - Query with mismatched error codes
 */
export function testWrongPathQueryMismatchedErrorCodes(): void {
  type UseQueryOptions = ApiUseQueryOptions<
    QueryKeysConfig,
    'userDetail',
    TestErrorCodes
  >

  // queryFn returning different error codes should be error
  const _options: UseQueryOptions = {
    params: {
      userId: computed<string>(() => '123'),
    },
    // @ts-expect-error - ApiResult<TestData, 'OTHER_ERROR'> is not assignable to ApiResult<TestData, TestErrorCodes>
    queryFn: () => {
      const test = null as any as Awaited<Promise<ApiResult<TestData, 'OTHER_ERROR'>>>

      if (test.isOk()) {
        const _data: TestData = test.value
      }
      else {
        const _error = test.error
      }

      return null as any as Promise<ApiResult<TestData, 'OTHER_ERROR'>>
    },
  }
}

/**
 * Test 8: CORRECT PATH - Mutation with matching error codes
 */
export function testCorrectPathMutationWithMatchingErrorCodes(): void {
  type UseMutationOptions = ApiUseMutationOptions<
    QueryKeysConfig,
    { name: string },
    TestData,
    void,
    TestErrorCodes
  >

  const _options: UseMutationOptions = {
    queryFn: () => {
      return null as any as Promise<ApiResult<TestData, TestErrorCodes>>
    },
  }
}

/**
 * Test 9: CORRECT PATH - Query with matching error codes
 */
export function testCorrectPathQueryWithMatchingErrorCodes(): void {
  type UseQueryOptions = ApiUseQueryOptions<
    QueryKeysConfig,
    'userDetail',
    TestErrorCodes
  >

  const _options: UseQueryOptions = {
    params: {
      userId: computed<string>(() => '123'),
    },
    queryFn: () => {
      return null as any as Promise<ApiResult<TestData, TestErrorCodes>>
    },
  }
}
