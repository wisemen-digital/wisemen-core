import type { DataSource, FindOptionsSelect } from 'typeorm'
import type { DomainEventEmitter } from '@wisemen/nestjs-domain-events'
import { transaction, type TypeOrmRepository } from '@wisemen/nestjs-typeorm'
import { RolePermissionsCache } from '../../cache/role-permissions.cache.js'
import type { Role } from '../../entity/role.entity.js'
import { RolePermissionsCacheClearedEvent } from '../../events/role.events.js'

export class ClearRolePermissionsCacheUseCase<TRole extends Role<string>> {
  constructor (
    private readonly dataSource: DataSource,
    private readonly eventEmitter: DomainEventEmitter,
    private readonly roleRepository: TypeOrmRepository<TRole>,
    private readonly cache: RolePermissionsCache<TRole>,
    private readonly subjectType: string
  ) {}

  async execute (roleUuids?: TRole['uuid'][]): Promise<void> {
    const uuids = roleUuids ?? (await this.roleRepository.find({
      select: { uuid: true } as FindOptionsSelect<TRole>
    })).map(role => role.uuid)
    await this.cache.clear(uuids)
    await transaction(this.dataSource, async () => {
      await this.eventEmitter.emitOne(new RolePermissionsCacheClearedEvent(uuids, this.subjectType))
    })
  }
}
