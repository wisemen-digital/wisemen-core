import { QueryClient as TanStackQueryClient } from '@tanstack/vue-query'

import { initializeApiUtils } from '@/config/config'

import { QueryClient } from './queryClient'

export interface User {
  id: string
  uuid: string
  isActive: boolean
  name: string
  email: string
}

export interface Product {
  id: string
  name: string
  category: string
  inStock: boolean
  price: number
  sku: string
}

interface TestQueryKeys {
  productList: {
    entity: Product[]
    params: {
      category: string
    }
  }
  userDetail: {
    entity: User
    params: {
      userUuid: string
    }
  }
  userList: {
    entity: User[]
    params: {
      search: string
    }
  }
}

export function createTestSetup(): {
  queryClient: QueryClient<TestQueryKeys>
  tanstackQueryClient: TanStackQueryClient
} {
  const tanstackQueryClient = new TanStackQueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  initializeApiUtils(tanstackQueryClient)

  const queryClient = new QueryClient<TestQueryKeys>(tanstackQueryClient)

  return {
    queryClient,
    tanstackQueryClient,
  }
}
