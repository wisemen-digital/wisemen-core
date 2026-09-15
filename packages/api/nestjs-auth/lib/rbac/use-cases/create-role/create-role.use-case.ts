import type { Type } from '@nestjs/common'
import type { DataSource } from 'typeorm'
import type { DomainEventEmitter } from '@wisemen/nestjs-domain-events'
import { transaction, type TypeOrmRepository } from '@wisemen/nestjs-typeorm'
import type { FindOptionsWhere } from 'typeorm'
import type { Role } from '../../entity/role.entity.js'
import { RoleNameAlreadyInUseError } from '../../errors/role-name-already-in-use.error.js'
import { RoleCreatedEvent } from '../../events/role.events.js'

export class CreateRoleUseCase<TRole extends Role<TPermission>, TPermission extends string> {
  constructor (
    private readonly dataSource: DataSource,
    private readonly eventEmitter: DomainEventEmitter,
    private readonly roleRepository: TypeOrmRepository<TRole>,
    private readonly role: Type<TRole>,
    private readonly subjectType: string
  ) {}

  async execute (name: string): Promise<TRole['uuid']> {
    if (await this.roleRepository.existsBy({ name } as FindOptionsWhere<TRole>)) {
      throw new RoleNameAlreadyInUseError(name)
    }

    const role = new this.role()
    role.name = name
    role.permissions = [] as TPermission[]

    await transaction(this.dataSource, async () => {
      await this.roleRepository.insert(role as never)
      await this.eventEmitter.emitOne(new RoleCreatedEvent(role, this.subjectType))
    })

    return role.uuid
  }
}
