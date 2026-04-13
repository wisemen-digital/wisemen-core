import {
  describe,
  expect,
  it,
} from 'vitest'

import type { DeepNullable } from './deepNullable'

describe('deepNullable', () => {
  it('should make top-level properties nullable', () => {
    interface User {
      id: string
      name: string
    }

    type NullableUser = DeepNullable<User>

    const user: NullableUser = {
      id: null,
      name: 'John',
    }

    expect(user).toEqual({
      id: null,
      name: 'John',
    })
  })

  it('should make nested properties nullable', () => {
    interface User {
      id: string
      profile: {
        name: string
        age: number
      }
    }

    type NullableUser = DeepNullable<User>

    const user: NullableUser = {
      id: 'user-123',
      profile: {
        name: 'John',
        age: null,
      },
    }

    expect(user).toEqual({
      id: 'user-123',
      profile: {
        name: 'John',
        age: null,
      },
    })
  })

  it('should allow entire nested object to be null', () => {
    interface User {
      id: string
      profile: {
        name: string
        age: number
      }
    }

    type NullableUser = DeepNullable<User>

    const user: NullableUser = {
      id: 'user-123',
      profile: null,
    }

    expect(user).toEqual({
      id: 'user-123',
      profile: null,
    })
  })

  it('should handle deeply nested objects', () => {
    interface Config {
      database: {
        connection: {
          host: string
          port: number
          ssl: {
            certificate: string
            enabled: boolean
          }
        }
      }
    }

    type NullableConfig = DeepNullable<Config>

    const config: NullableConfig = {
      database: {
        connection: {
          host: 'localhost',
          port: 5432,
          ssl: {
            certificate: null,
            enabled: false,
          },
        },
      },
    }

    expect(config).toEqual({
      database: {
        connection: {
          host: 'localhost',
          port: 5432,
          ssl: {
            certificate: null,
            enabled: false,
          },
        },
      },
    })
  })

  it('should work with multiple nested levels of nullability', () => {
    interface ApiResponse {
      data: {
        items: {
          id: string
          metadata: {
            created: string
            updated: string
          }
        }
      }
      status: string
    }

    type NullableResponse = DeepNullable<ApiResponse>

    const response: NullableResponse = {
      data: {
        items: {
          id: '123',
          metadata: null,
        },
      },
      status: 'success',
    }

    expect(response).toEqual({
      data: {
        items: {
          id: '123',
          metadata: null,
        },
      },
      status: 'success',
    })
  })

  it('should allow all properties to be nullable', () => {
    interface User {
      id: string
      name: string
    }

    type NullableUser = DeepNullable<User>

    const user: NullableUser = {
      id: null,
      name: null,
    }

    expect(user).toEqual({
      id: null,
      name: null,
    })
  })
})
