import type { FindOptionsWhere } from 'typeorm'
import type { TypeOrmRepository } from '@wisemen/nestjs-typeorm'
import type { Role } from '../../entity/role.entity.js'
import { RoleNotFoundError } from '../../errors/role-not-found.error.js'

export class ViewRoleDetailUseCase<TRole extends Role<string>> {
  constructor (private readonly roleRepository: TypeOrmRepository<TRole>) {}

  async execute (uuid: TRole['uuid']): Promise<TRole> {
    const role = await this.roleRepository.findOneBy({ uuid } as FindOptionsWhere<TRole>)
    if (role === null) throw new RoleNotFoundError(uuid)
    return role
  }
}
