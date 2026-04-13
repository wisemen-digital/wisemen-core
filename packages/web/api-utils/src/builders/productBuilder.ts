import type { Product } from '@/utils/query-client/queryClient.setup'

export class ProductBuilder {
  private data: Product = {
    id: '1',
    name: 'Laptop',
    category: 'electronics',
    inStock: true,
    price: 999,
    sku: 'PROD-001',
  }

  build(): Product {
    return {
      ...this.data,
    }
  }

  withCategory(category: string): this {
    this.data.category = category

    return this
  }

  withId(id: string): this {
    this.data.id = id

    return this
  }

  withInStock(inStock: boolean): this {
    this.data.inStock = inStock

    return this
  }

  withName(name: string): this {
    this.data.name = name

    return this
  }

  withPrice(price: number): this {
    this.data.price = price

    return this
  }

  withSku(sku: string): this {
    this.data.sku = sku

    return this
  }
}
