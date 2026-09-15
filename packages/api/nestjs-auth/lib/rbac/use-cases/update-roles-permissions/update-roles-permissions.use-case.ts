import assert from 'node:assert'
import { Any, type DataSource, type FindOptionsWhere } from 'typeorm'
import { NotFoundCompositeApiError } from '@wisemen/api-error'
import type { DomainEventEmitter } from '@wisemen/nestjs-domain-events'
import { transaction, type TypeOrmRepository } from '@wisemen/nestjs-typeorm'
import type { Role } from '../../entity/role.entity.js'
import { RoleNotEditableError } from '../../errors/role-not-editable.error.js'
import { RoleNotFoundError } from '../../errors/role-not-found.error.js'
import { RolePermissionsUpdatedEvent } from '../../events/role.events.js'

export type UpdateRolePermissionsInput<TRole extends Role<TPermission>, TPermission extends string> = Array<{
  roleUuid: TRole['uuid']
  permissions: TPermission[]
}>

export class UpdateRolesPermissionsUseCase<TRole extends Role<TPermission>, TPermission extends string> {
  constructor (
    private readonly dataSource: DataSource,
    private readonly eventEmitter: DomainEventEmitter,
    private readonly roleRepository: TypeOrmRepository<TRole>,
    private readonly isEditable: (role: TRole) => boolean,
    private readonly subjectType: string
  ) {}

  async execute (input: UpdateRolePermissionsInput<TRole, TPermission>): Promise<void> {
    const roleUuids = input.map(item => item.roleUuid)
    const roles = await this.roleRepository.findBy({ uuid: Any(roleUuids) } as FindOptionsWhere<TRole>)
    const missingRoleUuids = roleUuids.filter(roleUuid => !roles.some(role => role.uuid === roleUuid))
    if (missingRoleUuids.length > 0) {
      throw new NotFoundCompositeApiError(missingRoleUuids.map(uuid => new RoleNotFoundError(uuid)))
    }

    const nonEditableRole = roles.find(role => !this.isEditable(role))
    if (nonEditableRole !== undefined) throw new RoleNotEditableError(nonEditableRole)
    for (const role of roles) {
      const update = input.find(item => item.roleUuid === role.uuid)
      assert(update !== undefined, 'A loaded role must have a matching update input')
      role.permissions = update.permissions
    }

    await transaction(this.dataSource, async () => {
      await this.roleRepository.save(roles)
      await this.eventEmitter.emit(roles.map(role => new RolePermissionsUpdatedEvent(role, this.subjectType)))
    })
  }
}
