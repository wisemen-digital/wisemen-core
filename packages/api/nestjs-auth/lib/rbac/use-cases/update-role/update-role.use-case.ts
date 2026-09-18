import type { DataSource, FindOptionsWhere } from 'typeorm'
import { Not } from 'typeorm'
import type { DomainEventEmitter } from '@wisemen/nestjs-domain-events'
import { transaction, type TypeOrmRepository } from '@wisemen/nestjs-typeorm'
import type { Role } from '../../entity/role.entity.js'
import { RoleNameAlreadyInUseError } from '../../errors/role-name-already-in-use.error.js'
import { RoleNotFoundError } from '../../errors/role-not-found.error.js'
import { RoleRenamedEvent } from '../../events/role.events.js'

export class UpdateRoleUseCase<TRole extends Role<string>> {
  constructor (
    private readonly dataSource: DataSource,
    private readonly eventEmitter: DomainEventEmitter,
    private readonly roleRepository: TypeOrmRepository<TRole>,
    private readonly subjectType: string
  ) {}

  async execute (uuid: TRole['uuid'], name: string): Promise<void> {
    const role = await this.roleRepository.findOneBy({ uuid } as FindOptionsWhere<TRole>)
    if (role === null) throw new RoleNotFoundError(uuid)
    if (await this.roleRepository.existsBy({ name, uuid: Not(uuid) } as FindOptionsWhere<TRole>)) {
      throw new RoleNameAlreadyInUseError(name)
    }

    const previousName = role.name
    role.name = name
    await transaction(this.dataSource, async () => {
      await this.roleRepository.save(role)
      await this.eventEmitter.emitOne(new RoleRenamedEvent(role, previousName, this.subjectType))
    })
  }
}
