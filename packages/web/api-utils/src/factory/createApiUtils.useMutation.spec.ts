/* eslint-disable unicorn/no-keyword-prefix */
import { ok } from 'neverthrow'
import {
  describe,
  expect,
  it,
} from 'vitest'
import {
  computed,
  watch,
} from 'vue'

import { FactoryUserBuilder } from '@/builders/factoryUserBuilder'
import { createApiUtils } from '@/factory/createApiUtils'
import type {
  FactoryQueryKeys,
  FactoryUser,
  UserUuid,
} from '@/factory/createApiUtils.setup'
import { runInSetup } from '@/test/runInSetup'

interface UpdateUserRequest {
  name?: string
  email?: string
}

describe('createApiUtils - useMutation', () => {
  it('executes mutation and invalidates typed query keys', async () => {
    const result = runInSetup(() => {
      const {
        useMutation, useQuery,
      } = createApiUtils<FactoryQueryKeys>()

      const user = new FactoryUserBuilder().build()

      const userQuery = useQuery('userDetail', {
        params: {
          userUuid: computed<UserUuid>(() => 'uuid-123'),
        },
        queryFn: () => Promise.resolve(ok(user)),
      })

      const updateMutation = useMutation({
        queryFn: (options: {
          body: UpdateUserRequest
          params: {
            userUuid: UserUuid
          }
        }) => {
          const {
            body, params,
          } = options

          return Promise.resolve(ok({
            id: '123',
            uuid: params.userUuid,
            name: body?.name ?? 'John Doe',
            email: body?.email ?? 'john@example.com',
          }))
        },
        queryKeysToInvalidate: {
          userDetail: {},
          // Can also use empty object to invalidate all userIndex queries
          userIndex: {},
        },
      })

      return {
        updateMutation,
        userQuery,
      }
    })

    expect(result.userQuery.result.value.isLoading()).toBeTruthy()

    await result.userQuery.refetch()
    expect(result.userQuery.result.value.isOk()).toBeTruthy()

    // Execute mutation
    const mutationResult = await result.updateMutation.execute({
      body: {
        name: 'Jane Doe',
        email: 'jane@example.com',
      },
      params: {
        userUuid: 'uuid-123',
      },
    })

    expect(mutationResult.isOk()).toBeTruthy()

    mutationResult.match((user) => {
      expect(user.name).toBe('Jane Doe')
      expect(user.email).toBe('jane@example.com')
    }, (error) => {
      expect(error).toBeUndefined()
    })
  })

  it('handles mutation without params', async () => {
    interface CreateUserRequest {
      name: string
      email: string
    }

    interface VoidParamsQueryKeys {
      userIndex: {
        entity: FactoryUser[]
        params: void
      }
    }

    const result = runInSetup(() => {
      const {
        useMutation,
      } = createApiUtils<VoidParamsQueryKeys>()

      const createMutation = useMutation<
        CreateUserRequest,
        FactoryUser,
        void
      >({
        queryFn: async ({
          body,
        }) => {
          return await Promise.resolve(ok({
            id: '126',
            uuid: 'uuid-126',
            name: body.name,
            email: body.email,
          }))
        },
        queryKeysToInvalidate: {
          userIndex: {},
        },
      })

      return {
        createMutation,
      }
    })

    // Execute mutation without params
    const mutationResult = await result.createMutation.execute({
      body: {
        name: 'New User',
        email: 'newuser@example.com',
      },
    })

    expect(mutationResult.isOk()).toBeTruthy()

    mutationResult.match((user) => {
      expect(user.name).toBe('New User')
      expect(user.email).toBe('newuser@example.com')
    }, (error) => {
      expect(error).toBeUndefined()
    })
  })

  it('tracks mutation loading state', async () => {
    interface LoadingQueryKeys {
      userDetail: {
        entity: { id: string
          name: string }
        params: void
      }
    }

    const result = runInSetup(() => {
      const {
        useMutation,
      } = createApiUtils<LoadingQueryKeys>()

      const mutation = useMutation<{ name: string }, { id: string
        name: string }, void>({
        queryFn: async ({
          body,
        }) => {
          // Simulate delay
          await new Promise((resolve) => setTimeout(resolve, 10))

          return ok({
            id: '123',
            name: body.name,
          })
        },
        queryKeysToInvalidate: {
          userDetail: {},
        },
      })

      return {
        mutation,
      }
    })

    expect(result.mutation.isLoading.value).toBeFalsy()

    const executePromise = result.mutation.execute({
      body: {
        name: 'Updated Name',
      },
    })

    // Give it a moment to start loading
    await new Promise((resolve) => setTimeout(resolve, 5))
    expect(result.mutation.isLoading.value).toBeTruthy()

    await executePromise

    expect(result.mutation.isLoading.value).toBeFalsy()
    expect(result.mutation.result.value.isOk()).toBeTruthy()
  })

  it('invalidates queries with specific params when provided', async () => {
    type UserId = string

    interface UpdateNameRequest {
      name: string
    }

    interface UserDetailQueryKeys {
      userDetail: {
        entity: { id: UserId
          name: string }
        params: {
          userId: UserId
        }
      }
    }

    let user1UpdateCount = 0
    let user2UpdateCount = 0

    const result = runInSetup(() => {
      const {
        useMutation, useQuery,
      } = createApiUtils<UserDetailQueryKeys>()

      const user1Query = useQuery('userDetail', {
        params: {
          userId: computed<UserId>(() => 'user-1'),
        },
        queryFn: () => Promise.resolve(
          ok({
            id: 'user-1',
            name: 'User 1',
          }),
        ),
      })

      const user2Query = useQuery('userDetail', {
        params: {
          userId: computed<UserId>(() => 'user-2'),
        },
        queryFn: () => Promise.resolve(
          ok({
            id: 'user-2',
            name: 'User 2',
          }),
        ),
      })

      watch(
        () => user1Query.result.value.unwrapOr(null),
        (newData) => {
          if (newData) {
            user1UpdateCount++
          }
        },
      )

      watch(
        () => user2Query.result.value.unwrapOr(null),
        (newData) => {
          if (newData) {
            user2UpdateCount++
          }
        },
      )

      const updateMutation = useMutation({
        queryFn: (options: {
          body: UpdateNameRequest
          params: {
            userId: UserId
          }
        }) => {
          return Promise.resolve(ok({
            id: options.params.userId,
            name: options.body.name,
          }))
        },
        queryKeysToInvalidate: {
          userDetail: {
            userId: (params) => params.userId,
          },
        },
      })

      return {
        updateMutation,
        user1Query,
        user2Query,
      }
    })

    // Load both queries
    await result.user1Query.refetch()
    await result.user2Query.refetch()
    expect(result.user1Query.result.value.isOk()).toBeTruthy()
    expect(result.user2Query.result.value.isOk()).toBeTruthy()
    user1UpdateCount = 0
    user2UpdateCount = 0

    // Execute mutation for user 1 only
    const mutationResult = await result.updateMutation.execute({
      body: {
        name: 'User 1 Updated',
      },
      params: {
        userId: 'user-1',
      },
    })

    expect(mutationResult.isOk()).toBeTruthy()

    // Give time for invalidation to complete
    await new Promise((resolve) => setTimeout(resolve, 100))

    // User 1's query was invalidated (but will refetch only on access or if configured with staleTime)
    // The important thing is the invalidation targeting worked - only user1 was invalidated
    // User 2's query should NOT have been updated or invalidated
    expect(user2UpdateCount).toBe(0)
    expect(user1UpdateCount).toBe(1)
  })

  it('invalidates all queries when params object is empty (void params)', async () => {
    interface Post {
      id: string
      title: string
    }

    interface CreatePostRequest {
      title: string
    }

    interface MyQueryKeys {
      postList: {
        entity: Post[]
        params: void
      }
    }

    let postListUpdateCount = 0

    const result = runInSetup(() => {
      const {
        useMutation, useQuery,
      } = createApiUtils<MyQueryKeys>()

      // Single query with void params
      const postListQuery = useQuery('postList', {
        queryFn: () => Promise.resolve(
          ok([
            {
              id: '1',
              title: 'Post 1',
            },
          ]),
        ),
      })

      // Track data updates
      watch(
        () => postListQuery.result.value.unwrapOr(null),
        (newData) => {
          if (newData) {
            postListUpdateCount++
          }
        },
      )

      // Mutation that invalidates postList with empty object
      const createPostMutation = useMutation<CreatePostRequest, Post, void>({
        queryFn: async ({
          body,
        }) => {
          return await Promise.resolve(ok({
            id: '2',
            title: body.title,
          }))
        },
        queryKeysToInvalidate: {
          postList: {},
        },
      })

      return {
        createPostMutation,
        postListQuery,
      }
    })

    // Load the query
    await result.postListQuery.refetch()
    expect(result.postListQuery.result.value.isOk()).toBeTruthy()
    expect(postListUpdateCount).toBe(1)

    // Execute mutation
    const mutationResult = await result.createPostMutation.execute({
      body: {
        title: 'New Post',
      },
    })

    expect(mutationResult.isOk()).toBeTruthy()

    // Give time for invalidation and refetch
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Query should have been invalidated and refetched (update count increased)
    expect(postListUpdateCount).toBe(2)
  })

  it('invalidates multiple query keys and their specific params', async () => {
    type ContactUuid = string

    interface Contact {
      uuid: ContactUuid
      name: string
    }

    interface UpdateContactRequest {
      name: string
    }

    interface MyQueryKeys {
      contactDetail: {
        entity: Contact
        params: {
          contactUuid: ContactUuid
        }
      }
      contactIndex: {
        entity: Contact[]
        params: {
          search?: string
        }
      }
    }

    let detailUpdateCount = 0
    let indexAllUpdateCount = 0
    let indexSearchUpdateCount = 0

    const result = runInSetup(() => {
      const {
        useMutation, useQuery,
      } = createApiUtils<MyQueryKeys>()

      // Set up detail query
      const contactDetailQuery = useQuery('contactDetail', {
        params: {
          contactUuid: computed<ContactUuid>(() => 'contact-1'),
        },

        queryFn: () => Promise.resolve(
          ok({
            uuid: 'contact-1',
            name: 'Contact 1',
          }),
        ),
      })

      // Set up index queries with different search params
      const contactIndexAllQuery = useQuery('contactIndex', {
        params: {},
        queryFn: () => Promise.resolve(
          ok([
            {
              uuid: 'contact-1',
              name: 'Contact 1',
            },
          ]),
        ),
      })

      const contactIndexSearchQuery = useQuery('contactIndex', {
        params: {
          search: computed<string>(() => 'test'),
        },
        queryFn: () => Promise.resolve(
          ok([
            {
              uuid: 'contact-1',
              name: 'Contact 1',
            },
          ]),
        ),
      })

      // Track data updates
      watch(
        () => contactDetailQuery.result.value.unwrapOr(null),
        (newData) => {
          if (newData) {
            detailUpdateCount++
          }
        },
      )

      watch(
        () => contactIndexAllQuery.result.value.unwrapOr(null),
        (newData) => {
          if (newData) {
            indexAllUpdateCount++
          }
        },
      )

      watch(
        () => contactIndexSearchQuery.result.value.unwrapOr(null),
        (newData) => {
          if (newData) {
            indexSearchUpdateCount++
          }
        },
      )

      // Mutation that invalidates both contactDetail and all contactIndex queries
      const updateContactMutation = useMutation({
        queryFn: (options: {
          body: UpdateContactRequest
          params: {
            contactUuid: ContactUuid
          }
        }) => {
          return Promise.resolve(ok({
            uuid: options.params.contactUuid,
            name: options.body.name,
          }))
        },
        queryKeysToInvalidate: {
          contactDetail: {
            contactUuid: (params) => params.contactUuid,
          },
          contactIndex: {},
        },
      })

      return {
        contactDetailQuery,
        contactIndexAllQuery,
        contactIndexSearchQuery,
        updateContactMutation,
      }
    })

    // Load all queries
    await result.contactDetailQuery.refetch()
    await result.contactIndexAllQuery.refetch()
    await result.contactIndexSearchQuery.refetch()
    // Reset counters after initial load
    detailUpdateCount = 0
    indexAllUpdateCount = 0
    indexSearchUpdateCount = 0

    // Execute mutation
    const mutationResult = await result.updateContactMutation.execute({
      body: {
        name: 'Contact 1 Updated',
      },
      params: {
        contactUuid: 'contact-1',
      },
    })

    expect(mutationResult.isOk()).toBeTruthy()

    // Give time for invalidation and potential refetch
    await new Promise((resolve) => setTimeout(resolve, 100))

    // The query was invalidated which marks it as stale
    // Without refetch trigger, the test passes when all three were marked as stale
    // In real usage, the query would refetch when component remounts or staleTime expires
    // Just verify invalidation was executed without error
    expect(mutationResult.isOk()).toBeTruthy()
    expect(detailUpdateCount).toBe(1)
    expect(indexAllUpdateCount).toBe(1)
    expect(indexSearchUpdateCount).toBe(1)
  })

  it('invalidates only the specific search variant when search params match', async () => {
    type ContactUuid = string

    interface Contact {
      uuid: ContactUuid
      name: string
    }

    interface UpdateContactRequest {
      name: string
    }

    interface MyQueryKeys {
      contactIndex: {
        entity: Contact[]
        params: {
          search?: string
        }
      }
    }

    let indexAllUpdateCount = 0
    let indexSearchTestUpdateCount = 0
    let indexSearchOtherUpdateCount = 0

    const result = runInSetup(() => {
      const {
        useMutation, useQuery,
      } = createApiUtils<MyQueryKeys>()

      // Query without search
      const contactIndexAllQuery = useQuery('contactIndex', {
        params: {},
        queryFn: () => Promise.resolve(
          ok([
            {
              uuid: 'contact-1',
              name: 'Contact 1',
            },
          ]),
        ),
      })

      // Query with search "test"
      const contactIndexTestQuery = useQuery('contactIndex', {
        params: {
          search: computed<string>(() => 'test'),
        },
        queryFn: () => Promise.resolve(
          ok([
            {
              uuid: 'contact-1',
              name: 'Contact 1',
            },
          ]),
        ),
      })

      // Query with search "other"
      const contactIndexOtherQuery = useQuery('contactIndex', {
        params: {
          search: computed<string>(() => 'other'),
        },
        queryFn: () => Promise.resolve(
          ok([
            {
              uuid: 'contact-2',
              name: 'Contact 2',
            },
          ]),
        ),
      })

      // Track data updates
      watch(
        () => contactIndexAllQuery.result.value.unwrapOr(null),
        (newData) => {
          if (newData) {
            indexAllUpdateCount++
          }
        },
      )

      watch(
        () => contactIndexTestQuery.result.value.unwrapOr(null),
        (newData) => {
          if (newData) {
            indexSearchTestUpdateCount++
          }
        },
      )

      watch(
        () => contactIndexOtherQuery.result.value.unwrapOr(null),
        (newData) => {
          if (newData) {
            indexSearchOtherUpdateCount++
          }
        },
      )

      // Mutation that only invalidates contactIndex with specific search term
      const updateContactMutation = useMutation({
        queryFn: (options: {
          body: UpdateContactRequest
          params: {
            search?: string
          }
        }) => {
          return Promise.resolve(ok({
            uuid: 'contact-1',
            name: options.body.name,
          }))
        },
        queryKeysToInvalidate: {
          contactIndex: {
            search: (params) => params.search,
          },
        },
      })

      return {
        contactIndexAllQuery,
        contactIndexOtherQuery,
        contactIndexTestQuery,
        updateContactMutation,
      }
    })

    // Load all queries
    await result.contactIndexAllQuery.refetch()
    await result.contactIndexTestQuery.refetch()
    await result.contactIndexOtherQuery.refetch()
    // Reset counters after initial load
    indexAllUpdateCount = 0
    indexSearchTestUpdateCount = 0
    indexSearchOtherUpdateCount = 0

    // Execute mutation with search="test"
    const mutationResult = await result.updateContactMutation.execute({
      body: {
        name: 'Contact 1 Updated',
      },
      params: {
        search: 'test',
      },
    })

    expect(mutationResult.isOk()).toBeTruthy()

    // Give time for invalidation and potential refetch
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Only the "test" variant should be invalidated and refetched
    expect(indexSearchTestUpdateCount).toBe(1)
    // The "other" variant should NOT be updated
    expect(indexSearchOtherUpdateCount).toBe(0)
    // The "all" (undefined search) variant should NOT be updated
    expect(indexAllUpdateCount).toBe(0)
  })
})
