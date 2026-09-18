import { Typesense, type InferDocumentType } from '../../index.js'

export function createExampleCollections (suffix: string) {
  const users = Typesense.collection(`users_${suffix}`, {
    id: Typesense.string(),
    name: Typesense.string().sort().infix(),
    email: Typesense.string().optional().sort(),
    country: Typesense.string().optional().index(false),
    age: Typesense.int32().sort(),
    isActive: Typesense.bool().facet(),
    coordinates: Typesense.geopoint().optional()
  })

  const orders = Typesense.collection(`orders_${suffix}`, {
    id: Typesense.string(),
    userId: Typesense.string().facet().reference(users.id),
    amount: Typesense.float().sort(),
    status: Typesense.string().facet(),
    placedAt: Typesense.int64().optional().sort()
  })

  const userOrders = Typesense.collection(`userOrders_${suffix}`, {
    id: Typesense.string(),
    userId: Typesense.string().reference(users.id),
    orderId: Typesense.string().reference(orders.id),
    totalSpent: Typesense.float().sort(),
    isPriority: Typesense.bool().optional().facet()
  })

  return { users, orders, userOrders }
}

export type ExampleCollections = ReturnType<typeof createExampleCollections>
export type ExampleUser = InferDocumentType<ExampleCollections['users']>
export type ExampleOrder = InferDocumentType<ExampleCollections['orders']>
export type ExampleUserOrder = InferDocumentType<ExampleCollections['userOrders']>

export function exampleUsersSeed (): ExampleUser[] {
  return [
    {
      id: 'user_1',
      name: 'John Doe',
      email: 'john@example.com',
      country: 'BE',
      age: 32,
      isActive: true,
      coordinates: [51.2194, 4.4025]
    },
    {
      id: 'user_2',
      name: 'Steve Rogers',
      country: 'US',
      age: 45,
      isActive: true
    },
    {
      id: 'user_3',
      name: 'Alice Smith',
      email: 'alice@example.com',
      country: 'US',
      age: 27,
      isActive: false
    }
  ]
}

export function exampleOrdersSeed (): ExampleOrder[] {
  return [
    {
      id: 'order_1', userId: 'user_1', amount: 42.5, status: 'shipped', placedAt: 1700000000
    },
    {
      id: 'order_2', userId: 'user_1', amount: 15, status: 'pending', placedAt: 1700100000
    },
    {
      id: 'order_3', userId: 'user_2', amount: 99.99, status: 'shipped'
    },
    {
      id: 'order_4', userId: 'user_ghost', amount: 5, status: 'cancelled'
    }
  ]
}

export function exampleUserOrdersSeed (): ExampleUserOrder[] {
  return [
    {
      id: 'user_order_1', userId: 'user_1', orderId: 'order_1', totalSpent: 42.5, isPriority: false
    },
    {
      id: 'user_order_2', userId: 'user_1', orderId: 'order_2', totalSpent: 15, isPriority: true
    },
    {
      id: 'user_order_3', userId: 'user_2', orderId: 'order_3', totalSpent: 99.99
    }
  ]
}
