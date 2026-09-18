import type { DataSource, FindOptionsWhere } from 'typeorm'
import type { DomainEventEmitter } from '@wisemen/nestjs-domain-events'
import { transaction, type TypeOrmRepository } from '@wisemen/nestjs-typeorm'
import type { Role } from '../../entity/role.entity.js'
import { RoleNotEditableError } from '../../errors/role-not-editable.error.js'
import { RoleNotFoundError } from '../../errors/role-not-found.error.js'
import { RoleDeletedEvent } from '../../events/role.events.js'
import type { RoleAssignment } from '../../rbac.types.js'

export class DeleteRoleUseCase<TRole extends Role<string>, TRoleAssignment extends RoleAssignment<TRole>> {
  constructor (
    private readonly dataSource: DataSource,
    private readonly eventEmitter: DomainEventEmitter,
    private readonly roleRepository: TypeOrmRepository<TRole>,
    private readonly roleAssignmentRepository: TypeOrmRepository<TRoleAssignment>,
    private readonly isEditable: (role: TRole) => boolean,
    private readonly subjectType: string
  ) {}

  async execute (uuid: TRole['uuid']): Promise<void> {
    const role = await this.roleRepository.findOneBy({ uuid } as FindOptionsWhere<TRole>)
    if (role === null) throw new RoleNotFoundError(uuid)
    if (!this.isEditable(role)) throw new RoleNotEditableError(role)

    await transaction(this.dataSource, async () => {
      await this.roleAssignmentRepository.delete({ roleUuid: role.uuid } as FindOptionsWhere<TRoleAssignment>)
      await this.roleRepository.delete({ uuid: role.uuid } as FindOptionsWhere<TRole>)
      await this.eventEmitter.emitOne(new RoleDeletedEvent(role, this.subjectType))
    })
  }
}
