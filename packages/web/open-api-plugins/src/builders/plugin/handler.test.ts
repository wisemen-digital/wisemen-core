import type { IR } from '@hey-api/openapi-ts'
import {
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import type { BuildersHandler } from '../types'
import { handler } from './handler'

interface SchemaEvent {
  name: string
  schema: IR.SchemaObject
}

describe('handler integration tests', () => {
  it('should generate complete output with multiple schemas', () => {
    const userSchema: IR.SchemaObject = {
      properties: {
        id: {
          type: 'number',
        },
        name: {
          type: 'string',
        },
        email: {
          format: 'email',
          type: 'string',
        },
      },
      required: [
        'id',
        'name',
        'email',
      ],
      type: 'object',
    }

    const statusSchema: IR.SchemaObject = {
      enum: [
        'active',
        'inactive',
        'pending',
      ],
      type: 'string',
    } as IR.SchemaObject

    let output = ''
    const mockFile = {
      add: vi.fn((content: string) => {
        output += content
      }),
    }

    const mockPlugin = {
      name: 'builders',
      config: {},
      createFile: vi.fn(() => mockFile),
      forEach: vi.fn((type: string, callback: (event: SchemaEvent) => void) => {
        if (type === 'schema') {
          callback({
            name: 'User',
            schema: userSchema,
          })
          callback({
            name: 'Status',
            schema: statusSchema,
          })
        }
      }),
      output: 'builders',
    }

    handler({
      plugin: mockPlugin,
    } as unknown as Parameters<BuildersHandler>[0])

    expect(output).toContain('import')
    expect(output).toContain('type BuilderOptions')
    expect(output).toContain('class UserBuilder')
    expect(output).toContain('class StatusBuilder')
    expect(output).toContain('schemas')
  })

  it('should generate output with Zod schemas', () => {
    const productSchema: IR.SchemaObject = {
      properties: {
        id: {
          type: 'number',
        },
        title: {
          type: 'string',
        },
        price: {
          minimum: 0,
          type: 'number',
        },
      },
      required: [
        'id',
        'title',
        'price',
      ],
      type: 'object',
    }

    let output = ''
    const mockFile = {
      add: vi.fn((content: string) => {
        output += content
      }),
    }

    const mockPlugin = {
      name: 'builders',
      config: {
        generateZod: true,
      },
      createFile: vi.fn(() => mockFile),
      forEach: vi.fn((type: string, callback: (event: SchemaEvent) => void) => {
        if (type === 'schema') {
          callback({
            name: 'Product',
            schema: productSchema,
          })
        }
      }),
      output: 'builders',
    }

    handler({
      plugin: mockPlugin,
    } as unknown as Parameters<BuildersHandler>[0])

    expect(output).toContain('zodSchemas')
    expect(output).toContain('z.object')
    expect(output).toContain('class ProductBuilder')
  })

  it('should generate output with static mocks', () => {
    const itemSchema: IR.SchemaObject = {
      properties: {
        name: {
          type: 'string',
        },
        quantity: {
          minimum: 0,
          type: 'integer',
        },
      },
      required: [
        'name',
        'quantity',
      ],
      type: 'object',
    }

    let output = ''
    const mockFile = {
      add: vi.fn((content: string) => {
        output += content
      }),
    }

    const mockPlugin = {
      name: 'builders',
      config: {
        mockStrategy: 'static',
      },
      createFile: vi.fn(() => mockFile),
      forEach: vi.fn((type: string, callback: (event: SchemaEvent) => void) => {
        if (type === 'schema') {
          callback({
            name: 'Item',
            schema: itemSchema,
          })
        }
      }),
      output: 'builders',
    }

    handler({
      plugin: mockPlugin,
    } as unknown as Parameters<BuildersHandler>[0])

    expect(output).not.toContain('schemas')
    expect(output).toContain('class ItemBuilder')
  })

  it('should generate output with Zod mocks', () => {
    const orderSchema: IR.SchemaObject = {
      properties: {
        orderId: {
          type: 'string',
        },
        amount: {
          type: 'number',
        },
      },
      required: [
        'orderId',
        'amount',
      ],
      type: 'object',
    }

    let output = ''
    const mockFile = {
      add: vi.fn((content: string) => {
        output += content
      }),
    }

    const mockPlugin = {
      name: 'builders',
      config: {
        mockStrategy: 'zod',
      },
      createFile: vi.fn(() => mockFile),
      forEach: vi.fn((type: string, callback: (event: SchemaEvent) => void) => {
        if (type === 'schema') {
          callback({
            name: 'Order',
            schema: orderSchema,
          })
        }
      }),
      output: 'builders',
    }

    handler({
      plugin: mockPlugin,
    } as unknown as Parameters<BuildersHandler>[0])

    expect(output).toContain('zodSchemas')
    expect(output).toContain('generateMockFromZodSchema')
    expect(output).toContain('class OrderBuilder')
  })

  it('should handle enum schemas correctly', () => {
    const roleSchema: IR.SchemaObject = {
      enum: [
        'admin',
        'user',
        'guest',
      ],
      type: 'string',
    } as IR.SchemaObject

    let output = ''
    const mockFile = {
      add: vi.fn((content: string) => {
        output += content
      }),
    }

    const mockPlugin = {
      name: 'builders',
      config: {},
      createFile: vi.fn(() => mockFile),
      forEach: vi.fn((type: string, callback: (event: SchemaEvent) => void) => {
        if (type === 'schema') {
          callback({
            name: 'Role',
            schema: roleSchema,
          })
        }
      }),
      output: 'builders',
    }

    handler({
      plugin: mockPlugin,
    } as unknown as Parameters<BuildersHandler>[0])

    expect(output).toContain('class RoleBuilder')
    expect(output).toContain('admin')
    expect(output).toContain('user')
    expect(output).toContain('guest')
  })

  it('should handle empty schema collection', () => {
    let output = ''
    const mockFile = {
      add: vi.fn((content: string) => {
        output += content
      }),
    }

    const mockPlugin = {
      name: 'builders',
      config: {},
      createFile: vi.fn(() => mockFile),
      forEach: vi.fn((_type: string, _callback: (event: unknown) => void) => {}),
      output: 'builders',
    }

    handler({
      plugin: mockPlugin,
    } as unknown as Parameters<BuildersHandler>[0])

    expect(output).toContain('import')
    expect(output).toContain('type BuilderOptions')
    expect(output).toContain('schemas = {')
  })
})
