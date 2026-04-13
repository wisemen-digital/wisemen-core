import {
  describe,
  expect,
  it,
} from 'vitest'

import type { DeepPartial } from './deepPartial'

describe('deepPartial', () => {
  it('should make top-level properties optional', () => {
    interface User {
      id: string
      name: string
    }

    type PartialUser = DeepPartial<User>

    const user: PartialUser = {}

    expect(user).toEqual({})
  })

  it('should make nested properties optional', () => {
    interface User {
      id: string
      profile: {
        name: string
        age: number
      }
    }

    type PartialUser = DeepPartial<User>

    const user: PartialUser = {
      id: '123',
    }

    expect(user).toEqual({
      id: '123',
    })
  })

  it('should allow partial nested object', () => {
    interface User {
      id: string
      profile: {
        name: string
        age: number
      }
    }

    type PartialUser = DeepPartial<User>

    const user: PartialUser = {
      id: '123',
      profile: {
        name: 'John',
      },
    }

    expect(user).toEqual({
      id: '123',
      profile: {
        name: 'John',
      },
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

    type PartialConfig = DeepPartial<Config>

    const config: PartialConfig = {
      database: {
        connection: {
          ssl: {
            enabled: true,
          },
        },
      },
    }

    expect(config).toEqual({
      database: {
        connection: {
          ssl: {
            enabled: true,
          },
        },
      },
    })
  })

  it('should work with arrays of primitives', () => {
    interface Data {
      count: number
      tags: string[]
    }

    type PartialData = DeepPartial<Data>

    const data: PartialData = {
      tags: [
        'tag1',
        'tag2',
      ],
    }

    expect(data).toEqual({
      tags: [
        'tag1',
        'tag2',
      ],
    })
  })

  it('should preserve primitive types', () => {
    interface User {
      id: number
      name: string
      active: boolean
    }

    type PartialUser = DeepPartial<User>

    const user: PartialUser = {
      active: false,
    }

    expect(user).toEqual({
      active: false,
    })
  })
})
