import type { TypeOrmRepository } from '@wisemen/nestjs-typeorm'
import type { Role } from '../../entity/role.entity.js'

export class ViewRoleIndexUseCase<TRole extends Role<string>> {
  constructor (private readonly roleRepository: TypeOrmRepository<TRole>) {}

  async execute (): Promise<TRole[]> {
    return await this.roleRepository.find()
  }
}
