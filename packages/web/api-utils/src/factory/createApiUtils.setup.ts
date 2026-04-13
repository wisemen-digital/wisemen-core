export type UserUuid = string

export interface FactoryUser {
  id: string
  uuid: UserUuid
  name: string
  email: string
}

export interface FactoryQueryKeys {
  userDetail: {
    entity: FactoryUser
    params: {
      userUuid: UserUuid
    }
  }
  userIndex: {
    entity: FactoryUser[]
    params: {
      search?: string
    }
  }
}
