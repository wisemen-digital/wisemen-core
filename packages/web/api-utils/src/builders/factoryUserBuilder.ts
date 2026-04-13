import type { FactoryUser } from '@/factory/createApiUtils.setup'

export class FactoryUserBuilder {
  private data: FactoryUser = {
    id: '123',
    uuid: 'uuid-123',
    name: 'John Doe',
    email: 'john@example.com',
  }

  build(): FactoryUser {
    return {
      ...this.data,
    }
  }

  withEmail(email: string): this {
    this.data.email = email

    return this
  }

  withId(id: string): this {
    this.data.id = id

    return this
  }

  withName(name: string): this {
    this.data.name = name

    return this
  }

  withUuid(uuid: string): this {
    this.data.uuid = uuid

    return this
  }
}
