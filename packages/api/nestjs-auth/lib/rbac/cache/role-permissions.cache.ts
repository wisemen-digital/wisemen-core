import { Any, type FindOptionsWhere } from 'typeorm'
import type { RedisClient } from '@wisemen/nestjs-redis'
import type { TypeOrmRepository } from '@wisemen/nestjs-typeorm'
import type { Role } from '../entity/role.entity.js'

export class RolePermissionsCache<TRole extends Role<string>> {
  constructor (
    private redisClient: RedisClient,
    private roleRepository: TypeOrmRepository<TRole>,
    private prefix: string
  ) {}

  async clear (roleUuids: TRole['uuid'][]): Promise<void> {
    await this.redisClient.deleteCachedValues(roleUuids.map(roleUuid => this.key(roleUuid)))
  }

  async get (roleUuids: TRole['uuid'][]): Promise<TRole['permissions'][number][]> {
    if (roleUuids.length === 0) return []

    const keys = roleUuids.map(roleUuid => this.key(roleUuid))
    const cached = await this.redisClient.getCachedValues<TRole['permissions'][number][]>(keys)
    const missing = roleUuids.filter((_, index) => cached[index] === null)
    const permissions = cached.flatMap(value => value ?? [])

    if (missing.length === 0) return permissions

    const roles = await this.roleRepository.findBy({ uuid: Any(missing) } as FindOptionsWhere<TRole>)
    await this.redisClient.putCachedValues(
      roles.map(role => this.key(role.uuid)),
      roles.map(role => role.permissions)
    )

    return [...permissions, ...roles.flatMap(role => role.permissions)]
  }

  private key (roleUuid: TRole['uuid']): string {
    return `${this.prefix}.${roleUuid}`
  }
}
