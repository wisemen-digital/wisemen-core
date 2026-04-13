import type { User } from '@/utils/query-client/queryClient.setup'

export class UserBuilder {
  private data: User = {
    id: '1',
    uuid: 'user-1',
    isActive: true,
    name: 'John Doe',
    email: 'john@example.com',
  }

  build(): User {
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

  withIsActive(isActive: boolean): this {
    this.data.isActive = isActive

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
